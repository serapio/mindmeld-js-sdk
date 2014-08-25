;(function (MM) {
    'use strict';

    var subscriptions = {};

    MM.eventDispatcher = {
        subscribe: function subscribe (eventName, callback, context) {
            if (! subscriptions[eventName]) {
                subscriptions[eventName] = [];
            }
            var subscription = {
                callback: callback,
                context: context
            };
            subscriptions[eventName].push(subscription);
        },

        publish: function publish (eventName) {
            var subscribers = subscriptions[eventName];
            if (subscribers !== undefined) {
                var args = Array.prototype.slice.call(arguments, 1);
                subscribers.forEach(
                    function invokeCallback (subscription) {
                        subscription.callback.apply(subscription.context, args);
                    }
                )
            }
        }
    };
}(MM));