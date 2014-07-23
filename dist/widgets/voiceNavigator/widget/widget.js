(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./vendor/contentloaded');

/* A wrapper for dom elements, basically a lite version of jQuery's $ */
exports.el = function(el) {
    return {
        on: function(event, func) {
            if(el.addEventListener) {
                el.addEventListener(event,func,false);
            } else if(el.attachEvent) {
                el.attachEvent("on"+event,func);
            }
        },

        click: function(func) {
            this.on('click', func);
        },

        keypress: function (func) {
            this.on('keypress', func);
        },

        removeClass: function(className) {
            el.className = el.className.replace(
                new RegExp('(^|\\s+)' + className + '(\\s+|$)', 'g'),
                '$1'
            );
        },

        addClass: function(className) {
            el.className = el.className + " " + className;
        },

        remove: function() {
            el.parentNode.removeChild(el);
        },

        el: function() {
            return el;
        }
    };
};

exports.convertToAbsolutePath = function(href) {
    var anchor = document.createElement('a');
    anchor.href = href;
    return (anchor.protocol + '//' + anchor.host + anchor.pathname + anchor.search + anchor.hash);
};

function addLeadingZeros(number, digits) {
    var base = Math.pow(10, digits);
    number += base;
    number = number.toString();
    return number.substring(number.length - digits);
}

exports.timestamp = function (date) {
    date = date || new Date();
    return addLeadingZeros(date.getFullYear(), 4) + '.'
        + addLeadingZeros(date.getMonth() + 1, 2) + '.'
        + addLeadingZeros(date.getDate(), 2) + ' ' + date.toTimeString();
};

exports.log = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    args.splice(0, 0, exports.timestamp());
    console.log.apply(console, args);
};

