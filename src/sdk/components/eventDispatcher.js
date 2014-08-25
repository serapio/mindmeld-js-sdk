;(function (MM) {
    'use strict';

    var subscriptions = {};

    /**
     * {@link MM.eventDispatcher} is a simple pub/sub handler used by mindmeld widgets
     *
     * @namespace MM.eventDispatcher
     * @memberOf MM
     */
    MM.eventDispatcher = {

        /**
         * Subscribe to an event name by supplying a callback and optionally
         * a context object with which the callback will be called
         *
         * @param {string} eventName name of the event to which to subscribe
         * @param {function} callback callback called when event is published
         * @param {Object} context object set as `this` when callback is called
         * @memberOf MM.eventDispatcher
         * @instance
         *
         * @example
         *
         function subscribeToEvent () {
            var callback = function onTestEvent (testArg) {
                console.log(testArg); // prints 1
            };
            MM.eventDispatcher.subscribe('testEvent', callback);
            MM.eventDispatcher.publish('testEvent', 1);
         }
         */
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

        /**
         * Publish a message with a variable number of arguments
         *
         * @param {string} eventName name of event to publish
         * @param {...Object} args variable number of arguments passed to callbacks
         * @memberOf MM.eventDispatcher
         * @instance
         *
         * @example
         *
         function publishEvent () {
            var callback = function onTestEvent (testArg) {
                console.log(testArg); // prints 1
            };
            MM.eventDispatcher.subscribe('testEvent', callback);
            MM.eventDispatcher.publish('testEvent', 1);
         }
         */
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