;(function (MM) {
    'use strict';

    var subscriptions = {};


    /**
     * subscriptions: {
     *  'event: [
     *      fn() {}
     *  ]
     * }
     *
     * @type {{subscribe: subscribe, publish: publish}}
     */
    MM.eventDispatcher = {
        subscribe: function subscribe (eventName, callback, context) {
            if (! subscriptions[eventName]) {
                subscriptions[eventName] = [];
            }
            subscriptions[eventName].push(callback);
        },

        publish: function publish (eventName) {
            var subscribers = subscriptions[eventName];
            if (subscribers !== undefined) {
                var args = Array.prototype.slice.call(arguments, 1);
                subscribers.forEach(
                    function invokeCallback (callback) {
//                        callback.apply(this, )
                    }
                )
            }
        }

    };

}(MM));