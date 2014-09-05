'use strict';
(function microphone (MM) {
    var importerDocument = document;
    var currentScript = document._currentScript || document.currentScript;
    var componentDocument = currentScript.ownerDocument;

    var mindmeldMicrophone = Object.create(HTMLElement.prototype);
    var containerElement;
    var listener;
    var volumeMonitor;

    // Called when mindmeld-microphone component is first created.
    // The created callback clones the template and creates a
    // new shadow root containing the cloned template
    mindmeldMicrophone.createdCallback = function createdCallback () {
        var template = componentDocument.querySelector('#mindmeld-microphone');
        var clone = template.content.cloneNode(true);
        var shadow = this.createShadowRoot();
        shadow.appendChild(clone);
        containerElement = shadow.querySelector('.mindmeld-microphone');
    };

    // initialize() checks for speech recognition support,
    // sets up the MM.activeSession's Listener, initializes
    // the volume monitor, and initializes mindmeld-microphone's
    // click handlers
    mindmeldMicrophone.initialize = function initialize () {
        if (! MM.support.speechRecognition) {
            containerElement.classList.add('disabled');
            var errorMessage = 'This browser does not support speech recognition';
            mindmeldMicrophone.publishEvent('error', errorMessage);
            return;
        }

        initMMListener();
        initVolumeMonitor();
        initClickHandlers();
        initUIHandlers();
        mindmeldMicrophone.publishEvent('init');
    };

    // Sets the listener config for MM.activeSession's Listener. The mindmeld-microphone's
    // event handlers publish the Listener events like onResult and onEnd
    function initMMListener () {
        listener = MM.activeSession.listener;
        var listenerConfig = {

            interimResults: true,

            onResult: function (result, resultIndex, results, event) {
                mindmeldMicrophone.publishEvent('result', result, resultIndex, results, event);
            },

            onStart: function (event) {
                mindmeldMicrophone.publishEvent('start', event);
            },

            onEnd: function (event) {
                mindmeldMicrophone.publishEvent('end', event);
            },

            onError: function (error) {
                mindmeldMicrophone.publishEvent('error');
            }
        };

        MM.activeSession.setListenerConfig(listenerConfig);
    }

    // Initializes the volume monitor used to animate the microphone
    // as the volume changes
    function initVolumeMonitor () {
        var volumePulser = containerElement.querySelector('.volume-pulser');

        volumeMonitor = new window.VolumeMonitor(
            listener,
            function volumeMonitorErrorHandler (error) {
                mindmeldMicrophone.publishEvent('error', error);
            }
        );

        // Animate volume pulser by scaling a background circle based on volume
        volumeMonitor.onVolumeChange = function changed (volume) {
            var scale = ((volume / 100) * 0.5) + 1.0;
            volumePulser.style.transform = 'scale(' + scale + ')';
        };

        // Hide volume pulser on stop
        volumeMonitor.onStop = function onVolumeMonitorStopped () {
            volumePulser.style.transform = 'scale(0.9)';
        }
    }

    // Initializes mouse click handlers to start/stop the microphone
    function initClickHandlers () {
        var holdTimeout = null;
        var holdDuration = 1000;

        var micButton = containerElement.querySelector('.icon-container');
        micButton.addEventListener('mousedown', function onMouseDown () {
            if (listener.listening) {
                mindmeldMicrophone.stop();
            } else {
                holdTimeout = setTimeout(
                    function startContinuousOnHold () {
                        mindmeldMicrophone.start(true); // start mic in continuous mode
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
                mindmeldMicrophone.start();
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
        mindmeldMicrophone.on('start', function onMicrophoneStart () {
            containerElement.classList.add('listening');
            if (listener.continuous) {
                containerElement.classList.add('lock');
            }
        });

        mindmeldMicrophone.on('end', function onMicrophoneEnd () {
            containerElement.classList.remove('listening');
            containerElement.classList.remove('lock');
        });
    }


    // Publicly Accessible Methods of mindmeld-microphone widget

    // Start recording
    mindmeldMicrophone.start = function start (continuous) {
        listener.continuous = continuous;
        listener.start();
        volumeMonitor.start();
    };

    // Returns if the microphone is currently listening
    mindmeldMicrophone.listening = function listening () {
        return listener.listening;
    };

    // Stops recording
    mindmeldMicrophone.stop = function stop () {
        listener.stop();
    };

    // Event Dispatcher
    var subscriptions = {};

    // Subscribe to microphone events
    mindmeldMicrophone.on = function on (eventName, callback, context) {
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
    mindmeldMicrophone.publishEvent = function publishEvent (eventName) {
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


    // Register mindmeld-microphone as a web component!
    importerDocument.registerElement('mindmeld-microphone', {
        prototype: mindmeldMicrophone
    });

}(MM));