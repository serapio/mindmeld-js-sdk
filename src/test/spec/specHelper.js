/* global window, MM */

window.fail = function (msg) {
  /* global expect */
  console.error('Fail:', msg);
  expect(false).toBe(true);
};

window.customMatchers = {
  toBeOk: function() {
    return {
      compare: function(actual) {
        if ('undefined' === typeof actual) return { pass: false, message: 'Expected non-undefined.' };
        if (null == actual) return { pass: false, message: 'Expected non-null.' };
        return { pass: true };
      },
    };
  },

  toBeSuccess: function() {
    return {
      compare: function(actual) {
        if (!actual) return { pass: false, message: 'Result must be an object.' };
        if (!actual.data) return { pass: false, message: 'Result must contain data.' };
        if (actual.error) return { pass: false, message: 'Result must not contain an error.' };
        return { pass: true };
      },
      negativeCompare: function(actual) {
        if (!actual) return { pass: false, message: 'Result must be an object.' };
        if (!actual.error) return { pass: false, message: 'Result is missing an error.' };
        return { pass: true };
      }

    };
  }
};

var onErrorCallback = function (error) {
  throw error || new Error ('Received error callback');
};

/**
 * config: {
 *   appid:
 *   token:
 *   credentials: {
 *     anonymous: {
 *       userid:
 *       name:
 *       domain:
 *     },
 *     appsecret:
 *     simple: {
 *       userid:
 *       name:
 *     },
 *     facebook: {
 *       userid:
 *       token:
 *    }
 *  }
 * }
 * callback: called when the process is complete.
 */
MM.initializeMindMeld = function (config, callback) {
  var self = this;
  self.init({
    appid: config.appid,
    cleanUrl: config.cleanUrl,
    fayeClientUrl: config.fayeClientUrl,

    onInit: function () {
      if (!config.credentials) {
        callback();
      } else {
        //TODO: Also allow to set existing token.
        self.getToken(config.credentials, function onSuccess (){
          console.log('Token retrieved.');

          var setActiveSession = function (sessionid, cb) {
            self.setActiveSessionID(
              sessionid,
              function onSessionStart () {
                console.log('Session started!');
                cb();
              },
              onErrorCallback
            );
          };

          if (config.session) {
            if (config.session.id) {
              // We already have an id, let's use it
              console.log('Using supplied sessionid to set session.');
              setActiveSession(config.session.id, callback);
            } else {
              // Make a new session
              console.log('Making new session with', config.session);
              self.activeUser.sessions.post(
                config.session,
                function onSessionPosted(result) {
                  console.log('Create session results:', result);
                  setActiveSession(result.data.sessionid, callback);
                },
                onErrorCallback
              );
            }
          } else {
            callback();
          }
        }, onErrorCallback
        );
      }
    }
  });
};
