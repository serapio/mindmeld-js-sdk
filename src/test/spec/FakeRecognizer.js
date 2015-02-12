/* global spyOn, jasmine */

;(function () {

  /**
   * FakeRecognizer is a fake for the webkit SpeechRecognition object.
   * It stubs out the main methods (and allows the basic hooks).
   * In addition, there is the ability to playback events that were recorded
   * from an actual recognizer.  FakeRecognizer should then be a decent
   * facsimile of a real recognizer for testing.
   */
  var FakeRecognizer = window.FakeRecognizer = function () {
    this.lang = '';
    this.continuous = false;
    this.interimResults = false;
    this.maxAlternatives = 1;

    spyOn(this, 'start').and.callThrough();
    spyOn(this, 'stop').and.callThrough();
    spyOn(this, 'abort').and.callThrough();

    this._isStarting = false;
  };

  FakeRecognizer.prototype.start = function () {
    if (this._isStarting) {
      // // Below is the 'correct' way to make an InvalidStateError,
      // // which is what is actually thrown by the real recognizer.  However,
      // // phantomjs (at leas6 <v2.0) doesn't have a DOMError/DOMException
      // // object in scope, so we fake it.  If phantom supports these objects
      // // in the future, we should re-enable this code and replace the
      // // two lines that follow.
      // var e = new DOMError("InvalidStateError");
      // e.code = DOMException.INVALID_STATE_ERR;
      // Running these in phantomjs, don't have access to those objects.
      var e = new Error('InvalidStateError');
      e.code = 11;
      throw e;
    }
    this._isStarting = true;
    var self = this;
    setTimeout(function () {
      self.onstart && self.onstart();
    }, 10);
  };

  FakeRecognizer.prototype._end = function () {
    this._isStarting = false;
    this.onend && this.onend();
  };

  FakeRecognizer.prototype.stop = function () {
    var self = this;
    setTimeout(function () {
      self._end();
    }, 10);
  };

  FakeRecognizer.prototype._abort = function () {
    this._isStarting = false;
    this.onerror && this.onerror('aborted');
    this.onend && this.onend();
  };

  FakeRecognizer.prototype.abort = function () {
    var self = this;
    setTimeout(function () {
      self._abort();
    }, 10);
  };

  FakeRecognizer.prototype._currentTimestamp = function () {
    var currentEvent = this._currentEvent();
    if (currentEvent) {
      return currentEvent.timestamp;
    } else {
      return null;
    }
  };

  FakeRecognizer.prototype._currentEvent = function () {
    if (this._eventIndex >= this._events.length) {
      return null;
    }
    return this._events[this._eventIndex];
  };

  FakeRecognizer.prototype._setEvents = function (events) {
    this._events = events || [];
    this._eventIndex = 0;
  };

  FakeRecognizer.prototype._nextEvent = function () {
    // Fire the current event.
    var event = this._currentEvent();
    if (event) {
      var handler = this['on'+event.type].bind(this);

      switch (event.type) {
        case 'error':
        case 'result':
          handler(event);
          break;
        case 'end':
          // Must also set internal _isStarting flag to false
          this._end();
          break;
        default:
          handler();
      }
    }
    // Now increment event to be 'next'
    this._eventIndex++;
  };

  FakeRecognizer.prototype._playback = function () {
    jasmine.clock().install();
    var now, lastNow;
    // Arbitrary initial value that's before "now"
    // Should roughly be the delay between recognizer 'start' and calling 'onstart'
    lastNow = this._currentTimestamp() - 10;

    while (this._currentEvent()) {
      now = this._currentTimestamp();
      jasmine.clock().tick(now - lastNow);
      lastNow = now;
      this._nextEvent();
    }

    jasmine.clock().uninstall();
  };

})();
