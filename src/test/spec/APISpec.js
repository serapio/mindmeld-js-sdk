/* global describe, it, expect, before, after, beforeEach, afterEach, jasmine, _MMAPI */

describe('API', function () {
  var self = this;

  beforeEach(function() {
    jasmine.addMatchers(customMatchers);
  });

  it('should be able to set up a user', function (done) {
    api = new _MMAPI({
      apiUrl: 'https://api-west-dev-d.expectlabs.com/',
      token: '847bfd46a0662bbe52a73608118acf48f61a090d'
    });

    api.call('GET', 'users', null, function onSuccess (result) {
      console.log('Got users', result.data);
      user = result.data[0];
      api.call('POST', 'user/' + user.userid + '/sessions', null, function onSucess (result) {
        console.log('Got session', result.data);
        session = result.data;
        done();
      }, function onError (error) {
        self.fail(error);
      });
    }, function onError (error) {
      self.fail(error);
    });

  });

  describe('Session API calls', function () {

    it('should call the API with GET', function (done) {

      api.call('GET', 'documents', null, function onSuccess(result) {
        console.log('Got result', result);
        expect(result).toBeSuccess();
        done();
      }, function onError(error) {
        console.log('Got error', error);
        expect(error).toBeFalsy();
      });
    });

    it('should call the API with POST', function (done) {
      var self = this;

      var api = new _MMAPI({
        apiUrl: 'https://api-west-dev-d.expectlabs.com/',
        token: '847bfd46a0662bbe52a73608118acf48f61a090d'
      });


      api.call('POST', 'documents', null, function onSuccess(result) {
        console.log('Got result', result);
        expect(result).toBeDefined();
        expect(result.data).toBeDefined();
        expect(result.etag).toBeDefined();
        expect(result.error).not.toBeDefined();
        done();
      }, function onError(error) {
        console.log('Got error', error);
        self.fail();
      });
    });

  });

  it('should tear down the session', function (done) {
    api.call('DELETE', 'session/' + session.sessionid, null, function onSuccess (result) {
      console.log('Deleted session', result.data);
      done();
    }, function onError (error) {
      throw error;
    });
  });

});
