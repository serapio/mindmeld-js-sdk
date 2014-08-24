/* global describe, xdescribe, it, xit, expect, beforeEach, afterEach, jasmine, fail */
/* global window, MM, FakeResponses, FakeBaseUrl */

describe('MM Unit', function () {
  var baseUrl = FakeBaseUrl;


  beforeEach(function() {
    jasmine.addMatchers(window.customMatchers);
    jasmine.Ajax.install();
    //This method fails on the FakeXMLHttpRequest
    window.XMLHttpRequest.prototype.overrideMimeType = function() {};
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  describe('getToken', function () {

    var appid;

    beforeEach(function (done) {
      appid = '123456';
      // First, init MM
      MM.init( {
        cleanUrl: baseUrl,
        appid: appid,
        onInit: done
      });
    });

    afterEach(function () {
      MM.token = null;
    });

    it ('should set a token and activeUserId on success', function (done) {

      var fakeAjax = FakeResponses['getToken'];
      MM.getToken({
        appsecret: 'ABCD',
        simple: {
          userid: '11',
          name: 'Jack'
        }
      }, function onSuccess (response) {
        expect(response.token).toBeOk();
        expect(MM.token).toEqual(response.token);
        expect(MM.activeUserId).toEqual(fakeAjax.req.data.credentials.simple.userid);
        done();
      }, function onError () {
        // XXX: Can't find a jasmine.fail
        expect(false).toBe(true);
      });

      // Test the immediate properties here, outside of the async block.
      var fakeReq = jasmine.Ajax.requests.mostRecent();
      expect(fakeReq.url).toBe(fakeAjax.req.url);
      expect(fakeReq.method).toBe(fakeAjax.req.method);

      jasmine.Ajax.requests.mostRecent().response({
        status: 200,
        contentType: 'text/html',
        responseText: JSON.stringify(fakeAjax.res)
      });
    });

    it ('should return appropriate error on failure', function (done) {

      var fakeAjax = FakeResponses['getTokenError'];
      MM.getToken({
        appsecret: 'ABCD',
        simple: {
          userid: '11',
          name: 'Jack'
        }
      }, function onSuccess () {
        fail('getToken should not succeed');
      }, function onError (error) {
        expect(error).toBeOk();
        expect(error.code).toEqual(fakeAjax.res.error.code);
        expect(MM.token).not.toBeOk();
        done();
      });

      // Test the immediate properties here, outside of the async block.
      var fakeReq = jasmine.Ajax.requests.mostRecent();
      expect(fakeReq.url).toBe(fakeAjax.req.url);
      expect(fakeReq.method).toBe(fakeAjax.req.method);

      jasmine.Ajax.requests.mostRecent().response({
        status: 200,
        contentType: 'text/html',
        responseText: JSON.stringify(fakeAjax.res)
      });

    });

  });

  describe('setActiveSessionID', function () {

    var appid;

    beforeEach(function (done) {
      appid = '123456';
      // First, init MM
      MM.init( {
        cleanUrl: baseUrl,
        appid: appid,
        onInit: function () {
          MM.token = 'zzzzz';
          done();
        }
      });
    });

    afterEach(function () {
      MM.token = null;
    });

    it ('should set activeSessionId on success', function (done) {
      var fakeAjax = FakeResponses['getSession'];
      var sessionid = fakeAjax.sessionid;

      MM.setActiveSessionID(sessionid,
        function onSessionStart () {
          expect(MM.activeSessionId).toEqual(sessionid);
          done();
      }, function onError () {
        fail('Should not have error');
        done();
      });

      var fakeReq = jasmine.Ajax.requests.mostRecent();
      expect(fakeReq.url).toBe(baseUrl + 'session/' + sessionid);
      expect(fakeReq.method).toBe('GET');

      // jasmine.Ajax.requests.mostRecent().response({
      fakeReq.response({
        status: 200,
        contentType: 'text/html',
        responseText: JSON.stringify(fakeAjax.res)
      });
    });

  });

  describe('getApp', function () {

    var fakeAppData = FakeResponses['getApp'];
    var APP_ID = fakeAppData['appid'];

    beforeEach(function beforeGetAppTests (done) {
      MM.init({
        cleanUrl: baseUrl,
        appid: APP_ID,
        onInit: function onMMInit () {
          MM.token = 'zzzzz';
          done();
        }
      });
    });

    afterEach(function afterGetAppTests () {
      MM.token = null;
    });


    it('should return data about the current MindMeld application', function (done) {

      MM.get(null,
        function onGetAppSuccess (response) {
          expect(response.data.appid).toBe(APP_ID);
          done();
        },
        function onGetAppError () {
          fail('Should not have error');
          done();
        }
      );

      var fakeGetAppRequest = jasmine.Ajax.requests.mostRecent();
      expect(fakeGetAppRequest.url).toBe(baseUrl);
      expect(fakeGetAppRequest.method).toBe('GET');

      fakeGetAppRequest.response({
        status: 200,
        contentType: 'text/html',
        responseText: JSON.stringify(fakeAppData['response'])
      });

    });
  });

  describe('event dispatcher', function () {
    it('should let you subscribe to and publish an event without arguments', function (done) {
      var onTestEventCallback = jasmine.createSpy();
      MM.eventDispatcher.subscribe('testEvent',
        onTestEventCallback
      );
      MM.eventDispatcher.publish('testEvent');
      expect(onTestEventCallback).toHaveBeenCalled();
    });
  });

});
