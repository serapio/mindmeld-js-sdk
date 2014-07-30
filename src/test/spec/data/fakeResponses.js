/* global window */

var FakeBaseUrl = window.FakeBaseUrl = 'https://bogus.expectlabs.com/';
window.FakeResponses = {

  'getToken' : {
    req: {
      method: 'POST',
      url: FakeBaseUrl + 'tokens',
      data: {
        credentials: {
          simple: {
            userid: '520',
            name: 'Test User'
          }
        }
      }
    },
    res: {
      data: {
        user: {
          userid: '520',
          name: 'Test User'
        },
        token: '8476d5d459894404b8053d18b859c5f682c7406e'
      },
      request: {
        objecttype: 'app',
        objectid: 'e3a504f39af42d0d9629b4f555e663c6ab6d417f',
        connectiontype: 'tokens',
        method: 'post'
      },
      responsetime: 0.0030660629272461,
      timestamp: 1406294926
    }
  },

  'getTokenError' : {
    req: {
      method: 'POST',
      url: FakeBaseUrl + 'tokens',
      data: {
        credentials: {
          simple: {
            userid: 513,
            name: 'Test User'
          }
        }
      }
    },
    res: {
      error: {
        code: 14,
        type: 'CredentialsInvalid',
        message: 'A valid appsecret or either simple or facebook credentials are required.'
      },
      request: {
        objecttype: 'app',
        objectid: 'e3a504f39af42d0d9629b4f555e663c6ab6d417f',
        connectiontype: 'tokens',
        method: 'post'
      },
      responsetime: 0.0030660629272461,
      timestamp: 1406294926
    }
  },

  'getSession' : {
    sessionid: '39877',
    req: {
      method: 'GET',
      url: FakeBaseUrl + 'session/' + '39877'
    },
    res: {
      data: {
        sessionid: '39877',
        name: 'Test-1406312093480',
        privacymode: 'inviteonly',
        created: 1406312093,
        modified: 1406312093,
        appid: 'e3a504f39af42d0d9629b4f555e663c6ab6d417f',
        organizer: {
          userid: '520',
          name: 'Test User'
        }
      },
      request: {
        objecttype: 'session',
        objectid: '39877',
        method: 'get'
      },
      timestamp: 1406312093,
      responsetime: 0.0018880367279053,
      etag: 'ff1dbd858cf2c8c577724fa0087cc67e'
    }
  }

};
