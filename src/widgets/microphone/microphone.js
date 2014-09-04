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
            MM.eventDispatcher.publish('microphoneError', errorMessage);
            console.log(errorMessage);
            return;
        }

        initMMListener();
        initVolumeMonitor();
        initClickHandlers();
        initUIHandlers();
        console.log('mic init');
    };

    // Sets the listener config for MM.activeSession's Listener. The mindmeld-microphone's
    // event handlers publish the Listener events like onResult and onEnd via MM.eventDispatcher
    function initMMListener () {
        listener = MM.activeSession.listener;
        var listenerConfig = {

            interimResults: true,

            onResult: function (result, resultIndex, results, event) {
                MM.eventDispatcher.publish('microphoneResult', result, resultIndex, results, event);
            },

            onStart: function (event) {
                MM.eventDispatcher.publish('microphoneStart', event);
            },

            onEnd: function (event) {
                MM.eventDispatcher.publish('microphoneEnd', event);
            },

            onError: function (error) {
                MM.eventDispatcher.publish('microphoneError', error);
            }
        };

        MM.activeSession.setListenerConfig(listenerConfig);
    }

    // Initializes the volume monitor used to animate the microphone
    // as the volume changes
    function initVolumeMonitor () {
        volumeMonitor = new window.VolumeMonitor(listener);
        volumeMonitor.onVolumeChange = function changed (volume) {
            console.log(volume);
        };

        volumeMonitor.onStop = function onVolumeMonitorStopped () {
            console.log('volume monitor stopped');
        }
    }

    function initClickHandlers () {
        var holdTimeout = null;
        var holdDuration = 1000;

        containerElement.addEventListener('mousedown', function onMouseDown () {
            console.log('mouse down');
            if (listener.listening) {
                mindmeldMicrophone.stop();
            } else {
                holdTimeout = setTimeout(
                    function startContinuousOnHold () {
                        mindmeldMicrophone.start(true); // start mic in continuous mode
                        console.log('start in cont mode');
                        holdTimeout = null;
                    },
                    holdDuration
                )
            }
        });

        containerElement.addEventListener('mouseup', function onMouseUp () {
            if (holdTimeout !== null) {
                // We have not reached the hold timeout yet, start mic in normal mode
                clearTimeout(holdTimeout);
                holdTimeout = null;
                mindmeldMicrophone.start();
                console.log('start in normal das mode');
            }
        });

        containerElement.addEventListener('mouseout', function onMouseOut () {
            clearTimeout(holdTimeout);
            holdTimeout = null;
        });
    }

    function initUIHandlers () {
        MM.eventDispatcher.subscribe('microphoneStart', function onMicrophoneStart () {
            containerElement.classList.add('listening');
            if (listener.continuous) {
                containerElement.classList.add('lock');
            }
        });

        MM.eventDispatcher.subscribe('microphoneEnd', function onMicrophoneEnd () {
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


    // Register mindmeld-microphone as a web component!
    importerDocument.registerElement('mindmeld-microphone', {
        prototype: mindmeldMicrophone
    });

}(MM));