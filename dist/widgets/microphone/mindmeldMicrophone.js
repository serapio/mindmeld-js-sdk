/**
 * Adds the MindMeldMicrophone singleton object to the global namespace. The MindMeldMicrophone
 * exposes the following methods:
 * - initialize(): sets the listener config for MM.Listener, registers click handlers, and sets up volume monitor
 * - start(): starts recording
 * - stop(): stops recording
 * - listening(): returns a boolean indicating whether the mic is listening
 * - on(event, callback, context): register for a MindMeldMicrophone event. Events exposed:
 *  - 'init': fired after initialize() finishes
 *  - 'result': there is a speech-to-text result
 *  - 'start': the microphone starts recording
 *  - 'stop': the microphone stops recording
 *  - 'error': there was an error with the microphone
 */

'use strict';
(function microphone (MM) {

    var MindMeldMicrophone = window.MindMeldMicrophone = window.MindMeldMicrophone || {};
    var containerElement;
    var listener;
    var volumeMonitor;


    // initialize() checks for speech recognition support,
    // sets up the MM.activeSession's Listener, initializes
    // the volume monitor, and initializes mindmeld-microphone's
    // click handlers
    MindMeldMicrophone.initialize = function initialize () {
        containerElement = document.querySelector('.mindmeld-microphone');
        if (! MM.support.speechRecognition) {
            containerElement.classList.add('disabled');
            var errorMessage = 'This browser does not support speech recognition';
            MindMeldMicrophone.publishEvent('error', errorMessage);
            return;
        }

        initMMListener();
        initVolumeMonitor();
        initClickHandlers();
        initUIHandlers();
        MindMeldMicrophone.publishEvent('init');
    };

    // Sets the listener config for MM.activeSession's Listener. The mindmeld-microphone's
    // event handlers publish the Listener events like onResult and onEnd
    function initMMListener () {
        listener = MM.activeSession.listener;
        var listenerConfig = {

            interimResults: true,

            onResult: function (result, resultIndex, results, event) {
                MindMeldMicrophone.publishEvent('result', result, resultIndex, results, event);
            },

            onStart: function (event) {
                MindMeldMicrophone.publishEvent('start', event);
            },

            onEnd: function (event) {
                MindMeldMicrophone.publishEvent('end', event);
            },

            onError: function (error) {
                MindMeldMicrophone.publishEvent('error', error);
            }
        };

        MM.activeSession.setListenerConfig(listenerConfig);
    }

    // Initializes the volume monitor used to animate the microphone
    // as the volume changes
    function initVolumeMonitor () {
        var volumePulser = containerElement.querySelector('.volume-pulser');

        volumeMonitor = new window.VolumeMonitor({
            listener: listener,

            // Animate volume pulser by scaling a background circle based on volume
            onVolumeChange: function onVolumeChanged (volume) {
                var scale = ((volume / 100) * 0.5) + 1.0;
                volumePulser.style.transform = 'scale(' + scale + ')';
            },

            // Hide volume pulser on stop
            onStop: function onVolumeMonitorStopped () {
                volumePulser.style.transform = 'scale(0.9)';
            },

            // Public microphone error event when there is a volume monitor error
            onError: function onVolumeMonitorError (error) {
                MindMeldMicrophone.publishEvent('error', error);
            }
        });
    }

    // Initializes mouse click handlers to start/stop the microphone
    function initClickHandlers () {
        var holdTimeout = null;
        var holdDuration = 1000;

        var micButton = containerElement.querySelector('.icon-container');
        micButton.addEventListener('mousedown', function onMouseDown () {
            if (listener.listening) {
                MindMeldMicrophone.stop();
            } else {
                holdTimeout = setTimeout(
                    function startContinuousOnHold () {
                        MindMeldMicrophone.start(true); // start mic in continuous mode
                        holdTimeout = null;
                    },
                    holdDuration
                )
            }
        });

        micButton.addEventListener('mouseup', function onMouseUp () {
            if (holdTimeout !== null) {
                // We have not reached the hold timeout yet, start mic in normal mode
                clearTimeout(holdTimeout);
                holdTimeout = null;
                MindMeldMicrophone.start();
            }
        });

        micButton.addEventListener('mouseout', function onMouseOut () {
            clearTimeout(holdTimeout);
            holdTimeout = null;
        });
    }

    // Subscribes to microphone start/stop events to add CSS classes
    // indicating listening, lock, or waiting state
    function initUIHandlers () {
        MindMeldMicrophone.on('start', function onMicrophoneStart () {
            containerElement.classList.add('listening');
            if (listener.continuous) {
                containerElement.classList.add('lock');
            }
        });

        MindMeldMicrophone.on('end', function onMicrophoneEnd () {
            containerElement.classList.remove('listening');
            containerElement.classList.remove('lock');
        });
    }


    // Publicly Accessible Methods of mindmeld-microphone widget

    // Start recording
    MindMeldMicrophone.start = function start (continuous) {
        listener.continuous = continuous;
        listener.start();
        volumeMonitor.start();
    };

    // Returns if the microphone is currently listening
    MindMeldMicrophone.listening = function listening () {
        return listener.listening;
    };

    // Stops recording
    MindMeldMicrophone.stop = function stop () {
        listener.stop();
    };

    // Event Dispatcher
    var subscriptions = {};

    // Subscribe to microphone events
    MindMeldMicrophone.on = function on (eventName, callback, context) {
        if (! subscriptions[eventName]) {
            subscriptions[eventName] = [];
        }
        var subscription = {
            callback: callback,
            context: context
        };
        subscriptions[eventName].push(subscription);
    };

    // Publish microphone events to subscribers
    MindMeldMicrophone.publishEvent = function publishEvent (eventName) {
        var subscribers = subscriptions[eventName];
        if (subscribers !== undefined) {
            var args = Array.prototype.slice.call(arguments, 1);
            subscribers.forEach(
                function invokeCallback (subscription) {
                    subscription.callback.apply(subscription.context, args);
                }
            )
        }
    };

}(MM));