exports.contentLoaded = contentLoaded;
},{"./vendor/contentloaded":2}],2:[function(require,module,exports){
/*!
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 *
 */

// @win window reference
// @fn function reference
window.contentLoaded = function contentLoaded(win, fn) {

	var done = false, top = true,

	doc = win.document, root = doc.documentElement,

	add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
	rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
	pre = doc.addEventListener ? '' : 'on',

	init = function(e) {
		if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
		(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
		if (!done && (done = true)) fn.call(win, e.type || e);
	},

	poll = function() {
		try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
		init('poll');
	};

	if (doc.readyState == 'complete') fn.call(win, 'lazy');
	else {
		if (doc.createEventObject && root.doScroll) {
			try { top = !win.frameElement; } catch(e) { }
			if (top) poll();
		}
		doc[add](pre + 'DOMContentLoaded', init, false);
		doc[add](pre + 'readystatechange', init, false);
		win[add](pre + 'load', init, false);
	}

}

},{}],3:[function(require,module,exports){
var UTIL =  require('./util');
var MM = window.MM = window.MM || {};


/**
 * An object representing the configuration of {@link MM.voiceNavigator}
 *
 * @typedef {Object} VoiceNavigatorConfig
 * @property {String} [cardLinkBehavior="_parent"] sets the behavior for anchors wrapping cards. Use 'false' to
 *                                                 prevent opening links, '_parent' to open links in the same tab or window,
 *                                                 or '_blank' to open links in a new tab or window. See the target attribute
 *                                                 of [anchor](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
 *                                                 elements for more information.
 * @property {String} [listeningMode="normal"]     defines the listening mode of the voice navigator when it is opened. Acceptable
 *                                                 values include 'normal', 'continuous', and false. False prevents listening
 *                                                 and the default is 'normal'.
 * @property {Number} [numResults]                 if specified, this number of cards will appear as results
 * @property {CardField[]} [cardFields]            an array of card fields which will be appended to the card. With card fields,
 *                                                 you can render document fields that are specific to your application.
 *                                                 See {@link CardField} for more information
 * @property {String} [cardTemplate]               an [underscore](http://underscorejs.org/#template) (or lodash) html
 *                                                 template which is used to create a card representation of a document
 *                                                 object. The resulting html, is wrapped in an anchor element which links
 *                                                 to the document's url. The template is supplied with the document object
 *                                                 returned by the API. A card template can be used to render any document
 *                                                 fields that are specific to your application with custom logic.
 * @property {boolean} [resetCardsCSS]             if true, removes CSS specific to the cards container. This can be helpful
 *                                                 if the default cards CSS is conflicting with your own customCSS
 * @property {String} [customCSS]                  specifies custom CSS to be applied to the voice navigator. You can use
 *                                                 custom CSS to change the appearance of the voice navigator widget and
 *                                                 it's document cards, to better suit your branding. When using this parameter,
 *                                                 the styling will be included as embedded CSS, which takes precedence
 *                                                 over external CSS.
 * @property {String} [customCSSURL]               specifies the url of a file containing custom CSS to be applied to the
 *                                                 voice navigator. This parameter works the same as customCSS, except that
 *                                                 the styling will be applied as external CSS, by linking to the url provided.
 *                                                 This can be helpful if you would like to refer to images with relative paths.
 * @property {Number} [baseZIndex=100000]          the voice navigator elements will have a Z index between the value
 *                                                 given and 1000 greater than the value. If the voice navigator is hidden
 *                                                 underneath elements on a page, try setting it to something higher.
 * @property {Object.<string, number>} [highlight] the highlight parameter for {@link VoiceNavigatorConfig} specifies the
 *                                                 document fields to return snippets showing matching results. The field
 *                                                 is the same as the field used in the API to show highlighted text in the
 *                                                 API as documented [here](https://developer.expectlabs.com/docs/endpointSession#getSessionSessionidDocuments).
 *
 */

/**
 * An Object representing a field to display in a document card for the Voice Navigator widget. You can use card fields to
 * quickly include more information on your cards.
 *
 * @typedef {Object} CardField
 * @property {String} key           the key containing the value of this field in document objects. This field must be specified.
 * @property {String} [placeholder] if specified, when the key is not present in a document or is empty, this value will be displayed.
 *                                  if omitted the value will be hidden from the card
 * @property {String} [label]       if specified, a label with the provided text will precede the value
 * @property {String} [format]      for formatter to be used to present the value in a user friendly form. Valid formatters
 *                                  are default, and date. The date format converts unix timestamps into the 'MM/dd/YYYY'
 *                                  format.
 *
 * @example <caption> Basic example </caption>
 *
 // When author is John Doe -> 'Written By: John Doe'
 // When author is omitted the field is not displayed
 //
 var authorField = {
   key: 'author',
   label: 'Written By:',
 };
 *
 * @example <caption> Using the date format </caption>
 *
 // When pubdate is Oct. 10, 1996 -> 'Released 10/13/1996'
 // When pubdate is omitted -> 'Released Unknown'
 //
 var dateField = {
   key: 'pubdate',
   placeholder: 'Unknown',
   label: 'Released',
   format: 'date'
 };
 *
 */

/**
 * The voice navigator is a widget that allows developers to add voice-driven search to their web applications.
 * By adding a small snippet of JavaScript to your page, you can add our voice navigator to your page allowing your
 * users to search and discover your content in natural, spoken language. The voice navigator widget takes care of
 * capturing speech input from your users, displaying a real-time transcript of what is being recorded, and displaying
 * a collection of results in the browser.
 *
 * The voice navigator will display when elements with the 'mm-voice-nav-init' class are clicked and when elements with
 * the 'mm-voice-nav-text-init' receive an enter keypress.
 *
 * @see {@link VoiceNavigatorConfig} for full documentation of configuration options.
 * @see {@link https://developer.expectlabs.com/docs/voiceWidget|MindMeld Voice Navigator} to get started with Voice Navigator.
 * @see {@link https://developer.expectlabs.com/demos|MindMeld Demos} to see the Voice Navigator in action.
 *
 *
 * @example <caption> Loading the voice navigator </caption>
 *
 <script type="text/js">
 var MM = window.MM || {};
     ( function () {
         MM.loader = {
             rootURL: 'https://developer.expectlabs.com/public/sdks/'
         ,   widgets: ['voice']
         };
         MM.widgets = {
             config: {
                 appID: 'YOUR APPID'
             ,   voice: voiceNavigatorConfig  // this object contains your configuration options
             }
         };
         var script = document.createElement('script');
         script.type = 'text/javascript'; script.async = true;
         script.src = MM.loader.rootURL + 'embed.js';
         var t = document.getElementsByTagName('script')[0];
         t.parentNode.insertBefore(script, t);
     }());
 </script>
 *
 * @example <caption> Card Template </caption>
 *
 <script id="vn-card-template" type="text/template">
     <h2 class="title"><%= title %></h2>
     <% if (typeof image !== 'undefined' && image.url && image.url !== '') { %>
         <p class="image not-loaded">
             <img src="<%= image.url %>">
         </p>
         <% } %>

     <% var desc = "No description";
     if (typeof description === 'string') {
         desc = description.substr(0, 150) + (description.length > 150 ? "&hellip;" : "");
     } %>
     <p class="description"><%= desc %></p>

     <% if (typeof pubdate !== 'undefined' && pubdate && pubdate !== '') { %>
         <p class="pub-date">
             <% var date = new Date(pubdate * 1000);
             var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
             var monthName = months[date.getMonth()];
             var dateString = monthName + ' ' + date.getDate() + ', ' + date.getFullYear(); %>
             <%= dateString %>
         </p>
     <% } %>
 </script>
 <script type="text/js">
     var voiceNavigatorConfig = {
         cardTemplate: window['vn-card-template'].innerHTML
     };
     // Now load the voice navigator
 </script>
 *
 * @example <caption> Custom CSS: Changing button colors from the default orange to green </caption>
 *
 <script id="vn-custom-css" type="text/css">
     .mm-button-background {
         background: #008000;
     }
     .mm-button-background:hover {
         background-color: #007300;
     }
     .mm-button-background:active {
         background: -webkit-linear-gradient(#005a00, #008000);
         background: -moz-linear-gradient(#005a00, #008000);
         background: -o-linear-gradient(#005a00, #008000);
         background: -ms-linear-gradient(#005a00, #008000);
         background: linear-gradient(#005a00, #008000);
     }
     .mm-button-border {
         border: 1px solid #006600;
     }

     &#64;-moz-keyframes mm-button-background-active-anim {
         50% { background-color: #006d00; }
     }
     &#64;-webkit-keyframes mm-button-background-active-anim {
         50% { background-color: #006d00; }
     }
     &#64;-o-keyframes mm-button-background-active-anim {
         50% { background-color: #006d00; }
     }
     &#64;keyframes mm-button-background-active-anim {
         50% { background-color: #006d00; }
     }
 </script>
 <script type="text/js">
     var voiceNavigatorConfig = {
         customCSS: window['vn-custom-css'].innerHTML
     };
     // Now load the voice navigator
 </script>
 *
 * @example <caption> Custom CSS: Change cards area appearance </caption>
 <script id="vn-custom-css" type="text/css">
     #cards {
         background-color: darkgoldenrod;
     }
     #cards .card {
         border: solid #333 1px;
         border-radius: 0;
         background: red;
     }
     #cards .card:hover {
         border-color: black;
     }
     #cards .card p {
         color: white;
     }
     #cards .card h2.title {
         color: #ddd;
     }
 </script>
 <script type="text/js">
     var voiceNavigatorConfig = {
         customCSS: window['vn-custom-css'].innerHTML
     };
     // Now load the voice navigator
 </script>
 *
 * @example <caption> Advanced example: card template, custom css, and other options </caption>
 *
 <script id="card-template" type="text/template">
     <h2 class="title"><%= title %></h2>
     <% if (typeof image !== 'undefined' && image.url && image.url !== '') { %>
         <p class="image not-loaded">
             <img src="<%= image.url %>">
         </p>
     <% } %>

     <%  var desc = "No description";
         if (typeof description === 'string') {
             desc = description.substr(0, 150) + (description.length > 150 ? "&hellip;" : "");
         } %>
     <p class="description"><%= desc %></p>

     <div class="mm-vn-row">
     <%  if (typeof rating !== 'undefined' && rating && rating !== '') { %>
         <p class="align-left rating">
             <span class="rating-stars stars69x13">
                 <%  var processedRating = Math.floor(rating * 2 + 0.5) / 2;
                     var ratingClass = 'r' + processedRating.toString().replace('.', '-');; %>
                 <span class="rating-stars-grad <%= ratingClass %>"></span>
                 <span class="rating-stars-img"></span>
             </span>
         </p>
     <%  } else { %>
         <p class="align-left rating placeholder">No rating</p>
     <%  }
         if (typeof reviewcount !== 'undefined' && reviewcount && reviewcount !== '') { %>
             <p class="align-right review-count">
             <%  var scales = ['', 'k', 'M'];
                 var scale = scales.shift();
                 var value = parseInt(reviewcount);
                 while (value > 1000 && scales.length > 0) {
                     scale = scales.shift(); // remove next scale
                     value = value / 1000;
                 } %>
             <%= Math.floor(value * 100) / 100 + scale %> reviews
             </p>
     <%  } else { %>
             <p class="align-right review-count placeholder">No reviews</p>
     <%  } %>
     <p class="clear-fix"></p>
     </div>
 </script>
 <script id="vn-card-css" type="text/css">
     #cards a.card .mm-vn-row p { margin: 2px 0; display: block; }
     #cards a.card .mm-vn-row p.clear-fix { clear: both; }
     #cards a.card .mm-vn-row p.align-left { float: left; text-align: left; }
     #cards a.card .mm-vn-row p.align-right { float: right; text-align: right; }
     #cards a.card .mm-vn-row p.placeholder { font-size: 10px; font-style: italic; color: #aaa; }
     #cards a.card .mm-vn-row .rating { display: inline-block; }
     #cards a.card .mm-vn-row .rating-stars { margin-top: 0; margin-left: 0; position: relative; }
     #cards a.card .mm-vn-row .rating-stars.stars69x13 { width: 69px; height: 13px; }
     #cards a.card .mm-vn-row .rating-stars-grad {
         background: #d77835;
         background: -moz-linear-gradient(top,#d77835 0,#f08727 40%,#f4a066 100%);
         background: -webkit-gradient(linear,left top,left bottom,color-stop(0%,#d77835),color-stop(40%,#f08727),color-stop(100%,#f4a066));
         background: -webkit-linear-gradient(top,#d77835 0,#f08727 40%,#f4a066 100%);
         filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#d77835',endColorstr='#f4a066',GradientType=0);
         position: absolute;
         top: 0;
         left: 0;
         height: 13px;
     }
     #cards a.card .mm-vn-row .rating-stars-grad.r5   { width: 69px; }
     #cards a.card .mm-vn-row .rating-stars-grad.r4-5 { width: 63px; }
     #cards a.card .mm-vn-row .rating-stars-grad.r4   { width: 55px; }
     #cards a.card .mm-vn-row .rating-stars-grad.r3-5 { width: 49px; }
     #cards a.card .mm-vn-row .rating-stars-grad.r3   { width: 41px; }
     #cards a.card .mm-vn-row .rating-stars-grad.r2-5 { width: 35px; }
     #cards a.card .mm-vn-row .rating-stars-grad.r2   { width: 27px; }
     #cards a.card .mm-vn-row .rating-stars-grad.r1-5 { width: 21px; }
     #cards a.card .mm-vn-row .rating-stars-grad.r1   { width: 14px; }
     #cards a.card .mm-vn-row .rating-stars-grad.r0-5 { width:  7px; }
     #cards a.card .mm-vn-row .rating-stars-grad.r0   { width:  0px; }
     #cards a.card .mm-vn-row .stars69x13 .rating-stars-img {
        width: 69px;
        background: url(/public/images/stars.png) no-repeat center center;
        height: 13px;
        position: absolute;
        top: 0;
        left: 0;
     }
 </script>
 <script type="text/js">
     var MM = window.MM || {};
     ( function () {
         MM.loader = {
             rootURL: 'https://developer.expectlabs.com/public/sdks/'
         ,   widgets: ['voice']
         };
         MM.widgets = {
             config: {
                 appID: 'YOUR APPID'
             ,   voice: {
                     cardTemplate: window['vn-card-template'].innerHTML
                 ,   customCSS: window['vn-custom-css'].innerHTML
                 ,   listeningMode: 'continuous' // extended listening when opened
                 ,   cardLinkBehavior: '_blank' // links open in new tabs
                 ,   numResults: 20 // show more cards
                 }
             }
         };
         var script = document.createElement('script');
         script.type = 'text/javascript'; script.async = true;
         script.src = MM.loader.rootURL + 'embed.js';
         var t = document.getElementsByTagName('script')[0];
         t.parentNode.insertBefore(script, t);
     }());
 </script>

 * @memberOf MM
 * @namespace
 */
MM.voiceNavigator = MM.voiceNavigator || {};
MM.loader = MM.loader || {};
MM.loader.rootURL = MM.loader.rootURL || 'https://developer.expectlabs.com/public/sdks/';

/**
 * The 'div#mindmeld-modal' element which contains all of the voice navigator html
 * @private
 */
var $mm = false;

/**
 *
 * @private
 */
var $mm_iframe = false;

/**
 * isInitialized is set to true once the widget has been initialized. Once
 * the widget is initialized onInit() is called. This is used by
 * MM.voiceNavigator.showModal() to allow users to call showModal
 * without having to know if the widget is loaded or not
 *
 * @private
 */
var isInitialized = false;
var onInit = function () {};

function init() {
    // Add the #mindmeld-modal div to the page
    var mm = document.createElement('div');
    mm.setAttribute('id', 'mindmeld-modal');
    document.body.insertBefore(mm, document.body.childNodes[0]);
    $mm = UTIL.el(mm);

    // Initialize any element with .mm-voice-nav-init on it
    var $inits = document.getElementsByClassName('mm-voice-nav-init');
    var $textInits = document.getElementsByClassName('mm-voice-nav-text-init');
    var clickHandler = function(e) {
        e.preventDefault();

        // look for text value in mm-voice-nav-text-init element
        if ($textInits.length > 0) {
            var query = $textInits[0].value;
            MM.voiceNavigator.showModal({ query: query });
        }
        else {
            MM.voiceNavigator.showModal();
        }
    };
    for(var i = 0; i < $inits.length; i++) {
        UTIL.el($inits[i]).click(clickHandler);
    }

    var keyPressHandler = function (event) {
        if (event.which === 13) {
            var query = event.target.value;
            MM.voiceNavigator.showModal({ query: query });
        }
    };
    for(var j = 0; j < $textInits.length; j++) {
        UTIL.el($textInits[j]).keypress(keyPressHandler);
    }

    setInitialized();

    // Wait for messages
    UTIL.el(window).on('message', function(event) {
        if (event.data.source != 'mindmeld') {
            return;
        }
        if(event.data.action == 'close') {
            $mm.removeClass('on');
        }
    });
}

function setInitialized() {
    isInitialized = true;
    onInit();
}

function postMessage(action, data) {
    var win = document.getElementById("mindmeld-iframe").contentWindow;
    win.postMessage({
        action: action,
        source: 'mindmeld',
        data: data
    }, "*");
}

/**
 * Opens the voice navigator modal window
 * @param {Object} [options]
 * @param {String} [options.query]                 if provided, this field will be the initial query, and will immediately show results
 * @param {boolean} [options.forceNewIFrame=false] if true, any voice navigators that have previously been created will
 *                                                 be destroyed, and a new instance will be created.
 */
MM.voiceNavigator.showModal = function(options) {
    options = options || {};
    if (isInitialized) {
        var iframe;
        // Initialize voice navigator config
        if (typeof MM !== 'undefined') {
            if (typeof MM.widgets !== 'undefined' &&
                typeof MM.widgets.config !== 'undefined') {
                // Move config to voice nav config
                MM.voiceNavigator.config = MM.widgets.config.voice || {};
                MM.voiceNavigator.config.appID = MM.widgets.config.appID;
                if (typeof MM.widgets.config.cleanUrl !== 'undefined') {
                    MM.voiceNavigator.config.cleanUrl = MM.widgets.config.cleanUrl;
                }
                if (typeof MM.widgets.config.fayeClientUrl !== 'undefined') {
                    MM.voiceNavigator.config.fayeClientUrl = MM.widgets.config.fayeClientUrl;
                }
            }
            if (typeof MM.voiceNavigator.config !== 'undefined') {
                // parse card layout
                if (typeof MM.voiceNavigator.config.cardTemplate !== 'undefined') {
                    MM.voiceNavigator.config.cardLayout = 'custom';
                }
                if (typeof MM.voiceNavigator.config.cardLayout === 'undefined') {
                    MM.voiceNavigator.config.cardLayout = 'default';
                }

                // make absolute URLs
                if (typeof MM.voiceNavigator.config.customCSSURL !== 'undefined') {
                    MM.voiceNavigator.config.customCSSURL = UTIL.convertToAbsolutePath(MM.voiceNavigator.config.customCSSURL);
                }

                // default listening mode
                if (typeof options.listeningMode !== 'undefined') {
                    MM.voiceNavigator.config.listeningMode = options.listeningMode;
                } else if (typeof MM.voiceNavigator.config.listeningMode === 'undefined') {
                    MM.voiceNavigator.config.listeningMode = 'normal';
                }

                // Pass token, user ID, and session ID if they are set already
                if (typeof MM.token !== 'undefined' &&
                    typeof MM.activeUserId !== 'undefined' && MM.activeUserId !== null &&
                    typeof MM.activeSessionId !== 'undefined' && MM.activeSessionId !== null) {
                    MM.voiceNavigator.config.mmCredentials = {
                        token: MM.token,
                        userID: MM.activeUserId,
                        sessionID: MM.activeSessionId
                    };
                }
                // If defined, pass a starting query
                if (options.query !== undefined && options.query !== '') {
                    MM.voiceNavigator.config.startQuery = options.query;
                }
                else {
                    MM.voiceNavigator.config.startQuery = null;
                }
            }
        }

        if (options.forceNewIFrame && $mm_iframe) {
            iframe = document.getElementById('mindmeld-iframe');
            iframe.parentNode.removeChild(iframe);
        }

        // Create iframe if first load
        if (!$mm_iframe || options.forceNewIFrame) {
            iframe = document.createElement('iframe');
            iframe.setAttribute('frameBorder', '0');
            iframe.setAttribute('id', 'mindmeld-iframe');
            iframe.setAttribute('allowtransparency', 'true');
            iframe.setAttribute('src', MM.loader.rootURL + 'widgets/voiceNavigator/modal/modal.html');

            $mm_iframe = UTIL.el(iframe);

            UTIL.el(iframe).on('load', function() {
                postMessage('config', MM.voiceNavigator.config);
                postMessage('open');
            });

            $mm.el().appendChild(iframe);
        }
        else {
            postMessage('open', MM.voiceNavigator.config);
        }
        $mm.addClass('on');
    }
    else {
        // Set onInit() callback to open modal
        onInit = function () { MM.voiceNavigator.showModal(options); };
    }
}

/**
 * Closes the voice navigator modal window
 */
MM.voiceNavigator.hideModal = function () {
    postMessage('close');
};

// schedule initialization of voice navigator
UTIL.contentLoaded(window, function() {
    init();
});

},{"./util":1}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zd2FyYWovcmVwb3MvbWluZG1lbGQtanMtc2RrL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3dhcmFqL3JlcG9zL21pbmRtZWxkLWpzLXNkay9zcmMvd2lkZ2V0cy92b2ljZU5hdmlnYXRvci9qcy91dGlsLmpzIiwiL1VzZXJzL3N3YXJhai9yZXBvcy9taW5kbWVsZC1qcy1zZGsvc3JjL3dpZGdldHMvdm9pY2VOYXZpZ2F0b3IvanMvdmVuZG9yL2NvbnRlbnRsb2FkZWQuanMiLCIvVXNlcnMvc3dhcmFqL3JlcG9zL21pbmRtZWxkLWpzLXNkay9zcmMvd2lkZ2V0cy92b2ljZU5hdmlnYXRvci9qcy93aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL3ZlbmRvci9jb250ZW50bG9hZGVkJyk7XG5cbi8qIEEgd3JhcHBlciBmb3IgZG9tIGVsZW1lbnRzLCBiYXNpY2FsbHkgYSBsaXRlIHZlcnNpb24gb2YgalF1ZXJ5J3MgJCAqL1xuZXhwb3J0cy5lbCA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgb246IGZ1bmN0aW9uKGV2ZW50LCBmdW5jKSB7XG4gICAgICAgICAgICBpZihlbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCxmdW5jLGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihlbC5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgICAgIGVsLmF0dGFjaEV2ZW50KFwib25cIitldmVudCxmdW5jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjbGljazogZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgICAgdGhpcy5vbignY2xpY2snLCBmdW5jKTtcbiAgICAgICAgfSxcblxuICAgICAgICBrZXlwcmVzczogZnVuY3Rpb24gKGZ1bmMpIHtcbiAgICAgICAgICAgIHRoaXMub24oJ2tleXByZXNzJywgZnVuYyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgbmV3IFJlZ0V4cCgnKF58XFxcXHMrKScgKyBjbGFzc05hbWUgKyAnKFxcXFxzK3wkKScsICdnJyksXG4gICAgICAgICAgICAgICAgJyQxJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRDbGFzczogZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUgKyBcIiBcIiArIGNsYXNzTmFtZTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cbmV4cG9ydHMuY29udmVydFRvQWJzb2x1dGVQYXRoID0gZnVuY3Rpb24oaHJlZikge1xuICAgIHZhciBhbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYW5jaG9yLmhyZWYgPSBocmVmO1xuICAgIHJldHVybiAoYW5jaG9yLnByb3RvY29sICsgJy8vJyArIGFuY2hvci5ob3N0ICsgYW5jaG9yLnBhdGhuYW1lICsgYW5jaG9yLnNlYXJjaCArIGFuY2hvci5oYXNoKTtcbn07XG5cbmZ1bmN0aW9uIGFkZExlYWRpbmdaZXJvcyhudW1iZXIsIGRpZ2l0cykge1xuICAgIHZhciBiYXNlID0gTWF0aC5wb3coMTAsIGRpZ2l0cyk7XG4gICAgbnVtYmVyICs9IGJhc2U7XG4gICAgbnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgcmV0dXJuIG51bWJlci5zdWJzdHJpbmcobnVtYmVyLmxlbmd0aCAtIGRpZ2l0cyk7XG59XG5cbmV4cG9ydHMudGltZXN0YW1wID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBkYXRlID0gZGF0ZSB8fCBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MoZGF0ZS5nZXRGdWxsWWVhcigpLCA0KSArICcuJ1xuICAgICAgICArIGFkZExlYWRpbmdaZXJvcyhkYXRlLmdldE1vbnRoKCkgKyAxLCAyKSArICcuJ1xuICAgICAgICArIGFkZExlYWRpbmdaZXJvcyhkYXRlLmdldERhdGUoKSwgMikgKyAnICcgKyBkYXRlLnRvVGltZVN0cmluZygpO1xufTtcblxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgYXJncy5zcGxpY2UoMCwgMCwgZXhwb3J0cy50aW1lc3RhbXAoKSk7XG4gICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJncyk7XG59O1xuXG5leHBvcnRzLmNvbnRlbnRMb2FkZWQgPSBjb250ZW50TG9hZGVkOyIsIi8qIVxuICogY29udGVudGxvYWRlZC5qc1xuICpcbiAqIEF1dGhvcjogRGllZ28gUGVyaW5pIChkaWVnby5wZXJpbmkgYXQgZ21haWwuY29tKVxuICogU3VtbWFyeTogY3Jvc3MtYnJvd3NlciB3cmFwcGVyIGZvciBET01Db250ZW50TG9hZGVkXG4gKiBVcGRhdGVkOiAyMDEwMTAyMFxuICogTGljZW5zZTogTUlUXG4gKiBWZXJzaW9uOiAxLjJcbiAqXG4gKiBVUkw6XG4gKiBodHRwOi8vamF2YXNjcmlwdC5ud2JveC5jb20vQ29udGVudExvYWRlZC9cbiAqIGh0dHA6Ly9qYXZhc2NyaXB0Lm53Ym94LmNvbS9Db250ZW50TG9hZGVkL01JVC1MSUNFTlNFXG4gKlxuICovXG5cbi8vIEB3aW4gd2luZG93IHJlZmVyZW5jZVxuLy8gQGZuIGZ1bmN0aW9uIHJlZmVyZW5jZVxud2luZG93LmNvbnRlbnRMb2FkZWQgPSBmdW5jdGlvbiBjb250ZW50TG9hZGVkKHdpbiwgZm4pIHtcblxuXHR2YXIgZG9uZSA9IGZhbHNlLCB0b3AgPSB0cnVlLFxuXG5cdGRvYyA9IHdpbi5kb2N1bWVudCwgcm9vdCA9IGRvYy5kb2N1bWVudEVsZW1lbnQsXG5cblx0YWRkID0gZG9jLmFkZEV2ZW50TGlzdGVuZXIgPyAnYWRkRXZlbnRMaXN0ZW5lcicgOiAnYXR0YWNoRXZlbnQnLFxuXHRyZW0gPSBkb2MuYWRkRXZlbnRMaXN0ZW5lciA/ICdyZW1vdmVFdmVudExpc3RlbmVyJyA6ICdkZXRhY2hFdmVudCcsXG5cdHByZSA9IGRvYy5hZGRFdmVudExpc3RlbmVyID8gJycgOiAnb24nLFxuXG5cdGluaXQgPSBmdW5jdGlvbihlKSB7XG5cdFx0aWYgKGUudHlwZSA9PSAncmVhZHlzdGF0ZWNoYW5nZScgJiYgZG9jLnJlYWR5U3RhdGUgIT0gJ2NvbXBsZXRlJykgcmV0dXJuO1xuXHRcdChlLnR5cGUgPT0gJ2xvYWQnID8gd2luIDogZG9jKVtyZW1dKHByZSArIGUudHlwZSwgaW5pdCwgZmFsc2UpO1xuXHRcdGlmICghZG9uZSAmJiAoZG9uZSA9IHRydWUpKSBmbi5jYWxsKHdpbiwgZS50eXBlIHx8IGUpO1xuXHR9LFxuXG5cdHBvbGwgPSBmdW5jdGlvbigpIHtcblx0XHR0cnkgeyByb290LmRvU2Nyb2xsKCdsZWZ0Jyk7IH0gY2F0Y2goZSkgeyBzZXRUaW1lb3V0KHBvbGwsIDUwKTsgcmV0dXJuOyB9XG5cdFx0aW5pdCgncG9sbCcpO1xuXHR9O1xuXG5cdGlmIChkb2MucmVhZHlTdGF0ZSA9PSAnY29tcGxldGUnKSBmbi5jYWxsKHdpbiwgJ2xhenknKTtcblx0ZWxzZSB7XG5cdFx0aWYgKGRvYy5jcmVhdGVFdmVudE9iamVjdCAmJiByb290LmRvU2Nyb2xsKSB7XG5cdFx0XHR0cnkgeyB0b3AgPSAhd2luLmZyYW1lRWxlbWVudDsgfSBjYXRjaChlKSB7IH1cblx0XHRcdGlmICh0b3ApIHBvbGwoKTtcblx0XHR9XG5cdFx0ZG9jW2FkZF0ocHJlICsgJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0LCBmYWxzZSk7XG5cdFx0ZG9jW2FkZF0ocHJlICsgJ3JlYWR5c3RhdGVjaGFuZ2UnLCBpbml0LCBmYWxzZSk7XG5cdFx0d2luW2FkZF0ocHJlICsgJ2xvYWQnLCBpbml0LCBmYWxzZSk7XG5cdH1cblxufVxuIiwidmFyIFVUSUwgPSAgcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgTU0gPSB3aW5kb3cuTU0gPSB3aW5kb3cuTU0gfHwge307XG5cblxuLyoqXG4gKiBBbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHtAbGluayBNTS52b2ljZU5hdmlnYXRvcn1cbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBWb2ljZU5hdmlnYXRvckNvbmZpZ1xuICogQHByb3BlcnR5IHtTdHJpbmd9IFtjYXJkTGlua0JlaGF2aW9yPVwiX3BhcmVudFwiXSBzZXRzIHRoZSBiZWhhdmlvciBmb3IgYW5jaG9ycyB3cmFwcGluZyBjYXJkcy4gVXNlICdmYWxzZScgdG9cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZlbnQgb3BlbmluZyBsaW5rcywgJ19wYXJlbnQnIHRvIG9wZW4gbGlua3MgaW4gdGhlIHNhbWUgdGFiIG9yIHdpbmRvdyxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yICdfYmxhbmsnIHRvIG9wZW4gbGlua3MgaW4gYSBuZXcgdGFiIG9yIHdpbmRvdy4gU2VlIHRoZSB0YXJnZXQgYXR0cmlidXRlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZiBbYW5jaG9yXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0VsZW1lbnQvYSlcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICogQHByb3BlcnR5IHtTdHJpbmd9IFtsaXN0ZW5pbmdNb2RlPVwibm9ybWFsXCJdICAgICBkZWZpbmVzIHRoZSBsaXN0ZW5pbmcgbW9kZSBvZiB0aGUgdm9pY2UgbmF2aWdhdG9yIHdoZW4gaXQgaXMgb3BlbmVkLiBBY2NlcHRhYmxlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgaW5jbHVkZSAnbm9ybWFsJywgJ2NvbnRpbnVvdXMnLCBhbmQgZmFsc2UuIEZhbHNlIHByZXZlbnRzIGxpc3RlbmluZ1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIHRoZSBkZWZhdWx0IGlzICdub3JtYWwnLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFtudW1SZXN1bHRzXSAgICAgICAgICAgICAgICAgaWYgc3BlY2lmaWVkLCB0aGlzIG51bWJlciBvZiBjYXJkcyB3aWxsIGFwcGVhciBhcyByZXN1bHRzXG4gKiBAcHJvcGVydHkge0NhcmRGaWVsZFtdfSBbY2FyZEZpZWxkc10gICAgICAgICAgICBhbiBhcnJheSBvZiBjYXJkIGZpZWxkcyB3aGljaCB3aWxsIGJlIGFwcGVuZGVkIHRvIHRoZSBjYXJkLiBXaXRoIGNhcmQgZmllbGRzLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeW91IGNhbiByZW5kZXIgZG9jdW1lbnQgZmllbGRzIHRoYXQgYXJlIHNwZWNpZmljIHRvIHlvdXIgYXBwbGljYXRpb24uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWUge0BsaW5rIENhcmRGaWVsZH0gZm9yIG1vcmUgaW5mb3JtYXRpb25cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbY2FyZFRlbXBsYXRlXSAgICAgICAgICAgICAgIGFuIFt1bmRlcnNjb3JlXShodHRwOi8vdW5kZXJzY29yZWpzLm9yZy8jdGVtcGxhdGUpIChvciBsb2Rhc2gpIGh0bWxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlIHdoaWNoIGlzIHVzZWQgdG8gY3JlYXRlIGEgY2FyZCByZXByZXNlbnRhdGlvbiBvZiBhIGRvY3VtZW50XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuIFRoZSByZXN1bHRpbmcgaHRtbCwgaXMgd3JhcHBlZCBpbiBhbiBhbmNob3IgZWxlbWVudCB3aGljaCBsaW5rc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gdGhlIGRvY3VtZW50J3MgdXJsLiBUaGUgdGVtcGxhdGUgaXMgc3VwcGxpZWQgd2l0aCB0aGUgZG9jdW1lbnQgb2JqZWN0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5lZCBieSB0aGUgQVBJLiBBIGNhcmQgdGVtcGxhdGUgY2FuIGJlIHVzZWQgdG8gcmVuZGVyIGFueSBkb2N1bWVudFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzIHRoYXQgYXJlIHNwZWNpZmljIHRvIHlvdXIgYXBwbGljYXRpb24gd2l0aCBjdXN0b20gbG9naWMuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtyZXNldENhcmRzQ1NTXSAgICAgICAgICAgICBpZiB0cnVlLCByZW1vdmVzIENTUyBzcGVjaWZpYyB0byB0aGUgY2FyZHMgY29udGFpbmVyLiBUaGlzIGNhbiBiZSBoZWxwZnVsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiB0aGUgZGVmYXVsdCBjYXJkcyBDU1MgaXMgY29uZmxpY3Rpbmcgd2l0aCB5b3VyIG93biBjdXN0b21DU1NcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbY3VzdG9tQ1NTXSAgICAgICAgICAgICAgICAgIHNwZWNpZmllcyBjdXN0b20gQ1NTIHRvIGJlIGFwcGxpZWQgdG8gdGhlIHZvaWNlIG5hdmlnYXRvci4gWW91IGNhbiB1c2VcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbSBDU1MgdG8gY2hhbmdlIHRoZSBhcHBlYXJhbmNlIG9mIHRoZSB2b2ljZSBuYXZpZ2F0b3Igd2lkZ2V0IGFuZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXQncyBkb2N1bWVudCBjYXJkcywgdG8gYmV0dGVyIHN1aXQgeW91ciBicmFuZGluZy4gV2hlbiB1c2luZyB0aGlzIHBhcmFtZXRlcixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBzdHlsaW5nIHdpbGwgYmUgaW5jbHVkZWQgYXMgZW1iZWRkZWQgQ1NTLCB3aGljaCB0YWtlcyBwcmVjZWRlbmNlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVyIGV4dGVybmFsIENTUy5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbY3VzdG9tQ1NTVVJMXSAgICAgICAgICAgICAgIHNwZWNpZmllcyB0aGUgdXJsIG9mIGEgZmlsZSBjb250YWluaW5nIGN1c3RvbSBDU1MgdG8gYmUgYXBwbGllZCB0byB0aGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZvaWNlIG5hdmlnYXRvci4gVGhpcyBwYXJhbWV0ZXIgd29ya3MgdGhlIHNhbWUgYXMgY3VzdG9tQ1NTLCBleGNlcHQgdGhhdFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHN0eWxpbmcgd2lsbCBiZSBhcHBsaWVkIGFzIGV4dGVybmFsIENTUywgYnkgbGlua2luZyB0byB0aGUgdXJsIHByb3ZpZGVkLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhpcyBjYW4gYmUgaGVscGZ1bCBpZiB5b3Ugd291bGQgbGlrZSB0byByZWZlciB0byBpbWFnZXMgd2l0aCByZWxhdGl2ZSBwYXRocy5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBbYmFzZVpJbmRleD0xMDAwMDBdICAgICAgICAgIHRoZSB2b2ljZSBuYXZpZ2F0b3IgZWxlbWVudHMgd2lsbCBoYXZlIGEgWiBpbmRleCBiZXR3ZWVuIHRoZSB2YWx1ZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2l2ZW4gYW5kIDEwMDAgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZS4gSWYgdGhlIHZvaWNlIG5hdmlnYXRvciBpcyBoaWRkZW5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVybmVhdGggZWxlbWVudHMgb24gYSBwYWdlLCB0cnkgc2V0dGluZyBpdCB0byBzb21ldGhpbmcgaGlnaGVyLlxuICogQHByb3BlcnR5IHtPYmplY3QuPHN0cmluZywgbnVtYmVyPn0gW2hpZ2hsaWdodF0gdGhlIGhpZ2hsaWdodCBwYXJhbWV0ZXIgZm9yIHtAbGluayBWb2ljZU5hdmlnYXRvckNvbmZpZ30gc3BlY2lmaWVzIHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQgZmllbGRzIHRvIHJldHVybiBzbmlwcGV0cyBzaG93aW5nIG1hdGNoaW5nIHJlc3VsdHMuIFRoZSBmaWVsZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgdGhlIHNhbWUgYXMgdGhlIGZpZWxkIHVzZWQgaW4gdGhlIEFQSSB0byBzaG93IGhpZ2hsaWdodGVkIHRleHQgaW4gdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBUEkgYXMgZG9jdW1lbnRlZCBbaGVyZV0oaHR0cHM6Ly9kZXZlbG9wZXIuZXhwZWN0bGFicy5jb20vZG9jcy9lbmRwb2ludFNlc3Npb24jZ2V0U2Vzc2lvblNlc3Npb25pZERvY3VtZW50cykuXG4gKlxuICovXG5cbi8qKlxuICogQW4gT2JqZWN0IHJlcHJlc2VudGluZyBhIGZpZWxkIHRvIGRpc3BsYXkgaW4gYSBkb2N1bWVudCBjYXJkIGZvciB0aGUgVm9pY2UgTmF2aWdhdG9yIHdpZGdldC4gWW91IGNhbiB1c2UgY2FyZCBmaWVsZHMgdG9cbiAqIHF1aWNrbHkgaW5jbHVkZSBtb3JlIGluZm9ybWF0aW9uIG9uIHlvdXIgY2FyZHMuXG4gKlxuICogQHR5cGVkZWYge09iamVjdH0gQ2FyZEZpZWxkXG4gKiBAcHJvcGVydHkge1N0cmluZ30ga2V5ICAgICAgICAgICB0aGUga2V5IGNvbnRhaW5pbmcgdGhlIHZhbHVlIG9mIHRoaXMgZmllbGQgaW4gZG9jdW1lbnQgb2JqZWN0cy4gVGhpcyBmaWVsZCBtdXN0IGJlIHNwZWNpZmllZC5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbcGxhY2Vob2xkZXJdIGlmIHNwZWNpZmllZCwgd2hlbiB0aGUga2V5IGlzIG5vdCBwcmVzZW50IGluIGEgZG9jdW1lbnQgb3IgaXMgZW1wdHksIHRoaXMgdmFsdWUgd2lsbCBiZSBkaXNwbGF5ZWQuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBvbWl0dGVkIHRoZSB2YWx1ZSB3aWxsIGJlIGhpZGRlbiBmcm9tIHRoZSBjYXJkXG4gKiBAcHJvcGVydHkge1N0cmluZ30gW2xhYmVsXSAgICAgICBpZiBzcGVjaWZpZWQsIGEgbGFiZWwgd2l0aCB0aGUgcHJvdmlkZWQgdGV4dCB3aWxsIHByZWNlZGUgdGhlIHZhbHVlXG4gKiBAcHJvcGVydHkge1N0cmluZ30gW2Zvcm1hdF0gICAgICBmb3IgZm9ybWF0dGVyIHRvIGJlIHVzZWQgdG8gcHJlc2VudCB0aGUgdmFsdWUgaW4gYSB1c2VyIGZyaWVuZGx5IGZvcm0uIFZhbGlkIGZvcm1hdHRlcnNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZSBkZWZhdWx0LCBhbmQgZGF0ZS4gVGhlIGRhdGUgZm9ybWF0IGNvbnZlcnRzIHVuaXggdGltZXN0YW1wcyBpbnRvIHRoZSAnTU0vZGQvWVlZWSdcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdC5cbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj4gQmFzaWMgZXhhbXBsZSA8L2NhcHRpb24+XG4gKlxuIC8vIFdoZW4gYXV0aG9yIGlzIEpvaG4gRG9lIC0+ICdXcml0dGVuIEJ5OiBKb2huIERvZSdcbiAvLyBXaGVuIGF1dGhvciBpcyBvbWl0dGVkIHRoZSBmaWVsZCBpcyBub3QgZGlzcGxheWVkXG4gLy9cbiB2YXIgYXV0aG9yRmllbGQgPSB7XG4gICBrZXk6ICdhdXRob3InLFxuICAgbGFiZWw6ICdXcml0dGVuIEJ5OicsXG4gfTtcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj4gVXNpbmcgdGhlIGRhdGUgZm9ybWF0IDwvY2FwdGlvbj5cbiAqXG4gLy8gV2hlbiBwdWJkYXRlIGlzIE9jdC4gMTAsIDE5OTYgLT4gJ1JlbGVhc2VkIDEwLzEzLzE5OTYnXG4gLy8gV2hlbiBwdWJkYXRlIGlzIG9taXR0ZWQgLT4gJ1JlbGVhc2VkIFVua25vd24nXG4gLy9cbiB2YXIgZGF0ZUZpZWxkID0ge1xuICAga2V5OiAncHViZGF0ZScsXG4gICBwbGFjZWhvbGRlcjogJ1Vua25vd24nLFxuICAgbGFiZWw6ICdSZWxlYXNlZCcsXG4gICBmb3JtYXQ6ICdkYXRlJ1xuIH07XG4gKlxuICovXG5cbi8qKlxuICogVGhlIHZvaWNlIG5hdmlnYXRvciBpcyBhIHdpZGdldCB0aGF0IGFsbG93cyBkZXZlbG9wZXJzIHRvIGFkZCB2b2ljZS1kcml2ZW4gc2VhcmNoIHRvIHRoZWlyIHdlYiBhcHBsaWNhdGlvbnMuXG4gKiBCeSBhZGRpbmcgYSBzbWFsbCBzbmlwcGV0IG9mIEphdmFTY3JpcHQgdG8geW91ciBwYWdlLCB5b3UgY2FuIGFkZCBvdXIgdm9pY2UgbmF2aWdhdG9yIHRvIHlvdXIgcGFnZSBhbGxvd2luZyB5b3VyXG4gKiB1c2VycyB0byBzZWFyY2ggYW5kIGRpc2NvdmVyIHlvdXIgY29udGVudCBpbiBuYXR1cmFsLCBzcG9rZW4gbGFuZ3VhZ2UuIFRoZSB2b2ljZSBuYXZpZ2F0b3Igd2lkZ2V0IHRha2VzIGNhcmUgb2ZcbiAqIGNhcHR1cmluZyBzcGVlY2ggaW5wdXQgZnJvbSB5b3VyIHVzZXJzLCBkaXNwbGF5aW5nIGEgcmVhbC10aW1lIHRyYW5zY3JpcHQgb2Ygd2hhdCBpcyBiZWluZyByZWNvcmRlZCwgYW5kIGRpc3BsYXlpbmdcbiAqIGEgY29sbGVjdGlvbiBvZiByZXN1bHRzIGluIHRoZSBicm93c2VyLlxuICpcbiAqIFRoZSB2b2ljZSBuYXZpZ2F0b3Igd2lsbCBkaXNwbGF5IHdoZW4gZWxlbWVudHMgd2l0aCB0aGUgJ21tLXZvaWNlLW5hdi1pbml0JyBjbGFzcyBhcmUgY2xpY2tlZCBhbmQgd2hlbiBlbGVtZW50cyB3aXRoXG4gKiB0aGUgJ21tLXZvaWNlLW5hdi10ZXh0LWluaXQnIHJlY2VpdmUgYW4gZW50ZXIga2V5cHJlc3MuXG4gKlxuICogQHNlZSB7QGxpbmsgVm9pY2VOYXZpZ2F0b3JDb25maWd9IGZvciBmdWxsIGRvY3VtZW50YXRpb24gb2YgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIuZXhwZWN0bGFicy5jb20vZG9jcy92b2ljZVdpZGdldHxNaW5kTWVsZCBWb2ljZSBOYXZpZ2F0b3J9IHRvIGdldCBzdGFydGVkIHdpdGggVm9pY2UgTmF2aWdhdG9yLlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIuZXhwZWN0bGFicy5jb20vZGVtb3N8TWluZE1lbGQgRGVtb3N9IHRvIHNlZSB0aGUgVm9pY2UgTmF2aWdhdG9yIGluIGFjdGlvbi5cbiAqXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+IExvYWRpbmcgdGhlIHZvaWNlIG5hdmlnYXRvciA8L2NhcHRpb24+XG4gKlxuIDxzY3JpcHQgdHlwZT1cInRleHQvanNcIj5cbiB2YXIgTU0gPSB3aW5kb3cuTU0gfHwge307XG4gICAgICggZnVuY3Rpb24gKCkge1xuICAgICAgICAgTU0ubG9hZGVyID0ge1xuICAgICAgICAgICAgIHJvb3RVUkw6ICdodHRwczovL2RldmVsb3Blci5leHBlY3RsYWJzLmNvbS9wdWJsaWMvc2Rrcy8nXG4gICAgICAgICAsICAgd2lkZ2V0czogWyd2b2ljZSddXG4gICAgICAgICB9O1xuICAgICAgICAgTU0ud2lkZ2V0cyA9IHtcbiAgICAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgICAgICAgYXBwSUQ6ICdZT1VSIEFQUElEJ1xuICAgICAgICAgICAgICwgICB2b2ljZTogdm9pY2VOYXZpZ2F0b3JDb25maWcgIC8vIHRoaXMgb2JqZWN0IGNvbnRhaW5zIHlvdXIgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAgICAgICAgICAgfVxuICAgICAgICAgfTtcbiAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IHNjcmlwdC5hc3luYyA9IHRydWU7XG4gICAgICAgICBzY3JpcHQuc3JjID0gTU0ubG9hZGVyLnJvb3RVUkwgKyAnZW1iZWQuanMnO1xuICAgICAgICAgdmFyIHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gICAgICAgICB0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgdCk7XG4gICAgIH0oKSk7XG4gPC9zY3JpcHQ+XG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+IENhcmQgVGVtcGxhdGUgPC9jYXB0aW9uPlxuICpcbiA8c2NyaXB0IGlkPVwidm4tY2FyZC10ZW1wbGF0ZVwiIHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XG4gICAgIDxoMiBjbGFzcz1cInRpdGxlXCI+PCU9IHRpdGxlICU+PC9oMj5cbiAgICAgPCUgaWYgKHR5cGVvZiBpbWFnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1hZ2UudXJsICYmIGltYWdlLnVybCAhPT0gJycpIHsgJT5cbiAgICAgICAgIDxwIGNsYXNzPVwiaW1hZ2Ugbm90LWxvYWRlZFwiPlxuICAgICAgICAgICAgIDxpbWcgc3JjPVwiPCU9IGltYWdlLnVybCAlPlwiPlxuICAgICAgICAgPC9wPlxuICAgICAgICAgPCUgfSAlPlxuXG4gICAgIDwlIHZhciBkZXNjID0gXCJObyBkZXNjcmlwdGlvblwiO1xuICAgICBpZiAodHlwZW9mIGRlc2NyaXB0aW9uID09PSAnc3RyaW5nJykge1xuICAgICAgICAgZGVzYyA9IGRlc2NyaXB0aW9uLnN1YnN0cigwLCAxNTApICsgKGRlc2NyaXB0aW9uLmxlbmd0aCA+IDE1MCA/IFwiJmhlbGxpcDtcIiA6IFwiXCIpO1xuICAgICB9ICU+XG4gICAgIDxwIGNsYXNzPVwiZGVzY3JpcHRpb25cIj48JT0gZGVzYyAlPjwvcD5cblxuICAgICA8JSBpZiAodHlwZW9mIHB1YmRhdGUgIT09ICd1bmRlZmluZWQnICYmIHB1YmRhdGUgJiYgcHViZGF0ZSAhPT0gJycpIHsgJT5cbiAgICAgICAgIDxwIGNsYXNzPVwicHViLWRhdGVcIj5cbiAgICAgICAgICAgICA8JSB2YXIgZGF0ZSA9IG5ldyBEYXRlKHB1YmRhdGUgKiAxMDAwKTtcbiAgICAgICAgICAgICB2YXIgbW9udGhzID0gWyAnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLCAnT2N0JywgJ05vdicsICdEZWMnIF07XG4gICAgICAgICAgICAgdmFyIG1vbnRoTmFtZSA9IG1vbnRoc1tkYXRlLmdldE1vbnRoKCldO1xuICAgICAgICAgICAgIHZhciBkYXRlU3RyaW5nID0gbW9udGhOYW1lICsgJyAnICsgZGF0ZS5nZXREYXRlKCkgKyAnLCAnICsgZGF0ZS5nZXRGdWxsWWVhcigpOyAlPlxuICAgICAgICAgICAgIDwlPSBkYXRlU3RyaW5nICU+XG4gICAgICAgICA8L3A+XG4gICAgIDwlIH0gJT5cbiA8L3NjcmlwdD5cbiA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2pzXCI+XG4gICAgIHZhciB2b2ljZU5hdmlnYXRvckNvbmZpZyA9IHtcbiAgICAgICAgIGNhcmRUZW1wbGF0ZTogd2luZG93Wyd2bi1jYXJkLXRlbXBsYXRlJ10uaW5uZXJIVE1MXG4gICAgIH07XG4gICAgIC8vIE5vdyBsb2FkIHRoZSB2b2ljZSBuYXZpZ2F0b3JcbiA8L3NjcmlwdD5cbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj4gQ3VzdG9tIENTUzogQ2hhbmdpbmcgYnV0dG9uIGNvbG9ycyBmcm9tIHRoZSBkZWZhdWx0IG9yYW5nZSB0byBncmVlbiA8L2NhcHRpb24+XG4gKlxuIDxzY3JpcHQgaWQ9XCJ2bi1jdXN0b20tY3NzXCIgdHlwZT1cInRleHQvY3NzXCI+XG4gICAgIC5tbS1idXR0b24tYmFja2dyb3VuZCB7XG4gICAgICAgICBiYWNrZ3JvdW5kOiAjMDA4MDAwO1xuICAgICB9XG4gICAgIC5tbS1idXR0b24tYmFja2dyb3VuZDpob3ZlciB7XG4gICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA3MzAwO1xuICAgICB9XG4gICAgIC5tbS1idXR0b24tYmFja2dyb3VuZDphY3RpdmUge1xuICAgICAgICAgYmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoIzAwNWEwMCwgIzAwODAwMCk7XG4gICAgICAgICBiYWNrZ3JvdW5kOiAtbW96LWxpbmVhci1ncmFkaWVudCgjMDA1YTAwLCAjMDA4MDAwKTtcbiAgICAgICAgIGJhY2tncm91bmQ6IC1vLWxpbmVhci1ncmFkaWVudCgjMDA1YTAwLCAjMDA4MDAwKTtcbiAgICAgICAgIGJhY2tncm91bmQ6IC1tcy1saW5lYXItZ3JhZGllbnQoIzAwNWEwMCwgIzAwODAwMCk7XG4gICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoIzAwNWEwMCwgIzAwODAwMCk7XG4gICAgIH1cbiAgICAgLm1tLWJ1dHRvbi1ib3JkZXIge1xuICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgIzAwNjYwMDtcbiAgICAgfVxuXG4gICAgICYjNjQ7LW1vei1rZXlmcmFtZXMgbW0tYnV0dG9uLWJhY2tncm91bmQtYWN0aXZlLWFuaW0ge1xuICAgICAgICAgNTAlIHsgYmFja2dyb3VuZC1jb2xvcjogIzAwNmQwMDsgfVxuICAgICB9XG4gICAgICYjNjQ7LXdlYmtpdC1rZXlmcmFtZXMgbW0tYnV0dG9uLWJhY2tncm91bmQtYWN0aXZlLWFuaW0ge1xuICAgICAgICAgNTAlIHsgYmFja2dyb3VuZC1jb2xvcjogIzAwNmQwMDsgfVxuICAgICB9XG4gICAgICYjNjQ7LW8ta2V5ZnJhbWVzIG1tLWJ1dHRvbi1iYWNrZ3JvdW5kLWFjdGl2ZS1hbmltIHtcbiAgICAgICAgIDUwJSB7IGJhY2tncm91bmQtY29sb3I6ICMwMDZkMDA7IH1cbiAgICAgfVxuICAgICAmIzY0O2tleWZyYW1lcyBtbS1idXR0b24tYmFja2dyb3VuZC1hY3RpdmUtYW5pbSB7XG4gICAgICAgICA1MCUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA2ZDAwOyB9XG4gICAgIH1cbiA8L3NjcmlwdD5cbiA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2pzXCI+XG4gICAgIHZhciB2b2ljZU5hdmlnYXRvckNvbmZpZyA9IHtcbiAgICAgICAgIGN1c3RvbUNTUzogd2luZG93Wyd2bi1jdXN0b20tY3NzJ10uaW5uZXJIVE1MXG4gICAgIH07XG4gICAgIC8vIE5vdyBsb2FkIHRoZSB2b2ljZSBuYXZpZ2F0b3JcbiA8L3NjcmlwdD5cbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj4gQ3VzdG9tIENTUzogQ2hhbmdlIGNhcmRzIGFyZWEgYXBwZWFyYW5jZSA8L2NhcHRpb24+XG4gPHNjcmlwdCBpZD1cInZuLWN1c3RvbS1jc3NcIiB0eXBlPVwidGV4dC9jc3NcIj5cbiAgICAgI2NhcmRzIHtcbiAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGRhcmtnb2xkZW5yb2Q7XG4gICAgIH1cbiAgICAgI2NhcmRzIC5jYXJkIHtcbiAgICAgICAgIGJvcmRlcjogc29saWQgIzMzMyAxcHg7XG4gICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgICAgICAgYmFja2dyb3VuZDogcmVkO1xuICAgICB9XG4gICAgICNjYXJkcyAuY2FyZDpob3ZlciB7XG4gICAgICAgICBib3JkZXItY29sb3I6IGJsYWNrO1xuICAgICB9XG4gICAgICNjYXJkcyAuY2FyZCBwIHtcbiAgICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICAgfVxuICAgICAjY2FyZHMgLmNhcmQgaDIudGl0bGUge1xuICAgICAgICAgY29sb3I6ICNkZGQ7XG4gICAgIH1cbiA8L3NjcmlwdD5cbiA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2pzXCI+XG4gICAgIHZhciB2b2ljZU5hdmlnYXRvckNvbmZpZyA9IHtcbiAgICAgICAgIGN1c3RvbUNTUzogd2luZG93Wyd2bi1jdXN0b20tY3NzJ10uaW5uZXJIVE1MXG4gICAgIH07XG4gICAgIC8vIE5vdyBsb2FkIHRoZSB2b2ljZSBuYXZpZ2F0b3JcbiA8L3NjcmlwdD5cbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj4gQWR2YW5jZWQgZXhhbXBsZTogY2FyZCB0ZW1wbGF0ZSwgY3VzdG9tIGNzcywgYW5kIG90aGVyIG9wdGlvbnMgPC9jYXB0aW9uPlxuICpcbiA8c2NyaXB0IGlkPVwiY2FyZC10ZW1wbGF0ZVwiIHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XG4gICAgIDxoMiBjbGFzcz1cInRpdGxlXCI+PCU9IHRpdGxlICU+PC9oMj5cbiAgICAgPCUgaWYgKHR5cGVvZiBpbWFnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1hZ2UudXJsICYmIGltYWdlLnVybCAhPT0gJycpIHsgJT5cbiAgICAgICAgIDxwIGNsYXNzPVwiaW1hZ2Ugbm90LWxvYWRlZFwiPlxuICAgICAgICAgICAgIDxpbWcgc3JjPVwiPCU9IGltYWdlLnVybCAlPlwiPlxuICAgICAgICAgPC9wPlxuICAgICA8JSB9ICU+XG5cbiAgICAgPCUgIHZhciBkZXNjID0gXCJObyBkZXNjcmlwdGlvblwiO1xuICAgICAgICAgaWYgKHR5cGVvZiBkZXNjcmlwdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICBkZXNjID0gZGVzY3JpcHRpb24uc3Vic3RyKDAsIDE1MCkgKyAoZGVzY3JpcHRpb24ubGVuZ3RoID4gMTUwID8gXCImaGVsbGlwO1wiIDogXCJcIik7XG4gICAgICAgICB9ICU+XG4gICAgIDxwIGNsYXNzPVwiZGVzY3JpcHRpb25cIj48JT0gZGVzYyAlPjwvcD5cblxuICAgICA8ZGl2IGNsYXNzPVwibW0tdm4tcm93XCI+XG4gICAgIDwlICBpZiAodHlwZW9mIHJhdGluZyAhPT0gJ3VuZGVmaW5lZCcgJiYgcmF0aW5nICYmIHJhdGluZyAhPT0gJycpIHsgJT5cbiAgICAgICAgIDxwIGNsYXNzPVwiYWxpZ24tbGVmdCByYXRpbmdcIj5cbiAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInJhdGluZy1zdGFycyBzdGFyczY5eDEzXCI+XG4gICAgICAgICAgICAgICAgIDwlICB2YXIgcHJvY2Vzc2VkUmF0aW5nID0gTWF0aC5mbG9vcihyYXRpbmcgKiAyICsgMC41KSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICB2YXIgcmF0aW5nQ2xhc3MgPSAncicgKyBwcm9jZXNzZWRSYXRpbmcudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJy0nKTs7ICU+XG4gICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicmF0aW5nLXN0YXJzLWdyYWQgPCU9IHJhdGluZ0NsYXNzICU+XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInJhdGluZy1zdGFycy1pbWdcIj48L3NwYW4+XG4gICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgPC9wPlxuICAgICA8JSAgfSBlbHNlIHsgJT5cbiAgICAgICAgIDxwIGNsYXNzPVwiYWxpZ24tbGVmdCByYXRpbmcgcGxhY2Vob2xkZXJcIj5ObyByYXRpbmc8L3A+XG4gICAgIDwlICB9XG4gICAgICAgICBpZiAodHlwZW9mIHJldmlld2NvdW50ICE9PSAndW5kZWZpbmVkJyAmJiByZXZpZXdjb3VudCAmJiByZXZpZXdjb3VudCAhPT0gJycpIHsgJT5cbiAgICAgICAgICAgICA8cCBjbGFzcz1cImFsaWduLXJpZ2h0IHJldmlldy1jb3VudFwiPlxuICAgICAgICAgICAgIDwlICB2YXIgc2NhbGVzID0gWycnLCAnaycsICdNJ107XG4gICAgICAgICAgICAgICAgIHZhciBzY2FsZSA9IHNjYWxlcy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBwYXJzZUludChyZXZpZXdjb3VudCk7XG4gICAgICAgICAgICAgICAgIHdoaWxlICh2YWx1ZSA+IDEwMDAgJiYgc2NhbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgIHNjYWxlID0gc2NhbGVzLnNoaWZ0KCk7IC8vIHJlbW92ZSBuZXh0IHNjYWxlXG4gICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlIC8gMTAwMDtcbiAgICAgICAgICAgICAgICAgfSAlPlxuICAgICAgICAgICAgIDwlPSBNYXRoLmZsb29yKHZhbHVlICogMTAwKSAvIDEwMCArIHNjYWxlICU+IHJldmlld3NcbiAgICAgICAgICAgICA8L3A+XG4gICAgIDwlICB9IGVsc2UgeyAlPlxuICAgICAgICAgICAgIDxwIGNsYXNzPVwiYWxpZ24tcmlnaHQgcmV2aWV3LWNvdW50IHBsYWNlaG9sZGVyXCI+Tm8gcmV2aWV3czwvcD5cbiAgICAgPCUgIH0gJT5cbiAgICAgPHAgY2xhc3M9XCJjbGVhci1maXhcIj48L3A+XG4gICAgIDwvZGl2PlxuIDwvc2NyaXB0PlxuIDxzY3JpcHQgaWQ9XCJ2bi1jYXJkLWNzc1wiIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgcCB7IG1hcmdpbjogMnB4IDA7IGRpc3BsYXk6IGJsb2NrOyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyBwLmNsZWFyLWZpeCB7IGNsZWFyOiBib3RoOyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyBwLmFsaWduLWxlZnQgeyBmbG9hdDogbGVmdDsgdGV4dC1hbGlnbjogbGVmdDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgcC5hbGlnbi1yaWdodCB7IGZsb2F0OiByaWdodDsgdGV4dC1hbGlnbjogcmlnaHQ7IH1cbiAgICAgI2NhcmRzIGEuY2FyZCAubW0tdm4tcm93IHAucGxhY2Vob2xkZXIgeyBmb250LXNpemU6IDEwcHg7IGZvbnQtc3R5bGU6IGl0YWxpYzsgY29sb3I6ICNhYWE7IH1cbiAgICAgI2NhcmRzIGEuY2FyZCAubW0tdm4tcm93IC5yYXRpbmcgeyBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IH1cbiAgICAgI2NhcmRzIGEuY2FyZCAubW0tdm4tcm93IC5yYXRpbmctc3RhcnMgeyBtYXJnaW4tdG9wOiAwOyBtYXJnaW4tbGVmdDogMDsgcG9zaXRpb246IHJlbGF0aXZlOyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzLnN0YXJzNjl4MTMgeyB3aWR0aDogNjlweDsgaGVpZ2h0OiAxM3B4OyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzLWdyYWQge1xuICAgICAgICAgYmFja2dyb3VuZDogI2Q3NzgzNTtcbiAgICAgICAgIGJhY2tncm91bmQ6IC1tb3otbGluZWFyLWdyYWRpZW50KHRvcCwjZDc3ODM1IDAsI2YwODcyNyA0MCUsI2Y0YTA2NiAxMDAlKTtcbiAgICAgICAgIGJhY2tncm91bmQ6IC13ZWJraXQtZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLGxlZnQgYm90dG9tLGNvbG9yLXN0b3AoMCUsI2Q3NzgzNSksY29sb3Itc3RvcCg0MCUsI2YwODcyNyksY29sb3Itc3RvcCgxMDAlLCNmNGEwNjYpKTtcbiAgICAgICAgIGJhY2tncm91bmQ6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvcCwjZDc3ODM1IDAsI2YwODcyNyA0MCUsI2Y0YTA2NiAxMDAlKTtcbiAgICAgICAgIGZpbHRlcjogcHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LmdyYWRpZW50KHN0YXJ0Q29sb3JzdHI9JyNkNzc4MzUnLGVuZENvbG9yc3RyPScjZjRhMDY2JyxHcmFkaWVudFR5cGU9MCk7XG4gICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICB0b3A6IDA7XG4gICAgICAgICBsZWZ0OiAwO1xuICAgICAgICAgaGVpZ2h0OiAxM3B4O1xuICAgICB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzLWdyYWQucjUgICB7IHdpZHRoOiA2OXB4OyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzLWdyYWQucjQtNSB7IHdpZHRoOiA2M3B4OyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzLWdyYWQucjQgICB7IHdpZHRoOiA1NXB4OyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzLWdyYWQucjMtNSB7IHdpZHRoOiA0OXB4OyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzLWdyYWQucjMgICB7IHdpZHRoOiA0MXB4OyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzLWdyYWQucjItNSB7IHdpZHRoOiAzNXB4OyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzLWdyYWQucjIgICB7IHdpZHRoOiAyN3B4OyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzLWdyYWQucjEtNSB7IHdpZHRoOiAyMXB4OyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzLWdyYWQucjEgICB7IHdpZHRoOiAxNHB4OyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzLWdyYWQucjAtNSB7IHdpZHRoOiAgN3B4OyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzLWdyYWQucjAgICB7IHdpZHRoOiAgMHB4OyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAuc3RhcnM2OXgxMyAucmF0aW5nLXN0YXJzLWltZyB7XG4gICAgICAgIHdpZHRoOiA2OXB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB1cmwoL3B1YmxpYy9pbWFnZXMvc3RhcnMucG5nKSBuby1yZXBlYXQgY2VudGVyIGNlbnRlcjtcbiAgICAgICAgaGVpZ2h0OiAxM3B4O1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHRvcDogMDtcbiAgICAgICAgbGVmdDogMDtcbiAgICAgfVxuIDwvc2NyaXB0PlxuIDxzY3JpcHQgdHlwZT1cInRleHQvanNcIj5cbiAgICAgdmFyIE1NID0gd2luZG93Lk1NIHx8IHt9O1xuICAgICAoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgIE1NLmxvYWRlciA9IHtcbiAgICAgICAgICAgICByb290VVJMOiAnaHR0cHM6Ly9kZXZlbG9wZXIuZXhwZWN0bGFicy5jb20vcHVibGljL3Nka3MvJ1xuICAgICAgICAgLCAgIHdpZGdldHM6IFsndm9pY2UnXVxuICAgICAgICAgfTtcbiAgICAgICAgIE1NLndpZGdldHMgPSB7XG4gICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgIGFwcElEOiAnWU9VUiBBUFBJRCdcbiAgICAgICAgICAgICAsICAgdm9pY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgIGNhcmRUZW1wbGF0ZTogd2luZG93Wyd2bi1jYXJkLXRlbXBsYXRlJ10uaW5uZXJIVE1MXG4gICAgICAgICAgICAgICAgICwgICBjdXN0b21DU1M6IHdpbmRvd1sndm4tY3VzdG9tLWNzcyddLmlubmVySFRNTFxuICAgICAgICAgICAgICAgICAsICAgbGlzdGVuaW5nTW9kZTogJ2NvbnRpbnVvdXMnIC8vIGV4dGVuZGVkIGxpc3RlbmluZyB3aGVuIG9wZW5lZFxuICAgICAgICAgICAgICAgICAsICAgY2FyZExpbmtCZWhhdmlvcjogJ19ibGFuaycgLy8gbGlua3Mgb3BlbiBpbiBuZXcgdGFic1xuICAgICAgICAgICAgICAgICAsICAgbnVtUmVzdWx0czogMjAgLy8gc2hvdyBtb3JlIGNhcmRzXG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB9XG4gICAgICAgICB9O1xuICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0Jzsgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICAgICAgIHNjcmlwdC5zcmMgPSBNTS5sb2FkZXIucm9vdFVSTCArICdlbWJlZC5qcyc7XG4gICAgICAgICB2YXIgdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICAgICAgIHQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCB0KTtcbiAgICAgfSgpKTtcbiA8L3NjcmlwdD5cblxuICogQG1lbWJlck9mIE1NXG4gKiBAbmFtZXNwYWNlXG4gKi9cbk1NLnZvaWNlTmF2aWdhdG9yID0gTU0udm9pY2VOYXZpZ2F0b3IgfHwge307XG5NTS5sb2FkZXIgPSBNTS5sb2FkZXIgfHwge307XG5NTS5sb2FkZXIucm9vdFVSTCA9IE1NLmxvYWRlci5yb290VVJMIHx8ICdodHRwczovL2RldmVsb3Blci5leHBlY3RsYWJzLmNvbS9wdWJsaWMvc2Rrcy8nO1xuXG4vKipcbiAqIFRoZSAnZGl2I21pbmRtZWxkLW1vZGFsJyBlbGVtZW50IHdoaWNoIGNvbnRhaW5zIGFsbCBvZiB0aGUgdm9pY2UgbmF2aWdhdG9yIGh0bWxcbiAqIEBwcml2YXRlXG4gKi9cbnZhciAkbW0gPSBmYWxzZTtcblxuLyoqXG4gKlxuICogQHByaXZhdGVcbiAqL1xudmFyICRtbV9pZnJhbWUgPSBmYWxzZTtcblxuLyoqXG4gKiBpc0luaXRpYWxpemVkIGlzIHNldCB0byB0cnVlIG9uY2UgdGhlIHdpZGdldCBoYXMgYmVlbiBpbml0aWFsaXplZC4gT25jZVxuICogdGhlIHdpZGdldCBpcyBpbml0aWFsaXplZCBvbkluaXQoKSBpcyBjYWxsZWQuIFRoaXMgaXMgdXNlZCBieVxuICogTU0udm9pY2VOYXZpZ2F0b3Iuc2hvd01vZGFsKCkgdG8gYWxsb3cgdXNlcnMgdG8gY2FsbCBzaG93TW9kYWxcbiAqIHdpdGhvdXQgaGF2aW5nIHRvIGtub3cgaWYgdGhlIHdpZGdldCBpcyBsb2FkZWQgb3Igbm90XG4gKlxuICogQHByaXZhdGVcbiAqL1xudmFyIGlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbnZhciBvbkluaXQgPSBmdW5jdGlvbiAoKSB7fTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAvLyBBZGQgdGhlICNtaW5kbWVsZC1tb2RhbCBkaXYgdG8gdGhlIHBhZ2VcbiAgICB2YXIgbW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBtbS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21pbmRtZWxkLW1vZGFsJyk7XG4gICAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUobW0sIGRvY3VtZW50LmJvZHkuY2hpbGROb2Rlc1swXSk7XG4gICAgJG1tID0gVVRJTC5lbChtbSk7XG5cbiAgICAvLyBJbml0aWFsaXplIGFueSBlbGVtZW50IHdpdGggLm1tLXZvaWNlLW5hdi1pbml0IG9uIGl0XG4gICAgdmFyICRpbml0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21tLXZvaWNlLW5hdi1pbml0Jyk7XG4gICAgdmFyICR0ZXh0SW5pdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtbS12b2ljZS1uYXYtdGV4dC1pbml0Jyk7XG4gICAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIC8vIGxvb2sgZm9yIHRleHQgdmFsdWUgaW4gbW0tdm9pY2UtbmF2LXRleHQtaW5pdCBlbGVtZW50XG4gICAgICAgIGlmICgkdGV4dEluaXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBxdWVyeSA9ICR0ZXh0SW5pdHNbMF0udmFsdWU7XG4gICAgICAgICAgICBNTS52b2ljZU5hdmlnYXRvci5zaG93TW9kYWwoeyBxdWVyeTogcXVlcnkgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBNTS52b2ljZU5hdmlnYXRvci5zaG93TW9kYWwoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgZm9yKHZhciBpID0gMDsgaSA8ICRpbml0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBVVElMLmVsKCRpbml0c1tpXSkuY2xpY2soY2xpY2tIYW5kbGVyKTtcbiAgICB9XG5cbiAgICB2YXIga2V5UHJlc3NIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC53aGljaCA9PT0gMTMpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgIE1NLnZvaWNlTmF2aWdhdG9yLnNob3dNb2RhbCh7IHF1ZXJ5OiBxdWVyeSB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgZm9yKHZhciBqID0gMDsgaiA8ICR0ZXh0SW5pdHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgVVRJTC5lbCgkdGV4dEluaXRzW2pdKS5rZXlwcmVzcyhrZXlQcmVzc0hhbmRsZXIpO1xuICAgIH1cblxuICAgIHNldEluaXRpYWxpemVkKCk7XG5cbiAgICAvLyBXYWl0IGZvciBtZXNzYWdlc1xuICAgIFVUSUwuZWwod2luZG93KS5vbignbWVzc2FnZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5kYXRhLnNvdXJjZSAhPSAnbWluZG1lbGQnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoZXZlbnQuZGF0YS5hY3Rpb24gPT0gJ2Nsb3NlJykge1xuICAgICAgICAgICAgJG1tLnJlbW92ZUNsYXNzKCdvbicpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldEluaXRpYWxpemVkKCkge1xuICAgIGlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIG9uSW5pdCgpO1xufVxuXG5mdW5jdGlvbiBwb3N0TWVzc2FnZShhY3Rpb24sIGRhdGEpIHtcbiAgICB2YXIgd2luID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtaW5kbWVsZC1pZnJhbWVcIikuY29udGVudFdpbmRvdztcbiAgICB3aW4ucG9zdE1lc3NhZ2Uoe1xuICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgc291cmNlOiAnbWluZG1lbGQnLFxuICAgICAgICBkYXRhOiBkYXRhXG4gICAgfSwgXCIqXCIpO1xufVxuXG4vKipcbiAqIE9wZW5zIHRoZSB2b2ljZSBuYXZpZ2F0b3IgbW9kYWwgd2luZG93XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucXVlcnldICAgICAgICAgICAgICAgICBpZiBwcm92aWRlZCwgdGhpcyBmaWVsZCB3aWxsIGJlIHRoZSBpbml0aWFsIHF1ZXJ5LCBhbmQgd2lsbCBpbW1lZGlhdGVseSBzaG93IHJlc3VsdHNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuZm9yY2VOZXdJRnJhbWU9ZmFsc2VdIGlmIHRydWUsIGFueSB2b2ljZSBuYXZpZ2F0b3JzIHRoYXQgaGF2ZSBwcmV2aW91c2x5IGJlZW4gY3JlYXRlZCB3aWxsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZSBkZXN0cm95ZWQsIGFuZCBhIG5ldyBpbnN0YW5jZSB3aWxsIGJlIGNyZWF0ZWQuXG4gKi9cbk1NLnZvaWNlTmF2aWdhdG9yLnNob3dNb2RhbCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAoaXNJbml0aWFsaXplZCkge1xuICAgICAgICB2YXIgaWZyYW1lO1xuICAgICAgICAvLyBJbml0aWFsaXplIHZvaWNlIG5hdmlnYXRvciBjb25maWdcbiAgICAgICAgaWYgKHR5cGVvZiBNTSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgTU0ud2lkZ2V0cyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgTU0ud2lkZ2V0cy5jb25maWcgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgLy8gTW92ZSBjb25maWcgdG8gdm9pY2UgbmF2IGNvbmZpZ1xuICAgICAgICAgICAgICAgIE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZyA9IE1NLndpZGdldHMuY29uZmlnLnZvaWNlIHx8IHt9O1xuICAgICAgICAgICAgICAgIE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZy5hcHBJRCA9IE1NLndpZGdldHMuY29uZmlnLmFwcElEO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTU0ud2lkZ2V0cy5jb25maWcuY2xlYW5VcmwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZy5jbGVhblVybCA9IE1NLndpZGdldHMuY29uZmlnLmNsZWFuVXJsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE1NLndpZGdldHMuY29uZmlnLmZheWVDbGllbnRVcmwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZy5mYXllQ2xpZW50VXJsID0gTU0ud2lkZ2V0cy5jb25maWcuZmF5ZUNsaWVudFVybDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAvLyBwYXJzZSBjYXJkIGxheW91dFxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnLmNhcmRUZW1wbGF0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnLmNhcmRMYXlvdXQgPSAnY3VzdG9tJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNTS52b2ljZU5hdmlnYXRvci5jb25maWcuY2FyZExheW91dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnLmNhcmRMYXlvdXQgPSAnZGVmYXVsdCc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gbWFrZSBhYnNvbHV0ZSBVUkxzXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNTS52b2ljZU5hdmlnYXRvci5jb25maWcuY3VzdG9tQ1NTVVJMICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBNTS52b2ljZU5hdmlnYXRvci5jb25maWcuY3VzdG9tQ1NTVVJMID0gVVRJTC5jb252ZXJ0VG9BYnNvbHV0ZVBhdGgoTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnLmN1c3RvbUNTU1VSTCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCBsaXN0ZW5pbmcgbW9kZVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5saXN0ZW5pbmdNb2RlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBNTS52b2ljZU5hdmlnYXRvci5jb25maWcubGlzdGVuaW5nTW9kZSA9IG9wdGlvbnMubGlzdGVuaW5nTW9kZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBNTS52b2ljZU5hdmlnYXRvci5jb25maWcubGlzdGVuaW5nTW9kZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnLmxpc3RlbmluZ01vZGUgPSAnbm9ybWFsJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBQYXNzIHRva2VuLCB1c2VyIElELCBhbmQgc2Vzc2lvbiBJRCBpZiB0aGV5IGFyZSBzZXQgYWxyZWFkeVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTU0udG9rZW4gIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBNTS5hY3RpdmVVc2VySWQgIT09ICd1bmRlZmluZWQnICYmIE1NLmFjdGl2ZVVzZXJJZCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgTU0uYWN0aXZlU2Vzc2lvbklkICE9PSAndW5kZWZpbmVkJyAmJiBNTS5hY3RpdmVTZXNzaW9uSWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnLm1tQ3JlZGVudGlhbHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogTU0udG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySUQ6IE1NLmFjdGl2ZVVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25JRDogTU0uYWN0aXZlU2Vzc2lvbklkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIElmIGRlZmluZWQsIHBhc3MgYSBzdGFydGluZyBxdWVyeVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnF1ZXJ5ICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy5xdWVyeSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnLnN0YXJ0UXVlcnkgPSBvcHRpb25zLnF1ZXJ5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnLnN0YXJ0UXVlcnkgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLmZvcmNlTmV3SUZyYW1lICYmICRtbV9pZnJhbWUpIHtcbiAgICAgICAgICAgIGlmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtaW5kbWVsZC1pZnJhbWUnKTtcbiAgICAgICAgICAgIGlmcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgaWZyYW1lIGlmIGZpcnN0IGxvYWRcbiAgICAgICAgaWYgKCEkbW1faWZyYW1lIHx8IG9wdGlvbnMuZm9yY2VOZXdJRnJhbWUpIHtcbiAgICAgICAgICAgIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnZnJhbWVCb3JkZXInLCAnMCcpO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnaWQnLCAnbWluZG1lbGQtaWZyYW1lJyk7XG4gICAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdhbGxvd3RyYW5zcGFyZW5jeScsICd0cnVlJyk7XG4gICAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzcmMnLCBNTS5sb2FkZXIucm9vdFVSTCArICd3aWRnZXRzL3ZvaWNlTmF2aWdhdG9yL21vZGFsL21vZGFsLmh0bWwnKTtcblxuICAgICAgICAgICAgJG1tX2lmcmFtZSA9IFVUSUwuZWwoaWZyYW1lKTtcblxuICAgICAgICAgICAgVVRJTC5lbChpZnJhbWUpLm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2UoJ2NvbmZpZycsIE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2UoJ29wZW4nKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkbW0uZWwoKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcG9zdE1lc3NhZ2UoJ29wZW4nLCBNTS52b2ljZU5hdmlnYXRvci5jb25maWcpO1xuICAgICAgICB9XG4gICAgICAgICRtbS5hZGRDbGFzcygnb24nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFNldCBvbkluaXQoKSBjYWxsYmFjayB0byBvcGVuIG1vZGFsXG4gICAgICAgIG9uSW5pdCA9IGZ1bmN0aW9uICgpIHsgTU0udm9pY2VOYXZpZ2F0b3Iuc2hvd01vZGFsKG9wdGlvbnMpOyB9O1xuICAgIH1cbn1cblxuLyoqXG4gKiBDbG9zZXMgdGhlIHZvaWNlIG5hdmlnYXRvciBtb2RhbCB3aW5kb3dcbiAqL1xuTU0udm9pY2VOYXZpZ2F0b3IuaGlkZU1vZGFsID0gZnVuY3Rpb24gKCkge1xuICAgIHBvc3RNZXNzYWdlKCdjbG9zZScpO1xufTtcblxuLy8gc2NoZWR1bGUgaW5pdGlhbGl6YXRpb24gb2Ygdm9pY2UgbmF2aWdhdG9yXG5VVElMLmNvbnRlbnRMb2FkZWQod2luZG93LCBmdW5jdGlvbigpIHtcbiAgICBpbml0KCk7XG59KTtcbiJdfQ==
