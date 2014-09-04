'use strict';
(function (MM) {
    var importerDocument = document;
    var currentScript = document._currentScript || document.currentScript;
    var componentDocument = currentScript.ownerDocument;

    var mindmeldMicrophone = Object.create(HTMLElement.prototype);
    var containerElement;

    mindmeldMicrophone.createdCallback = function () {
        var template = componentDocument.querySelector('#mindmeld-microphone');
        var clone = template.content.cloneNode(true);
        var shadow = this.createShadowRoot();
        shadow.appendChild(clone);
        containerElement = shadow.querySelector('.mindmeld-microphone');
    };

    mindmeldMicrophone.initialize = function initialize () {
        if (! MM.support.speechRecognition) {
            console.log('This browser does not support speech recognition');
            containerElement.classList.add('disabled');
            return;
        }

        var listenerConfig = {

        };
    };

    importerDocument.registerElement('mindmeld-microphone', {
        prototype: mindmeldMicrophone
    });



}(MM));