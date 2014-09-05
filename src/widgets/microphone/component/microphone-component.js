/**
 * microphone-component.js uses MindMeldMicrophone to create a web component, <mindmeld-microphone>,
 * that wraps all the functionality in MindMeldMicrophone.
 */

'use strict';

(function microphone (MindMeldMicrophone) {
    var importerDocument = document;
    var currentScript = document._currentScript || document.currentScript;
    var componentDocument = currentScript.ownerDocument;

    var mindmeldMicrophone = Object.create(HTMLElement.prototype);
    var containerElement;

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

    mindmeldMicrophone.initialize = function initialize () {
        MindMeldMicrophone.initialize(containerElement);
    };

    mindmeldMicrophone.start = function start (continuous) {
        MindMeldMicrophone.start(continuous);
    };

    mindmeldMicrophone.listening = function listening () {
        return MindMeldMicrophone.listening();
    };

    mindmeldMicrophone.stop = function stop () {
        MindMeldMicrophone.stop();
    };

    mindmeldMicrophone.on = function on (eventName, callback, context) {
        MindMeldMicrophone.on(eventName, callback, context);
    };


    // Register mindmeld-microphone as a web component!
    importerDocument.registerElement('mindmeld-microphone', {
        prototype: mindmeldMicrophone
    });

}(MindMeldMicrophone));