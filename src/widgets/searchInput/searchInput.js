/* exported MindMeldSearchInput */

;(function searchInput () {
  'use strict';

  var MindMeldSearchInput = window.MindMeldSearchInput = window.MindMeldSearchInput || {};

  var containerElement;
  var textElement;


  MindMeldSearchInput.initialize = function initialize (element) {
    containerElement = element;
    textElement = containerElement.querySelector('.mindmeld-query-text');
    textElement.addEventListener('focus', function() {
      MindMeldSearchInput.setFinal(false);
    });

    textElement.addEventListener('keypress', function (e) {
      // We are looking for CR (keyCode 13)
      var keyCode = e.keyCode;
      if (keyCode !== 13) {
        return;
      }

      // User pressed return
      textElement.blur();
      var text = MindMeldSearchInput.getText().trim();
      MindMeldSearchInput.setText(text, true);
      MindMeldSearchInput.publishEvent('submitText', text);

      e.preventDefault();
    });

    containerElement.querySelector('.mindmeld-query-glass').addEventListener('click',
      function (e) {
        console.log('Clicking glass');
        MindMeldSearchInput.setFinal(true);
        var text = MindMeldSearchInput.getText().trim();
        MindMeldSearchInput.publishEvent('submitText', text);

        return false;
      }
    );

    MindMeldSearchInput.publishEvent('init');
  };

  MindMeldSearchInput.setFinal = function setFinal (isFinal) {
    if (isFinal) {
      textElement.classList.remove('interim');
    } else {
      textElement.classList.add('interim');
    }
  };

  MindMeldSearchInput.getText = function getText () {
    return textElement.querySelector('span').innerHTML;
  };

  // Sets the text of the search input. Use isFinal boolean to
  // indicate whether the text is finalized or not
  MindMeldSearchInput.setText = function setText (text, isFinal) {
    MindMeldSearchInput.setFinal(isFinal);
    textElement.querySelector('span').innerHTML = text;
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
}());
