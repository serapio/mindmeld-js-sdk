/* global describe, xdescribe, it, xit, expect, beforeEach, afterEach, jasmine, fail, spyOn */
/* global MM, Playbacks, FakeRecognizer */

/*
ListenerPlayback takes 'transcripts' for actual events we've recorded from the
recognizer, plays them back via FakeRecognizer, and checks that the Listener
does the right things at the right times.
*/
describe('ListenerPlayback', function () {


  describe('simple request (pizza1)', function () {
    var listener, recognizer, results;

    beforeEach(function () {
      MM.support = { speechRecognition: true };
      recognizer = new FakeRecognizer();

      listener = new MM.Listener({interimResults: true});
      listener._recognizer = recognizer;
      listener._initializeRecognizer(recognizer);
      recognizer._setEvents(Playbacks.pizza1);

      results = [];
      listener.on('result', function (result) {
        results.push(result);
      });
      listener.start();

      recognizer._playback();
    });

    it('should find first interim result', function () {
      var result = results[0];
      expect(result.transcript).toEqual("I'd lie");
      expect(result.final).toBe(false);
    });

    it('should find last interim result', function () {
      var result = results[results.length-2];
      expect(result.transcript).toEqual("I'd like to get a pizza");
      expect(result.final).toBe(false);
    });

    it('should find final result', function () {
      var result = results[results.length-1];
      expect(result.transcript).toEqual("I'd like to get a pizza");
      expect(result.final).toBe(true);
    });

  });

  describe('continuous simple request (pizzaContinuous)', function () {
    var listener, recognizer, results, errors;

    beforeEach(function () {
      MM.support = { speechRecognition: true };
      recognizer = new FakeRecognizer();

      listener = new MM.Listener({interimResults: true, continuous: true});
      listener._recognizer = recognizer;
      listener._initializeRecognizer(recognizer);
      recognizer._setEvents(Playbacks.pizzaContinuous);

      results = [];
      listener.on('result', function (result) {
        results.push(result);
      });
      errors = [];
      listener.on('error', function (event) {
        errors.push(event);
      });
      listener.start();

      recognizer._playback();
    });

    it('should find first interim result', function () {
      var result = results[0];
      expect(result.transcript).toEqual("I'm");
      expect(result.final).toBe(false);
    });

    it('should find two-part result', function () {
      // This result has two segments in the transcript, which we concat
      var result = results[8];
      expect(result.transcript).toEqual("I'm looking for some pizza");
      expect(result.final).toBe(false);
    });

    it('should find last interim result', function () {
      var result = results[results.length-2];
      expect(result.transcript).toEqual("I'm looking for some pizza is there any around");
      expect(result.final).toBe(false);
    });

    it('should find final result', function () {
      var result = results[results.length-1];
      expect(result.transcript).toEqual("I'm looking for some pizza is there any around");
      expect(result.final).toBe(true);
    });

    it('should not find an aborted error', function () {
      // aborted errors are swallowed as a normal way to end continuous mode.
      expect(errors.length).toBe(0);
    });

  });

  describe('no speech', function () {
    var listener, recognizer, results, errors;

    beforeEach(function () {
      MM.support = { speechRecognition: true };
      recognizer = new FakeRecognizer();

      listener = new MM.Listener({interimResults: true});
      listener._recognizer = recognizer;
      listener._initializeRecognizer(recognizer);
      recognizer._setEvents(Playbacks.noSpeech);

      results = [];
      listener.on('result', function (result) {
        results.push(result);
      });
      errors = [];
      listener.on('error', function (event) {
        errors.push(event);
      });
      listener.start();

      recognizer._playback();
    });

    it('should find no results', function () {
      expect(results.length).toBe(0);
    });

    it('should find a no-speech error', function () {
      expect(errors.length).toBe(1);
      expect(errors[0].error).toEqual('no-speech');
    });

  });

  describe('no speech short continuous', function () {
    var listener, recognizer, results, errors;

    beforeEach(function () {
      MM.support = { speechRecognition: true };
      recognizer = new FakeRecognizer();

      listener = new MM.Listener({interimResults: true, continuous: true});
      listener._recognizer = recognizer;
      listener._initializeRecognizer(recognizer);
      recognizer._setEvents(Playbacks.noSpeechShortContinuous);

      results = [];
      listener.on('result', function (result) {
        results.push(result);
      });
      errors = [];
      listener.on('error', function (event) {
        errors.push(event);
      });
      listener.start();

      recognizer._playback();
    });

    it('should find no results', function () {
      expect(results.length).toBe(0);
    });

    it('should not find an aborted error', function () {
      // aborted errors are swallowed as a normal way to end continuous mode.
      expect(errors.length).toBe(0);
    });

  });

  describe('no speech long continuous', function () {
    var listener, recognizer, results, errors;

    beforeEach(function () {
      MM.support = { speechRecognition: true };
      recognizer = new FakeRecognizer();

      listener = new MM.Listener({interimResults: true, continuous: true});
      listener._recognizer = recognizer;
      listener._initializeRecognizer(recognizer);
      recognizer._setEvents(Playbacks.noSpeechLongContinuous);

      results = [];
      listener.on('result', function (result) {
        results.push(result);
      });
      errors = [];
      listener.on('error', function (event) {
        errors.push(event);
      });
      listener.start();

      recognizer._playback();
    });

    it('should find no results', function () {
      expect(results.length).toBe(0);
    });

    it('should not find an error', function () {
      // aborted errors are swallowed as a normal way to end continuous mode.
      expect(errors.length).toBe(0);
    });

  });

  describe('early stop continuous', function () {
    var listener, recognizer, results, errors;

    beforeEach(function () {
      MM.support = { speechRecognition: true };
      recognizer = new FakeRecognizer();

      listener = new MM.Listener({interimResults: true, continuous: true});
      listener._recognizer = recognizer;
      listener._initializeRecognizer(recognizer);
      recognizer._setEvents(Playbacks.earlyStopContinuous);

      results = [];
      listener.on('result', function (result) {
        results.push(result);
      });
      errors = [];
      listener.on('error', function (event) {
        errors.push(event);
      });
      listener.start();

      recognizer._playback();
    });

    it('should find last interim result', function () {
      var result = results[results.length-2];
      expect(result.transcript).toEqual("yes I want to go eat some sushi and after sushi let's play golf");
      expect(result.final).toBe(false);
    });

    it('should find final result', function () {
      var result = results[results.length-1];
      expect(result.transcript).toEqual("yes I want to go eat some sushi and after sushi let's play golf");
      expect(result.final).toBe(true);
    });

    it('should not find an error', function () {
      // aborted errors are swallowed as a normal way to end continuous mode.
      expect(errors.length).toBe(0);
    });

  });

});
