/* jshint browser:true */
/* global ajax */
;(function () {

  var _log = function () {
    window.console && window.console.log.apply(this, arguments);
  };

  /**
   * config:
   *   cleanUrl
   *   fayeUrl
   *   debug:Boolean
   *   token
   */
  var API = function (config) {
    this.config = config;
  };

  API.prototype.call = function (method, path, params, onSuccess, onError, headers) {
    var self = this;

    var modSince = false;
    if (params && params['if-modified-since']) {
      modSince = true;
      delete params['if-modified-since'];
    }

    headers = headers || {'X-MINDMELD-ACCESS-TOKEN': self.config.token};
    var fullUrl = self.config.apiUrl + path;

    if (self.config.debug) {
      _log('Calling MindMeld API with: ' + method +
        ' and URL: ' + fullUrl +
        ' and Params: ' + JSON.stringify(params));
    }

    $.ajax({
      type: method,
      url: fullUrl,
      data: params,
      dataType: 'json',
      headers: headers,
      ifModified: modSince,
      success: function (result, status) {
        if (self.config.debug) {
          _log('The MindMeld request returned: ' + JSON.stringify(result));
        }
        if (status === 'notmodified') {
          onError && onError(status);
        } else if (result) {
          if (result.data) {
            onSuccess && onSuccess(result);
          } else if (result.error) {
            onError && onError(result.error);
          }
        } else {
          onError && onError(result);
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        var text = 'Ajax Request Error: ' + 'XMLHTTPRequestObject status: (' +
          xhr.status + ', ' + xhr.statusText + '), ' +
          'text status: (' + textStatus + '), error thrown: (' + errorThrown + ')';
        _log('The MindMeld AJAX request failed with the error: ' + text);
        _log(xhr.responseText);
        _log(xhr.getAllResponseHeaders());
        var errorObj = {
          code: 0,
          type: 'Failed Ajax Request',
          message: ''+errorThrown
        };
        onError && onError(errorObj);
      }
    });

  //   // Now call the API using AJAX.
  //   if (method === 'GET') {
  //     self._get(fullUrl, params, headers, onSuccess, onError);
  //   } else if (method === 'POST') {
  //     self._post(fullUrl, params, headers, onSuccess, onError);
  //   } else {
  //     _log('Error: Tried to call API with unsupported method ' + method);
  //     onError && onError('We only support GET and POST requests for now.');
  //   }
  };


  window._MMAPI = API;
})();