// Volume Monitor

'use strict';
(function volumeMonitor () {

    window.navigator.getUserMedia = (window.navigator.getUserMedia ||
        window.navigator.webkitGetUserMedia ||
        window.navigator.mozGetUserMedia ||
        window.navigator.msGetUserMedia);
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var Uint8Array = window.Uint8Array;

    var VolumeMonitor = function (config) {
        this.listener = config.listener;
        this.onError = config.onError;
        this.onVolumeChange = config.onVolumeChange;
        this.onStop = config.onStop;

        this.stream = null;
        this.context = null;
        this.analyzer = null;
        this.frequencies = null;
        this.times = null;
        this.audioStarted = false;
    };

    VolumeMonitor.prototype.start = function () {
        var self = this;

        if (!this.audioStarted) {
            this.context = new AudioContext();
            this.analyzer = this.context.createAnalyser();
            this.analyzer.smoothingTimeConstant = 0.18;
            this.analyzer.fftSize = 256;

            this.frequencies = new Uint8Array(this.analyzer.frequencyBinCount);
            this.times = new Uint8Array(this.analyzer.frequencyBinCount);

            window.navigator.getUserMedia({ audio: true }, microphoneReady, function (err) {
                self.onError('The following error occurred: ' + err);
            });

            this.audioStarted = true;
        } else {
            loop();
        }


        function microphoneReady (stream) {
            self.stream = stream;
            var stream_source = self.context.createMediaStreamSource(stream);
            stream_source.connect(self.analyzer);
            loop();
        }

        function loop () {
            if (!(self.listener.pending || self.listener.listening)) {
                self.stop();
                return;
            }

            self.analyzer.getByteFrequencyData(self.frequencies);
            self.analyzer.getByteTimeDomainData(self.times);

            self.onVolumeChange && self.onVolumeChange(getVolume());

            window.setTimeout(loop, 75);
        }

        function getVolume () {
            return window.parseInt(getFrequencyRange(0, self.analyzer.frequencyBinCount - 1), 10);
        }

        function getFrequencyRange (from, to) {
            var volume = 0;

            for (var i = from; i < to; i++) {
                volume += self.frequencies[i];
            }

            return volume / ( to - from );
        }
    };

    VolumeMonitor.prototype.stop = function () {
        this.onStop && this.onStop();
        // stop recording
        this.stream && this.stream.stop();
        this.audioStarted = false;
    };

    window.VolumeMonitor = VolumeMonitor;

})();
