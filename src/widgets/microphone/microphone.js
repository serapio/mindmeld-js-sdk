'use strict';
(function (MM) {
    var importerDocument = document;
    var currentScript = document._currentScript || document.currentScript;
    var componentDocument = currentScript.ownerDocument;

    var mindmeldMicrophone = Object.create(HTMLElement.prototype);

    mindmeldMicrophone.createdCallback = function () {
        var template = componentDocument.querySelector('#mindmeld-microphone');
        var clone = template.content.cloneNode(true);
        var shadow = this.createShadowRoot();
        shadow.appendChild(clone);
    };

    mindmeldMicrophone.foo = function () {
        console.log('called foo');
    };

    importerDocument.registerElement('mindmeld-microphone', {
        prototype: mindmeldMicrophone
    });

}(MM));