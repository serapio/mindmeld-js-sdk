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
  },

  'getApp' : {
    appid: "f38fa5965f016a1d4886d538f25ac35c14b4bdc2",
    response: {
      "data": {
        "appid": "f38fa5965f016a1d4886d538f25ac35c14b4bdc2",
        "appname": "Test App",
        "ownerid": "46",
        "created": 1396991828,
        "modified": 1406919007,
        "usage": {
          "total-users": 5,
          "total-sessions": 17,
          "total-documents": 33,
          "total-textentries": 43,
          "total-entities": 137,
          "total-activities": 0,
          "total-articles": 0,
          "total-domains": 1,
          "textentries-uploaded": {
            "today": 0,
            "this-month": 0,
            "last-month": 0,
            "total": 81
          },
          "entities-uploaded": {
            "today": 0,
            "this-month": 0,
            "last-month": 0,
            "total": 0
          },
          "characters-uploaded": {
            "today": 0,
            "this-month": 0,
            "last-month": 0,
            "total": 2182
          },
          "total-uploads": {
            "today": 0,
            "this-month": 0,
            "last-month": 0,
            "total": 81
          },
          "document-queries": {
            "today": 9,
            "this-month": 9,
            "last-month": 209,
            "total": 3153
          },
          "article-queries": {
            "today": 0,
            "this-month": 0,
            "last-month": 0,
            "total": 0
          },
          "total-queries": {
            "today": 9,
            "this-month": 9,
            "last-month": 209,
            "total": 3153
          }
        },
        "article-ranking-factors": {
          "recency": 0.5,
          "similarity-threshold": 0.7,
          "relevance": 1,
          "textentry-weight": 0.5,
          "entity-score": 0.5,
          "category-weight": 0,
          "source-weight": 0.5,
          "rank-position": 0.5
        },
        "source-blending": {
          "yahoo-web": 0,
          "bing-web": 0,
          "faroo-news": 0,
          "yahoo-image": 0,
          "flickr": 0,
          "youtube": 0,
          "yelp": 0
        },
        "document-ranking-factors": {
          "recency": 0,
          "popularity": 0,
          "relevance": 1,
          "proximity": 0,
          "customrank1": 0,
          "customrank2": 0,
          "customrank3": 0
        },
        "quotas": {
          "total-apps": 8,
          "domains-per-app": 20,
          "documents-per-domain": 500000,
          "permitted-recrawl-interval": 3600,
          "monthly-query-limit": 10000000,
          "monthly-upload-limit": 100000
        }
      },
      "request": {
        "objecttype": "app",
        "objectid": "f38fa5965f016a1d4886d538f25ac35c14b4bdc2",
        "method": "get"
      },
      "timestamp": 1406930587,
      "responsetime": 0.031748056411743,
      "etag": "25b3284dcfe8a4bd8ff72c590068d13b"
    }
  }

};
