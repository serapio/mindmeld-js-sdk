/* global jQuery */
/* exported MindMeldSearchInput */

;(function searchInput ($) {
    'use strict';

    var MindMeldSearchInput = window.MindMeldSearchInput = window.MindMeldSearchInput || {};

    var containerElement;
    var textInput;


    MindMeldSearchInput.initialize = function initialize (element) {
        containerElement = $(element);
        textInput = containerElement.find('.text-input').first();

        textInput.focus(
            function onTextFocus () {
                textInput.removeClass('interim');
            }
        );

        textInput.keypress(
            function onKeypress(event) {
                var keyCode = event.keyCode || event.which;
                if (keyCode !== 13) {
                    return;
                }

                textInput.blur();
                var text = textInput.val().trim();
                textInput.val(text);
                MindMeldSearchInput.publishEvent('submitText', text);
            }
        );

        MindMeldSearchInput.publishEvent('init');
    };


    // Sets the text of the search input. Use isFinal boolean to
    // indicate whether the text is finalized or not
    MindMeldSearchInput.setText = function setText (text, isFinal) {
        textInput.toggleClass('interim', ! isFinal);
        textInput.val(text);
    };


    // Event Dispatcher
    var subscriptions = {};

    /**
     * Subscribe to search input events
     */
    MindMeldSearchInput.on = function on (eventName, callback, context) {
        if (! subscriptions[eventName]) {
            subscriptions[eventName] = [];
        }
        var subscription = {
            callback: callback,
            context: context
        };
        subscriptions[eventName].push(subscription);
    };

    /**
     * Publish microphone events to subscribers
     */
    MindMeldSearchInput.publishEvent = function publishEvent (eventName) {
        var subscribers = subscriptions[eventName];
        if (subscribers !== undefined) {
            var args = Array.prototype.slice.call(arguments, 1);
            subscribers.forEach(
                function invokeCallback (subscription) {
                    var context = subscription.context || this;
                    subscription.callback.apply(context , args);
                }
            );
        }
    };
}(jQuery));