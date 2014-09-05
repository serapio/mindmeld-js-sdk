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
        + addLeadingZeros(date.getDate(), 2) + ' '
        + addLeadingZeros(date.getHours(), 2) + ':'
        + addLeadingZeros(date.getMinutes(), 2) + ':'
        + addLeadingZeros(date.getSeconds(), 2) + '.'
        + addLeadingZeros(date.getMilliseconds(), 3)
        + date.toTimeString().substring(8);
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
             rootURL: 'https://developer.expectlabs.com/public/sdks/js/'
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
             rootURL: 'https://developer.expectlabs.com/public/sdks/js/'
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
MM.loader.rootURL = MM.loader.rootURL || 'https://developer.expectlabs.com/public/sdks/js/';

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
var modalLoaded = false;
var onInitCallbacks = [];
var onModalLoadedCallbacks = [];

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
    onInitCallbacks.forEach(
        function runCallback (callback) {
            callback();
        }
    );
}

function callOnModalLoaded (callback) {
    if (! modalLoaded) {
        onModalLoadedCallbacks.push(callback);
    } else {
        callback();
    }
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
                modalLoaded = true;
                postMessage('config', MM.voiceNavigator.config);
                postMessage('open');
                onModalLoadedCallbacks.forEach(
                    function runCallback (callback) {
                        callback();
                    }
                );
            });

            $mm.el().appendChild(iframe);
        }
        else {
            postMessage('open', MM.voiceNavigator.config);
        }
        $mm.addClass('on');
    }
    else {
        // Open modal on init
        onInitCallbacks.push(
            function showModalOnInit () {
                MM.voiceNavigator.showModal(options);
            }
        );
    }
};

/**
 * Closes the voice navigator modal window
 */
MM.voiceNavigator.hideModal = function () {
    postMessage('close');
};


/**
 * Sets the voice navigator's user's location
 *
 * @param {number} latitude new latitude for user location
 * @param {number} longitude new longitude for user location
 */
MM.voiceNavigator.setUserLocation = function (latitude, longitude) {
    if (isInitialized) {
        callOnModalLoaded(
            function setLocationOnModalLoaded () {
                var location = {
                    latitude: latitude,
                    longitude: longitude
                };
                postMessage('setLocation', location);
            }
        );
    } else {
        onInitCallbacks.push(
            function setLocationOnInit () {
                MM.voiceNavigator.setUserLocation(latitude, longitude);
            }
        );
    }
};

// schedule initialization of voice navigator
UTIL.contentLoaded(window, function() {
    init();
});

},{"./util":1}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3N1dmRhL3NhbmRib3gvc3V2ZGEvZWNvbW1lcmNlRGVtby9saWJzL21pbmRtZWxkLWpzLXNkay9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvc3V2ZGEvc2FuZGJveC9zdXZkYS9lY29tbWVyY2VEZW1vL2xpYnMvbWluZG1lbGQtanMtc2RrL3NyYy93aWRnZXRzL3ZvaWNlTmF2aWdhdG9yL2pzL3V0aWwuanMiLCIvaG9tZS9zdXZkYS9zYW5kYm94L3N1dmRhL2Vjb21tZXJjZURlbW8vbGlicy9taW5kbWVsZC1qcy1zZGsvc3JjL3dpZGdldHMvdm9pY2VOYXZpZ2F0b3IvanMvdmVuZG9yL2NvbnRlbnRsb2FkZWQuanMiLCIvaG9tZS9zdXZkYS9zYW5kYm94L3N1dmRhL2Vjb21tZXJjZURlbW8vbGlicy9taW5kbWVsZC1qcy1zZGsvc3JjL3dpZGdldHMvdm9pY2VOYXZpZ2F0b3IvanMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vdmVuZG9yL2NvbnRlbnRsb2FkZWQnKTtcblxuLyogQSB3cmFwcGVyIGZvciBkb20gZWxlbWVudHMsIGJhc2ljYWxseSBhIGxpdGUgdmVyc2lvbiBvZiBqUXVlcnkncyAkICovXG5leHBvcnRzLmVsID0gZnVuY3Rpb24oZWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBvbjogZnVuY3Rpb24oZXZlbnQsIGZ1bmMpIHtcbiAgICAgICAgICAgIGlmKGVsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LGZ1bmMsZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKGVsLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZWwuYXR0YWNoRXZlbnQoXCJvblwiK2V2ZW50LGZ1bmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNsaWNrOiBmdW5jdGlvbihmdW5jKSB7XG4gICAgICAgICAgICB0aGlzLm9uKCdjbGljaycsIGZ1bmMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGtleXByZXNzOiBmdW5jdGlvbiAoZnVuYykge1xuICAgICAgICAgICAgdGhpcy5vbigna2V5cHJlc3MnLCBmdW5jKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmVDbGFzczogZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShcbiAgICAgICAgICAgICAgICBuZXcgUmVnRXhwKCcoXnxcXFxccyspJyArIGNsYXNzTmFtZSArICcoXFxcXHMrfCQpJywgJ2cnKSxcbiAgICAgICAgICAgICAgICAnJDEnXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZENsYXNzOiBmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICAgICAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZSArIFwiIFwiICsgY2xhc3NOYW1lO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgfSxcblxuICAgICAgICBlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxuZXhwb3J0cy5jb252ZXJ0VG9BYnNvbHV0ZVBhdGggPSBmdW5jdGlvbihocmVmKSB7XG4gICAgdmFyIGFuY2hvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhbmNob3IuaHJlZiA9IGhyZWY7XG4gICAgcmV0dXJuIChhbmNob3IucHJvdG9jb2wgKyAnLy8nICsgYW5jaG9yLmhvc3QgKyBhbmNob3IucGF0aG5hbWUgKyBhbmNob3Iuc2VhcmNoICsgYW5jaG9yLmhhc2gpO1xufTtcblxuZnVuY3Rpb24gYWRkTGVhZGluZ1plcm9zKG51bWJlciwgZGlnaXRzKSB7XG4gICAgdmFyIGJhc2UgPSBNYXRoLnBvdygxMCwgZGlnaXRzKTtcbiAgICBudW1iZXIgKz0gYmFzZTtcbiAgICBudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gbnVtYmVyLnN1YnN0cmluZyhudW1iZXIubGVuZ3RoIC0gZGlnaXRzKTtcbn1cblxuZXhwb3J0cy50aW1lc3RhbXAgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgIGRhdGUgPSBkYXRlIHx8IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhkYXRlLmdldEZ1bGxZZWFyKCksIDQpICsgJy4nXG4gICAgICAgICsgYWRkTGVhZGluZ1plcm9zKGRhdGUuZ2V0TW9udGgoKSArIDEsIDIpICsgJy4nXG4gICAgICAgICsgYWRkTGVhZGluZ1plcm9zKGRhdGUuZ2V0RGF0ZSgpLCAyKSArICcgJ1xuICAgICAgICArIGFkZExlYWRpbmdaZXJvcyhkYXRlLmdldEhvdXJzKCksIDIpICsgJzonXG4gICAgICAgICsgYWRkTGVhZGluZ1plcm9zKGRhdGUuZ2V0TWludXRlcygpLCAyKSArICc6J1xuICAgICAgICArIGFkZExlYWRpbmdaZXJvcyhkYXRlLmdldFNlY29uZHMoKSwgMikgKyAnLidcbiAgICAgICAgKyBhZGRMZWFkaW5nWmVyb3MoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSwgMylcbiAgICAgICAgKyBkYXRlLnRvVGltZVN0cmluZygpLnN1YnN0cmluZyg4KTtcbn07XG5cbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgIGFyZ3Muc3BsaWNlKDAsIDAsIGV4cG9ydHMudGltZXN0YW1wKCkpO1xuICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3MpO1xufTtcblxuZXhwb3J0cy5jb250ZW50TG9hZGVkID0gY29udGVudExvYWRlZDsiLCIvKiFcbiAqIGNvbnRlbnRsb2FkZWQuanNcbiAqXG4gKiBBdXRob3I6IERpZWdvIFBlcmluaSAoZGllZ28ucGVyaW5pIGF0IGdtYWlsLmNvbSlcbiAqIFN1bW1hcnk6IGNyb3NzLWJyb3dzZXIgd3JhcHBlciBmb3IgRE9NQ29udGVudExvYWRlZFxuICogVXBkYXRlZDogMjAxMDEwMjBcbiAqIExpY2Vuc2U6IE1JVFxuICogVmVyc2lvbjogMS4yXG4gKlxuICogVVJMOlxuICogaHR0cDovL2phdmFzY3JpcHQubndib3guY29tL0NvbnRlbnRMb2FkZWQvXG4gKiBodHRwOi8vamF2YXNjcmlwdC5ud2JveC5jb20vQ29udGVudExvYWRlZC9NSVQtTElDRU5TRVxuICpcbiAqL1xuXG4vLyBAd2luIHdpbmRvdyByZWZlcmVuY2Vcbi8vIEBmbiBmdW5jdGlvbiByZWZlcmVuY2VcbndpbmRvdy5jb250ZW50TG9hZGVkID0gZnVuY3Rpb24gY29udGVudExvYWRlZCh3aW4sIGZuKSB7XG5cblx0dmFyIGRvbmUgPSBmYWxzZSwgdG9wID0gdHJ1ZSxcblxuXHRkb2MgPSB3aW4uZG9jdW1lbnQsIHJvb3QgPSBkb2MuZG9jdW1lbnRFbGVtZW50LFxuXG5cdGFkZCA9IGRvYy5hZGRFdmVudExpc3RlbmVyID8gJ2FkZEV2ZW50TGlzdGVuZXInIDogJ2F0dGFjaEV2ZW50Jyxcblx0cmVtID0gZG9jLmFkZEV2ZW50TGlzdGVuZXIgPyAncmVtb3ZlRXZlbnRMaXN0ZW5lcicgOiAnZGV0YWNoRXZlbnQnLFxuXHRwcmUgPSBkb2MuYWRkRXZlbnRMaXN0ZW5lciA/ICcnIDogJ29uJyxcblxuXHRpbml0ID0gZnVuY3Rpb24oZSkge1xuXHRcdGlmIChlLnR5cGUgPT0gJ3JlYWR5c3RhdGVjaGFuZ2UnICYmIGRvYy5yZWFkeVN0YXRlICE9ICdjb21wbGV0ZScpIHJldHVybjtcblx0XHQoZS50eXBlID09ICdsb2FkJyA/IHdpbiA6IGRvYylbcmVtXShwcmUgKyBlLnR5cGUsIGluaXQsIGZhbHNlKTtcblx0XHRpZiAoIWRvbmUgJiYgKGRvbmUgPSB0cnVlKSkgZm4uY2FsbCh3aW4sIGUudHlwZSB8fCBlKTtcblx0fSxcblxuXHRwb2xsID0gZnVuY3Rpb24oKSB7XG5cdFx0dHJ5IHsgcm9vdC5kb1Njcm9sbCgnbGVmdCcpOyB9IGNhdGNoKGUpIHsgc2V0VGltZW91dChwb2xsLCA1MCk7IHJldHVybjsgfVxuXHRcdGluaXQoJ3BvbGwnKTtcblx0fTtcblxuXHRpZiAoZG9jLnJlYWR5U3RhdGUgPT0gJ2NvbXBsZXRlJykgZm4uY2FsbCh3aW4sICdsYXp5Jyk7XG5cdGVsc2Uge1xuXHRcdGlmIChkb2MuY3JlYXRlRXZlbnRPYmplY3QgJiYgcm9vdC5kb1Njcm9sbCkge1xuXHRcdFx0dHJ5IHsgdG9wID0gIXdpbi5mcmFtZUVsZW1lbnQ7IH0gY2F0Y2goZSkgeyB9XG5cdFx0XHRpZiAodG9wKSBwb2xsKCk7XG5cdFx0fVxuXHRcdGRvY1thZGRdKHByZSArICdET01Db250ZW50TG9hZGVkJywgaW5pdCwgZmFsc2UpO1xuXHRcdGRvY1thZGRdKHByZSArICdyZWFkeXN0YXRlY2hhbmdlJywgaW5pdCwgZmFsc2UpO1xuXHRcdHdpblthZGRdKHByZSArICdsb2FkJywgaW5pdCwgZmFsc2UpO1xuXHR9XG5cbn1cbiIsInZhciBVVElMID0gIHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIE1NID0gd2luZG93Lk1NID0gd2luZG93Lk1NIHx8IHt9O1xuXG5cbi8qKlxuICogQW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29uZmlndXJhdGlvbiBvZiB7QGxpbmsgTU0udm9pY2VOYXZpZ2F0b3J9XG4gKlxuICogQHR5cGVkZWYge09iamVjdH0gVm9pY2VOYXZpZ2F0b3JDb25maWdcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbY2FyZExpbmtCZWhhdmlvcj1cIl9wYXJlbnRcIl0gc2V0cyB0aGUgYmVoYXZpb3IgZm9yIGFuY2hvcnMgd3JhcHBpbmcgY2FyZHMuIFVzZSAnZmFsc2UnIHRvXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2ZW50IG9wZW5pbmcgbGlua3MsICdfcGFyZW50JyB0byBvcGVuIGxpbmtzIGluIHRoZSBzYW1lIHRhYiBvciB3aW5kb3csXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvciAnX2JsYW5rJyB0byBvcGVuIGxpbmtzIGluIGEgbmV3IHRhYiBvciB3aW5kb3cuIFNlZSB0aGUgdGFyZ2V0IGF0dHJpYnV0ZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2YgW2FuY2hvcl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRNTC9FbGVtZW50L2EpXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50cyBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbbGlzdGVuaW5nTW9kZT1cIm5vcm1hbFwiXSAgICAgZGVmaW5lcyB0aGUgbGlzdGVuaW5nIG1vZGUgb2YgdGhlIHZvaWNlIG5hdmlnYXRvciB3aGVuIGl0IGlzIG9wZW5lZC4gQWNjZXB0YWJsZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzIGluY2x1ZGUgJ25vcm1hbCcsICdjb250aW51b3VzJywgYW5kIGZhbHNlLiBGYWxzZSBwcmV2ZW50cyBsaXN0ZW5pbmdcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCB0aGUgZGVmYXVsdCBpcyAnbm9ybWFsJy5cbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBbbnVtUmVzdWx0c10gICAgICAgICAgICAgICAgIGlmIHNwZWNpZmllZCwgdGhpcyBudW1iZXIgb2YgY2FyZHMgd2lsbCBhcHBlYXIgYXMgcmVzdWx0c1xuICogQHByb3BlcnR5IHtDYXJkRmllbGRbXX0gW2NhcmRGaWVsZHNdICAgICAgICAgICAgYW4gYXJyYXkgb2YgY2FyZCBmaWVsZHMgd2hpY2ggd2lsbCBiZSBhcHBlbmRlZCB0byB0aGUgY2FyZC4gV2l0aCBjYXJkIGZpZWxkcyxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlvdSBjYW4gcmVuZGVyIGRvY3VtZW50IGZpZWxkcyB0aGF0IGFyZSBzcGVjaWZpYyB0byB5b3VyIGFwcGxpY2F0aW9uLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VlIHtAbGluayBDYXJkRmllbGR9IGZvciBtb3JlIGluZm9ybWF0aW9uXG4gKiBAcHJvcGVydHkge1N0cmluZ30gW2NhcmRUZW1wbGF0ZV0gICAgICAgICAgICAgICBhbiBbdW5kZXJzY29yZV0oaHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvI3RlbXBsYXRlKSAob3IgbG9kYXNoKSBodG1sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSB3aGljaCBpcyB1c2VkIHRvIGNyZWF0ZSBhIGNhcmQgcmVwcmVzZW50YXRpb24gb2YgYSBkb2N1bWVudFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LiBUaGUgcmVzdWx0aW5nIGh0bWwsIGlzIHdyYXBwZWQgaW4gYW4gYW5jaG9yIGVsZW1lbnQgd2hpY2ggbGlua3NcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIHRoZSBkb2N1bWVudCdzIHVybC4gVGhlIHRlbXBsYXRlIGlzIHN1cHBsaWVkIHdpdGggdGhlIGRvY3VtZW50IG9iamVjdFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuZWQgYnkgdGhlIEFQSS4gQSBjYXJkIHRlbXBsYXRlIGNhbiBiZSB1c2VkIHRvIHJlbmRlciBhbnkgZG9jdW1lbnRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkcyB0aGF0IGFyZSBzcGVjaWZpYyB0byB5b3VyIGFwcGxpY2F0aW9uIHdpdGggY3VzdG9tIGxvZ2ljLlxuICogQHByb3BlcnR5IHtib29sZWFufSBbcmVzZXRDYXJkc0NTU10gICAgICAgICAgICAgaWYgdHJ1ZSwgcmVtb3ZlcyBDU1Mgc3BlY2lmaWMgdG8gdGhlIGNhcmRzIGNvbnRhaW5lci4gVGhpcyBjYW4gYmUgaGVscGZ1bFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgdGhlIGRlZmF1bHQgY2FyZHMgQ1NTIGlzIGNvbmZsaWN0aW5nIHdpdGggeW91ciBvd24gY3VzdG9tQ1NTXG4gKiBAcHJvcGVydHkge1N0cmluZ30gW2N1c3RvbUNTU10gICAgICAgICAgICAgICAgICBzcGVjaWZpZXMgY3VzdG9tIENTUyB0byBiZSBhcHBsaWVkIHRvIHRoZSB2b2ljZSBuYXZpZ2F0b3IuIFlvdSBjYW4gdXNlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0b20gQ1NTIHRvIGNoYW5nZSB0aGUgYXBwZWFyYW5jZSBvZiB0aGUgdm9pY2UgbmF2aWdhdG9yIHdpZGdldCBhbmRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0J3MgZG9jdW1lbnQgY2FyZHMsIHRvIGJldHRlciBzdWl0IHlvdXIgYnJhbmRpbmcuIFdoZW4gdXNpbmcgdGhpcyBwYXJhbWV0ZXIsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgc3R5bGluZyB3aWxsIGJlIGluY2x1ZGVkIGFzIGVtYmVkZGVkIENTUywgd2hpY2ggdGFrZXMgcHJlY2VkZW5jZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlciBleHRlcm5hbCBDU1MuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gW2N1c3RvbUNTU1VSTF0gICAgICAgICAgICAgICBzcGVjaWZpZXMgdGhlIHVybCBvZiBhIGZpbGUgY29udGFpbmluZyBjdXN0b20gQ1NTIHRvIGJlIGFwcGxpZWQgdG8gdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2b2ljZSBuYXZpZ2F0b3IuIFRoaXMgcGFyYW1ldGVyIHdvcmtzIHRoZSBzYW1lIGFzIGN1c3RvbUNTUywgZXhjZXB0IHRoYXRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBzdHlsaW5nIHdpbGwgYmUgYXBwbGllZCBhcyBleHRlcm5hbCBDU1MsIGJ5IGxpbmtpbmcgdG8gdGhlIHVybCBwcm92aWRlZC5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoaXMgY2FuIGJlIGhlbHBmdWwgaWYgeW91IHdvdWxkIGxpa2UgdG8gcmVmZXIgdG8gaW1hZ2VzIHdpdGggcmVsYXRpdmUgcGF0aHMuXG4gKiBAcHJvcGVydHkge051bWJlcn0gW2Jhc2VaSW5kZXg9MTAwMDAwXSAgICAgICAgICB0aGUgdm9pY2UgbmF2aWdhdG9yIGVsZW1lbnRzIHdpbGwgaGF2ZSBhIFogaW5kZXggYmV0d2VlbiB0aGUgdmFsdWVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdpdmVuIGFuZCAxMDAwIGdyZWF0ZXIgdGhhbiB0aGUgdmFsdWUuIElmIHRoZSB2b2ljZSBuYXZpZ2F0b3IgaXMgaGlkZGVuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlcm5lYXRoIGVsZW1lbnRzIG9uIGEgcGFnZSwgdHJ5IHNldHRpbmcgaXQgdG8gc29tZXRoaW5nIGhpZ2hlci5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0LjxzdHJpbmcsIG51bWJlcj59IFtoaWdobGlnaHRdIHRoZSBoaWdobGlnaHQgcGFyYW1ldGVyIGZvciB7QGxpbmsgVm9pY2VOYXZpZ2F0b3JDb25maWd9IHNwZWNpZmllcyB0aGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50IGZpZWxkcyB0byByZXR1cm4gc25pcHBldHMgc2hvd2luZyBtYXRjaGluZyByZXN1bHRzLiBUaGUgZmllbGRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzIHRoZSBzYW1lIGFzIHRoZSBmaWVsZCB1c2VkIGluIHRoZSBBUEkgdG8gc2hvdyBoaWdobGlnaHRlZCB0ZXh0IGluIHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQVBJIGFzIGRvY3VtZW50ZWQgW2hlcmVdKGh0dHBzOi8vZGV2ZWxvcGVyLmV4cGVjdGxhYnMuY29tL2RvY3MvZW5kcG9pbnRTZXNzaW9uI2dldFNlc3Npb25TZXNzaW9uaWREb2N1bWVudHMpLlxuICpcbiAqL1xuXG4vKipcbiAqIEFuIE9iamVjdCByZXByZXNlbnRpbmcgYSBmaWVsZCB0byBkaXNwbGF5IGluIGEgZG9jdW1lbnQgY2FyZCBmb3IgdGhlIFZvaWNlIE5hdmlnYXRvciB3aWRnZXQuIFlvdSBjYW4gdXNlIGNhcmQgZmllbGRzIHRvXG4gKiBxdWlja2x5IGluY2x1ZGUgbW9yZSBpbmZvcm1hdGlvbiBvbiB5b3VyIGNhcmRzLlxuICpcbiAqIEB0eXBlZGVmIHtPYmplY3R9IENhcmRGaWVsZFxuICogQHByb3BlcnR5IHtTdHJpbmd9IGtleSAgICAgICAgICAgdGhlIGtleSBjb250YWluaW5nIHRoZSB2YWx1ZSBvZiB0aGlzIGZpZWxkIGluIGRvY3VtZW50IG9iamVjdHMuIFRoaXMgZmllbGQgbXVzdCBiZSBzcGVjaWZpZWQuXG4gKiBAcHJvcGVydHkge1N0cmluZ30gW3BsYWNlaG9sZGVyXSBpZiBzcGVjaWZpZWQsIHdoZW4gdGhlIGtleSBpcyBub3QgcHJlc2VudCBpbiBhIGRvY3VtZW50IG9yIGlzIGVtcHR5LCB0aGlzIHZhbHVlIHdpbGwgYmUgZGlzcGxheWVkLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgb21pdHRlZCB0aGUgdmFsdWUgd2lsbCBiZSBoaWRkZW4gZnJvbSB0aGUgY2FyZFxuICogQHByb3BlcnR5IHtTdHJpbmd9IFtsYWJlbF0gICAgICAgaWYgc3BlY2lmaWVkLCBhIGxhYmVsIHdpdGggdGhlIHByb3ZpZGVkIHRleHQgd2lsbCBwcmVjZWRlIHRoZSB2YWx1ZVxuICogQHByb3BlcnR5IHtTdHJpbmd9IFtmb3JtYXRdICAgICAgZm9yIGZvcm1hdHRlciB0byBiZSB1c2VkIHRvIHByZXNlbnQgdGhlIHZhbHVlIGluIGEgdXNlciBmcmllbmRseSBmb3JtLiBWYWxpZCBmb3JtYXR0ZXJzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmUgZGVmYXVsdCwgYW5kIGRhdGUuIFRoZSBkYXRlIGZvcm1hdCBjb252ZXJ0cyB1bml4IHRpbWVzdGFtcHMgaW50byB0aGUgJ01NL2RkL1lZWVknXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQuXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+IEJhc2ljIGV4YW1wbGUgPC9jYXB0aW9uPlxuICpcbiAvLyBXaGVuIGF1dGhvciBpcyBKb2huIERvZSAtPiAnV3JpdHRlbiBCeTogSm9obiBEb2UnXG4gLy8gV2hlbiBhdXRob3IgaXMgb21pdHRlZCB0aGUgZmllbGQgaXMgbm90IGRpc3BsYXllZFxuIC8vXG4gdmFyIGF1dGhvckZpZWxkID0ge1xuICAga2V5OiAnYXV0aG9yJyxcbiAgIGxhYmVsOiAnV3JpdHRlbiBCeTonLFxuIH07XG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+IFVzaW5nIHRoZSBkYXRlIGZvcm1hdCA8L2NhcHRpb24+XG4gKlxuIC8vIFdoZW4gcHViZGF0ZSBpcyBPY3QuIDEwLCAxOTk2IC0+ICdSZWxlYXNlZCAxMC8xMy8xOTk2J1xuIC8vIFdoZW4gcHViZGF0ZSBpcyBvbWl0dGVkIC0+ICdSZWxlYXNlZCBVbmtub3duJ1xuIC8vXG4gdmFyIGRhdGVGaWVsZCA9IHtcbiAgIGtleTogJ3B1YmRhdGUnLFxuICAgcGxhY2Vob2xkZXI6ICdVbmtub3duJyxcbiAgIGxhYmVsOiAnUmVsZWFzZWQnLFxuICAgZm9ybWF0OiAnZGF0ZSdcbiB9O1xuICpcbiAqL1xuXG4vKipcbiAqIFRoZSB2b2ljZSBuYXZpZ2F0b3IgaXMgYSB3aWRnZXQgdGhhdCBhbGxvd3MgZGV2ZWxvcGVycyB0byBhZGQgdm9pY2UtZHJpdmVuIHNlYXJjaCB0byB0aGVpciB3ZWIgYXBwbGljYXRpb25zLlxuICogQnkgYWRkaW5nIGEgc21hbGwgc25pcHBldCBvZiBKYXZhU2NyaXB0IHRvIHlvdXIgcGFnZSwgeW91IGNhbiBhZGQgb3VyIHZvaWNlIG5hdmlnYXRvciB0byB5b3VyIHBhZ2UgYWxsb3dpbmcgeW91clxuICogdXNlcnMgdG8gc2VhcmNoIGFuZCBkaXNjb3ZlciB5b3VyIGNvbnRlbnQgaW4gbmF0dXJhbCwgc3Bva2VuIGxhbmd1YWdlLiBUaGUgdm9pY2UgbmF2aWdhdG9yIHdpZGdldCB0YWtlcyBjYXJlIG9mXG4gKiBjYXB0dXJpbmcgc3BlZWNoIGlucHV0IGZyb20geW91ciB1c2VycywgZGlzcGxheWluZyBhIHJlYWwtdGltZSB0cmFuc2NyaXB0IG9mIHdoYXQgaXMgYmVpbmcgcmVjb3JkZWQsIGFuZCBkaXNwbGF5aW5nXG4gKiBhIGNvbGxlY3Rpb24gb2YgcmVzdWx0cyBpbiB0aGUgYnJvd3Nlci5cbiAqXG4gKiBUaGUgdm9pY2UgbmF2aWdhdG9yIHdpbGwgZGlzcGxheSB3aGVuIGVsZW1lbnRzIHdpdGggdGhlICdtbS12b2ljZS1uYXYtaW5pdCcgY2xhc3MgYXJlIGNsaWNrZWQgYW5kIHdoZW4gZWxlbWVudHMgd2l0aFxuICogdGhlICdtbS12b2ljZS1uYXYtdGV4dC1pbml0JyByZWNlaXZlIGFuIGVudGVyIGtleXByZXNzLlxuICpcbiAqIEBzZWUge0BsaW5rIFZvaWNlTmF2aWdhdG9yQ29uZmlnfSBmb3IgZnVsbCBkb2N1bWVudGF0aW9uIG9mIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLmV4cGVjdGxhYnMuY29tL2RvY3Mvdm9pY2VXaWRnZXR8TWluZE1lbGQgVm9pY2UgTmF2aWdhdG9yfSB0byBnZXQgc3RhcnRlZCB3aXRoIFZvaWNlIE5hdmlnYXRvci5cbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLmV4cGVjdGxhYnMuY29tL2RlbW9zfE1pbmRNZWxkIERlbW9zfSB0byBzZWUgdGhlIFZvaWNlIE5hdmlnYXRvciBpbiBhY3Rpb24uXG4gKlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPiBMb2FkaW5nIHRoZSB2b2ljZSBuYXZpZ2F0b3IgPC9jYXB0aW9uPlxuICpcbiA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2pzXCI+XG4gdmFyIE1NID0gd2luZG93Lk1NIHx8IHt9O1xuICAgICAoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgIE1NLmxvYWRlciA9IHtcbiAgICAgICAgICAgICByb290VVJMOiAnaHR0cHM6Ly9kZXZlbG9wZXIuZXhwZWN0bGFicy5jb20vcHVibGljL3Nka3MvanMvJ1xuICAgICAgICAgLCAgIHdpZGdldHM6IFsndm9pY2UnXVxuICAgICAgICAgfTtcbiAgICAgICAgIE1NLndpZGdldHMgPSB7XG4gICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAgIGFwcElEOiAnWU9VUiBBUFBJRCdcbiAgICAgICAgICAgICAsICAgdm9pY2U6IHZvaWNlTmF2aWdhdG9yQ29uZmlnICAvLyB0aGlzIG9iamVjdCBjb250YWlucyB5b3VyIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgICAgICAgICAgIH1cbiAgICAgICAgIH07XG4gICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnOyBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgICAgICAgc2NyaXB0LnNyYyA9IE1NLmxvYWRlci5yb290VVJMICsgJ2VtYmVkLmpzJztcbiAgICAgICAgIHZhciB0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgICAgICAgdC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIHQpO1xuICAgICB9KCkpO1xuIDwvc2NyaXB0PlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPiBDYXJkIFRlbXBsYXRlIDwvY2FwdGlvbj5cbiAqXG4gPHNjcmlwdCBpZD1cInZuLWNhcmQtdGVtcGxhdGVcIiB0eXBlPVwidGV4dC90ZW1wbGF0ZVwiPlxuICAgICA8aDIgY2xhc3M9XCJ0aXRsZVwiPjwlPSB0aXRsZSAlPjwvaDI+XG4gICAgIDwlIGlmICh0eXBlb2YgaW1hZ2UgIT09ICd1bmRlZmluZWQnICYmIGltYWdlLnVybCAmJiBpbWFnZS51cmwgIT09ICcnKSB7ICU+XG4gICAgICAgICA8cCBjbGFzcz1cImltYWdlIG5vdC1sb2FkZWRcIj5cbiAgICAgICAgICAgICA8aW1nIHNyYz1cIjwlPSBpbWFnZS51cmwgJT5cIj5cbiAgICAgICAgIDwvcD5cbiAgICAgICAgIDwlIH0gJT5cblxuICAgICA8JSB2YXIgZGVzYyA9IFwiTm8gZGVzY3JpcHRpb25cIjtcbiAgICAgaWYgKHR5cGVvZiBkZXNjcmlwdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgIGRlc2MgPSBkZXNjcmlwdGlvbi5zdWJzdHIoMCwgMTUwKSArIChkZXNjcmlwdGlvbi5sZW5ndGggPiAxNTAgPyBcIiZoZWxsaXA7XCIgOiBcIlwiKTtcbiAgICAgfSAlPlxuICAgICA8cCBjbGFzcz1cImRlc2NyaXB0aW9uXCI+PCU9IGRlc2MgJT48L3A+XG5cbiAgICAgPCUgaWYgKHR5cGVvZiBwdWJkYXRlICE9PSAndW5kZWZpbmVkJyAmJiBwdWJkYXRlICYmIHB1YmRhdGUgIT09ICcnKSB7ICU+XG4gICAgICAgICA8cCBjbGFzcz1cInB1Yi1kYXRlXCI+XG4gICAgICAgICAgICAgPCUgdmFyIGRhdGUgPSBuZXcgRGF0ZShwdWJkYXRlICogMTAwMCk7XG4gICAgICAgICAgICAgdmFyIG1vbnRocyA9IFsgJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJywgJ09jdCcsICdOb3YnLCAnRGVjJyBdO1xuICAgICAgICAgICAgIHZhciBtb250aE5hbWUgPSBtb250aHNbZGF0ZS5nZXRNb250aCgpXTtcbiAgICAgICAgICAgICB2YXIgZGF0ZVN0cmluZyA9IG1vbnRoTmFtZSArICcgJyArIGRhdGUuZ2V0RGF0ZSgpICsgJywgJyArIGRhdGUuZ2V0RnVsbFllYXIoKTsgJT5cbiAgICAgICAgICAgICA8JT0gZGF0ZVN0cmluZyAlPlxuICAgICAgICAgPC9wPlxuICAgICA8JSB9ICU+XG4gPC9zY3JpcHQ+XG4gPHNjcmlwdCB0eXBlPVwidGV4dC9qc1wiPlxuICAgICB2YXIgdm9pY2VOYXZpZ2F0b3JDb25maWcgPSB7XG4gICAgICAgICBjYXJkVGVtcGxhdGU6IHdpbmRvd1sndm4tY2FyZC10ZW1wbGF0ZSddLmlubmVySFRNTFxuICAgICB9O1xuICAgICAvLyBOb3cgbG9hZCB0aGUgdm9pY2UgbmF2aWdhdG9yXG4gPC9zY3JpcHQ+XG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+IEN1c3RvbSBDU1M6IENoYW5naW5nIGJ1dHRvbiBjb2xvcnMgZnJvbSB0aGUgZGVmYXVsdCBvcmFuZ2UgdG8gZ3JlZW4gPC9jYXB0aW9uPlxuICpcbiA8c2NyaXB0IGlkPVwidm4tY3VzdG9tLWNzc1wiIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxuICAgICAubW0tYnV0dG9uLWJhY2tncm91bmQge1xuICAgICAgICAgYmFja2dyb3VuZDogIzAwODAwMDtcbiAgICAgfVxuICAgICAubW0tYnV0dG9uLWJhY2tncm91bmQ6aG92ZXIge1xuICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzAwNzMwMDtcbiAgICAgfVxuICAgICAubW0tYnV0dG9uLWJhY2tncm91bmQ6YWN0aXZlIHtcbiAgICAgICAgIGJhY2tncm91bmQ6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KCMwMDVhMDAsICMwMDgwMDApO1xuICAgICAgICAgYmFja2dyb3VuZDogLW1vei1saW5lYXItZ3JhZGllbnQoIzAwNWEwMCwgIzAwODAwMCk7XG4gICAgICAgICBiYWNrZ3JvdW5kOiAtby1saW5lYXItZ3JhZGllbnQoIzAwNWEwMCwgIzAwODAwMCk7XG4gICAgICAgICBiYWNrZ3JvdW5kOiAtbXMtbGluZWFyLWdyYWRpZW50KCMwMDVhMDAsICMwMDgwMDApO1xuICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KCMwMDVhMDAsICMwMDgwMDApO1xuICAgICB9XG4gICAgIC5tbS1idXR0b24tYm9yZGVyIHtcbiAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICMwMDY2MDA7XG4gICAgIH1cblxuICAgICAmIzY0Oy1tb3ota2V5ZnJhbWVzIG1tLWJ1dHRvbi1iYWNrZ3JvdW5kLWFjdGl2ZS1hbmltIHtcbiAgICAgICAgIDUwJSB7IGJhY2tncm91bmQtY29sb3I6ICMwMDZkMDA7IH1cbiAgICAgfVxuICAgICAmIzY0Oy13ZWJraXQta2V5ZnJhbWVzIG1tLWJ1dHRvbi1iYWNrZ3JvdW5kLWFjdGl2ZS1hbmltIHtcbiAgICAgICAgIDUwJSB7IGJhY2tncm91bmQtY29sb3I6ICMwMDZkMDA7IH1cbiAgICAgfVxuICAgICAmIzY0Oy1vLWtleWZyYW1lcyBtbS1idXR0b24tYmFja2dyb3VuZC1hY3RpdmUtYW5pbSB7XG4gICAgICAgICA1MCUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA2ZDAwOyB9XG4gICAgIH1cbiAgICAgJiM2NDtrZXlmcmFtZXMgbW0tYnV0dG9uLWJhY2tncm91bmQtYWN0aXZlLWFuaW0ge1xuICAgICAgICAgNTAlIHsgYmFja2dyb3VuZC1jb2xvcjogIzAwNmQwMDsgfVxuICAgICB9XG4gPC9zY3JpcHQ+XG4gPHNjcmlwdCB0eXBlPVwidGV4dC9qc1wiPlxuICAgICB2YXIgdm9pY2VOYXZpZ2F0b3JDb25maWcgPSB7XG4gICAgICAgICBjdXN0b21DU1M6IHdpbmRvd1sndm4tY3VzdG9tLWNzcyddLmlubmVySFRNTFxuICAgICB9O1xuICAgICAvLyBOb3cgbG9hZCB0aGUgdm9pY2UgbmF2aWdhdG9yXG4gPC9zY3JpcHQ+XG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+IEN1c3RvbSBDU1M6IENoYW5nZSBjYXJkcyBhcmVhIGFwcGVhcmFuY2UgPC9jYXB0aW9uPlxuIDxzY3JpcHQgaWQ9XCJ2bi1jdXN0b20tY3NzXCIgdHlwZT1cInRleHQvY3NzXCI+XG4gICAgICNjYXJkcyB7XG4gICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBkYXJrZ29sZGVucm9kO1xuICAgICB9XG4gICAgICNjYXJkcyAuY2FyZCB7XG4gICAgICAgICBib3JkZXI6IHNvbGlkICMzMzMgMXB4O1xuICAgICAgICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICAgICAgIGJhY2tncm91bmQ6IHJlZDtcbiAgICAgfVxuICAgICAjY2FyZHMgLmNhcmQ6aG92ZXIge1xuICAgICAgICAgYm9yZGVyLWNvbG9yOiBibGFjaztcbiAgICAgfVxuICAgICAjY2FyZHMgLmNhcmQgcCB7XG4gICAgICAgICBjb2xvcjogd2hpdGU7XG4gICAgIH1cbiAgICAgI2NhcmRzIC5jYXJkIGgyLnRpdGxlIHtcbiAgICAgICAgIGNvbG9yOiAjZGRkO1xuICAgICB9XG4gPC9zY3JpcHQ+XG4gPHNjcmlwdCB0eXBlPVwidGV4dC9qc1wiPlxuICAgICB2YXIgdm9pY2VOYXZpZ2F0b3JDb25maWcgPSB7XG4gICAgICAgICBjdXN0b21DU1M6IHdpbmRvd1sndm4tY3VzdG9tLWNzcyddLmlubmVySFRNTFxuICAgICB9O1xuICAgICAvLyBOb3cgbG9hZCB0aGUgdm9pY2UgbmF2aWdhdG9yXG4gPC9zY3JpcHQ+XG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+IEFkdmFuY2VkIGV4YW1wbGU6IGNhcmQgdGVtcGxhdGUsIGN1c3RvbSBjc3MsIGFuZCBvdGhlciBvcHRpb25zIDwvY2FwdGlvbj5cbiAqXG4gPHNjcmlwdCBpZD1cImNhcmQtdGVtcGxhdGVcIiB0eXBlPVwidGV4dC90ZW1wbGF0ZVwiPlxuICAgICA8aDIgY2xhc3M9XCJ0aXRsZVwiPjwlPSB0aXRsZSAlPjwvaDI+XG4gICAgIDwlIGlmICh0eXBlb2YgaW1hZ2UgIT09ICd1bmRlZmluZWQnICYmIGltYWdlLnVybCAmJiBpbWFnZS51cmwgIT09ICcnKSB7ICU+XG4gICAgICAgICA8cCBjbGFzcz1cImltYWdlIG5vdC1sb2FkZWRcIj5cbiAgICAgICAgICAgICA8aW1nIHNyYz1cIjwlPSBpbWFnZS51cmwgJT5cIj5cbiAgICAgICAgIDwvcD5cbiAgICAgPCUgfSAlPlxuXG4gICAgIDwlICB2YXIgZGVzYyA9IFwiTm8gZGVzY3JpcHRpb25cIjtcbiAgICAgICAgIGlmICh0eXBlb2YgZGVzY3JpcHRpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgZGVzYyA9IGRlc2NyaXB0aW9uLnN1YnN0cigwLCAxNTApICsgKGRlc2NyaXB0aW9uLmxlbmd0aCA+IDE1MCA/IFwiJmhlbGxpcDtcIiA6IFwiXCIpO1xuICAgICAgICAgfSAlPlxuICAgICA8cCBjbGFzcz1cImRlc2NyaXB0aW9uXCI+PCU9IGRlc2MgJT48L3A+XG5cbiAgICAgPGRpdiBjbGFzcz1cIm1tLXZuLXJvd1wiPlxuICAgICA8JSAgaWYgKHR5cGVvZiByYXRpbmcgIT09ICd1bmRlZmluZWQnICYmIHJhdGluZyAmJiByYXRpbmcgIT09ICcnKSB7ICU+XG4gICAgICAgICA8cCBjbGFzcz1cImFsaWduLWxlZnQgcmF0aW5nXCI+XG4gICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJyYXRpbmctc3RhcnMgc3RhcnM2OXgxM1wiPlxuICAgICAgICAgICAgICAgICA8JSAgdmFyIHByb2Nlc3NlZFJhdGluZyA9IE1hdGguZmxvb3IocmF0aW5nICogMiArIDAuNSkgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgdmFyIHJhdGluZ0NsYXNzID0gJ3InICsgcHJvY2Vzc2VkUmF0aW5nLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICctJyk7OyAlPlxuICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInJhdGluZy1zdGFycy1ncmFkIDwlPSByYXRpbmdDbGFzcyAlPlwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJyYXRpbmctc3RhcnMtaW1nXCI+PC9zcGFuPlxuICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgIDwvcD5cbiAgICAgPCUgIH0gZWxzZSB7ICU+XG4gICAgICAgICA8cCBjbGFzcz1cImFsaWduLWxlZnQgcmF0aW5nIHBsYWNlaG9sZGVyXCI+Tm8gcmF0aW5nPC9wPlxuICAgICA8JSAgfVxuICAgICAgICAgaWYgKHR5cGVvZiByZXZpZXdjb3VudCAhPT0gJ3VuZGVmaW5lZCcgJiYgcmV2aWV3Y291bnQgJiYgcmV2aWV3Y291bnQgIT09ICcnKSB7ICU+XG4gICAgICAgICAgICAgPHAgY2xhc3M9XCJhbGlnbi1yaWdodCByZXZpZXctY291bnRcIj5cbiAgICAgICAgICAgICA8JSAgdmFyIHNjYWxlcyA9IFsnJywgJ2snLCAnTSddO1xuICAgICAgICAgICAgICAgICB2YXIgc2NhbGUgPSBzY2FsZXMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcGFyc2VJbnQocmV2aWV3Y291bnQpO1xuICAgICAgICAgICAgICAgICB3aGlsZSAodmFsdWUgPiAxMDAwICYmIHNjYWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICBzY2FsZSA9IHNjYWxlcy5zaGlmdCgpOyAvLyByZW1vdmUgbmV4dCBzY2FsZVxuICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSAvIDEwMDA7XG4gICAgICAgICAgICAgICAgIH0gJT5cbiAgICAgICAgICAgICA8JT0gTWF0aC5mbG9vcih2YWx1ZSAqIDEwMCkgLyAxMDAgKyBzY2FsZSAlPiByZXZpZXdzXG4gICAgICAgICAgICAgPC9wPlxuICAgICA8JSAgfSBlbHNlIHsgJT5cbiAgICAgICAgICAgICA8cCBjbGFzcz1cImFsaWduLXJpZ2h0IHJldmlldy1jb3VudCBwbGFjZWhvbGRlclwiPk5vIHJldmlld3M8L3A+XG4gICAgIDwlICB9ICU+XG4gICAgIDxwIGNsYXNzPVwiY2xlYXItZml4XCI+PC9wPlxuICAgICA8L2Rpdj5cbiA8L3NjcmlwdD5cbiA8c2NyaXB0IGlkPVwidm4tY2FyZC1jc3NcIiB0eXBlPVwidGV4dC9jc3NcIj5cbiAgICAgI2NhcmRzIGEuY2FyZCAubW0tdm4tcm93IHAgeyBtYXJnaW46IDJweCAwOyBkaXNwbGF5OiBibG9jazsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgcC5jbGVhci1maXggeyBjbGVhcjogYm90aDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgcC5hbGlnbi1sZWZ0IHsgZmxvYXQ6IGxlZnQ7IHRleHQtYWxpZ246IGxlZnQ7IH1cbiAgICAgI2NhcmRzIGEuY2FyZCAubW0tdm4tcm93IHAuYWxpZ24tcmlnaHQgeyBmbG9hdDogcmlnaHQ7IHRleHQtYWxpZ246IHJpZ2h0OyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyBwLnBsYWNlaG9sZGVyIHsgZm9udC1zaXplOiAxMHB4OyBmb250LXN0eWxlOiBpdGFsaWM7IGNvbG9yOiAjYWFhOyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nIHsgZGlzcGxheTogaW5saW5lLWJsb2NrOyB9XG4gICAgICNjYXJkcyBhLmNhcmQgLm1tLXZuLXJvdyAucmF0aW5nLXN0YXJzIHsgbWFyZ2luLXRvcDogMDsgbWFyZ2luLWxlZnQ6IDA7IHBvc2l0aW9uOiByZWxhdGl2ZTsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnJhdGluZy1zdGFycy5zdGFyczY5eDEzIHsgd2lkdGg6IDY5cHg7IGhlaWdodDogMTNweDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnJhdGluZy1zdGFycy1ncmFkIHtcbiAgICAgICAgIGJhY2tncm91bmQ6ICNkNzc4MzU7XG4gICAgICAgICBiYWNrZ3JvdW5kOiAtbW96LWxpbmVhci1ncmFkaWVudCh0b3AsI2Q3NzgzNSAwLCNmMDg3MjcgNDAlLCNmNGEwNjYgMTAwJSk7XG4gICAgICAgICBiYWNrZ3JvdW5kOiAtd2Via2l0LWdyYWRpZW50KGxpbmVhcixsZWZ0IHRvcCxsZWZ0IGJvdHRvbSxjb2xvci1zdG9wKDAlLCNkNzc4MzUpLGNvbG9yLXN0b3AoNDAlLCNmMDg3MjcpLGNvbG9yLXN0b3AoMTAwJSwjZjRhMDY2KSk7XG4gICAgICAgICBiYWNrZ3JvdW5kOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudCh0b3AsI2Q3NzgzNSAwLCNmMDg3MjcgNDAlLCNmNGEwNjYgMTAwJSk7XG4gICAgICAgICBmaWx0ZXI6IHByb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5ncmFkaWVudChzdGFydENvbG9yc3RyPScjZDc3ODM1JyxlbmRDb2xvcnN0cj0nI2Y0YTA2NicsR3JhZGllbnRUeXBlPTApO1xuICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgdG9wOiAwO1xuICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgIGhlaWdodDogMTNweDtcbiAgICAgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnJhdGluZy1zdGFycy1ncmFkLnI1ICAgeyB3aWR0aDogNjlweDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnJhdGluZy1zdGFycy1ncmFkLnI0LTUgeyB3aWR0aDogNjNweDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnJhdGluZy1zdGFycy1ncmFkLnI0ICAgeyB3aWR0aDogNTVweDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnJhdGluZy1zdGFycy1ncmFkLnIzLTUgeyB3aWR0aDogNDlweDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnJhdGluZy1zdGFycy1ncmFkLnIzICAgeyB3aWR0aDogNDFweDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnJhdGluZy1zdGFycy1ncmFkLnIyLTUgeyB3aWR0aDogMzVweDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnJhdGluZy1zdGFycy1ncmFkLnIyICAgeyB3aWR0aDogMjdweDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnJhdGluZy1zdGFycy1ncmFkLnIxLTUgeyB3aWR0aDogMjFweDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnJhdGluZy1zdGFycy1ncmFkLnIxICAgeyB3aWR0aDogMTRweDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnJhdGluZy1zdGFycy1ncmFkLnIwLTUgeyB3aWR0aDogIDdweDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnJhdGluZy1zdGFycy1ncmFkLnIwICAgeyB3aWR0aDogIDBweDsgfVxuICAgICAjY2FyZHMgYS5jYXJkIC5tbS12bi1yb3cgLnN0YXJzNjl4MTMgLnJhdGluZy1zdGFycy1pbWcge1xuICAgICAgICB3aWR0aDogNjlweDtcbiAgICAgICAgYmFja2dyb3VuZDogdXJsKC9wdWJsaWMvaW1hZ2VzL3N0YXJzLnBuZykgbm8tcmVwZWF0IGNlbnRlciBjZW50ZXI7XG4gICAgICAgIGhlaWdodDogMTNweDtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6IDA7XG4gICAgICAgIGxlZnQ6IDA7XG4gICAgIH1cbiA8L3NjcmlwdD5cbiA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2pzXCI+XG4gICAgIHZhciBNTSA9IHdpbmRvdy5NTSB8fCB7fTtcbiAgICAgKCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICBNTS5sb2FkZXIgPSB7XG4gICAgICAgICAgICAgcm9vdFVSTDogJ2h0dHBzOi8vZGV2ZWxvcGVyLmV4cGVjdGxhYnMuY29tL3B1YmxpYy9zZGtzL2pzLydcbiAgICAgICAgICwgICB3aWRnZXRzOiBbJ3ZvaWNlJ11cbiAgICAgICAgIH07XG4gICAgICAgICBNTS53aWRnZXRzID0ge1xuICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICBhcHBJRDogJ1lPVVIgQVBQSUQnXG4gICAgICAgICAgICAgLCAgIHZvaWNlOiB7XG4gICAgICAgICAgICAgICAgICAgICBjYXJkVGVtcGxhdGU6IHdpbmRvd1sndm4tY2FyZC10ZW1wbGF0ZSddLmlubmVySFRNTFxuICAgICAgICAgICAgICAgICAsICAgY3VzdG9tQ1NTOiB3aW5kb3dbJ3ZuLWN1c3RvbS1jc3MnXS5pbm5lckhUTUxcbiAgICAgICAgICAgICAgICAgLCAgIGxpc3RlbmluZ01vZGU6ICdjb250aW51b3VzJyAvLyBleHRlbmRlZCBsaXN0ZW5pbmcgd2hlbiBvcGVuZWRcbiAgICAgICAgICAgICAgICAgLCAgIGNhcmRMaW5rQmVoYXZpb3I6ICdfYmxhbmsnIC8vIGxpbmtzIG9wZW4gaW4gbmV3IHRhYnNcbiAgICAgICAgICAgICAgICAgLCAgIG51bVJlc3VsdHM6IDIwIC8vIHNob3cgbW9yZSBjYXJkc1xuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgfVxuICAgICAgICAgfTtcbiAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7IHNjcmlwdC5hc3luYyA9IHRydWU7XG4gICAgICAgICBzY3JpcHQuc3JjID0gTU0ubG9hZGVyLnJvb3RVUkwgKyAnZW1iZWQuanMnO1xuICAgICAgICAgdmFyIHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gICAgICAgICB0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgdCk7XG4gICAgIH0oKSk7XG4gPC9zY3JpcHQ+XG5cbiAqIEBtZW1iZXJPZiBNTVxuICogQG5hbWVzcGFjZVxuICovXG5NTS52b2ljZU5hdmlnYXRvciA9IE1NLnZvaWNlTmF2aWdhdG9yIHx8IHt9O1xuTU0ubG9hZGVyID0gTU0ubG9hZGVyIHx8IHt9O1xuTU0ubG9hZGVyLnJvb3RVUkwgPSBNTS5sb2FkZXIucm9vdFVSTCB8fCAnaHR0cHM6Ly9kZXZlbG9wZXIuZXhwZWN0bGFicy5jb20vcHVibGljL3Nka3MvanMvJztcblxuLyoqXG4gKiBUaGUgJ2RpdiNtaW5kbWVsZC1tb2RhbCcgZWxlbWVudCB3aGljaCBjb250YWlucyBhbGwgb2YgdGhlIHZvaWNlIG5hdmlnYXRvciBodG1sXG4gKiBAcHJpdmF0ZVxuICovXG52YXIgJG1tID0gZmFsc2U7XG5cbi8qKlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbnZhciAkbW1faWZyYW1lID0gZmFsc2U7XG5cbi8qKlxuICogaXNJbml0aWFsaXplZCBpcyBzZXQgdG8gdHJ1ZSBvbmNlIHRoZSB3aWRnZXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuIE9uY2VcbiAqIHRoZSB3aWRnZXQgaXMgaW5pdGlhbGl6ZWQgb25Jbml0KCkgaXMgY2FsbGVkLiBUaGlzIGlzIHVzZWQgYnlcbiAqIE1NLnZvaWNlTmF2aWdhdG9yLnNob3dNb2RhbCgpIHRvIGFsbG93IHVzZXJzIHRvIGNhbGwgc2hvd01vZGFsXG4gKiB3aXRob3V0IGhhdmluZyB0byBrbm93IGlmIHRoZSB3aWRnZXQgaXMgbG9hZGVkIG9yIG5vdFxuICpcbiAqIEBwcml2YXRlXG4gKi9cbnZhciBpc0luaXRpYWxpemVkID0gZmFsc2U7XG52YXIgbW9kYWxMb2FkZWQgPSBmYWxzZTtcbnZhciBvbkluaXRDYWxsYmFja3MgPSBbXTtcbnZhciBvbk1vZGFsTG9hZGVkQ2FsbGJhY2tzID0gW107XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgLy8gQWRkIHRoZSAjbWluZG1lbGQtbW9kYWwgZGl2IHRvIHRoZSBwYWdlXG4gICAgdmFyIG1tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbW0uc2V0QXR0cmlidXRlKCdpZCcsICdtaW5kbWVsZC1tb2RhbCcpO1xuICAgIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKG1tLCBkb2N1bWVudC5ib2R5LmNoaWxkTm9kZXNbMF0pO1xuICAgICRtbSA9IFVUSUwuZWwobW0pO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBhbnkgZWxlbWVudCB3aXRoIC5tbS12b2ljZS1uYXYtaW5pdCBvbiBpdFxuICAgIHZhciAkaW5pdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtbS12b2ljZS1uYXYtaW5pdCcpO1xuICAgIHZhciAkdGV4dEluaXRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbW0tdm9pY2UtbmF2LXRleHQtaW5pdCcpO1xuICAgIHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAvLyBsb29rIGZvciB0ZXh0IHZhbHVlIGluIG1tLXZvaWNlLW5hdi10ZXh0LWluaXQgZWxlbWVudFxuICAgICAgICBpZiAoJHRleHRJbml0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnkgPSAkdGV4dEluaXRzWzBdLnZhbHVlO1xuICAgICAgICAgICAgTU0udm9pY2VOYXZpZ2F0b3Iuc2hvd01vZGFsKHsgcXVlcnk6IHF1ZXJ5IH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgTU0udm9pY2VOYXZpZ2F0b3Iuc2hvd01vZGFsKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkaW5pdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgVVRJTC5lbCgkaW5pdHNbaV0pLmNsaWNrKGNsaWNrSGFuZGxlcik7XG4gICAgfVxuXG4gICAgdmFyIGtleVByZXNzSGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDEzKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBNTS52b2ljZU5hdmlnYXRvci5zaG93TW9kYWwoeyBxdWVyeTogcXVlcnkgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGZvcih2YXIgaiA9IDA7IGogPCAkdGV4dEluaXRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIFVUSUwuZWwoJHRleHRJbml0c1tqXSkua2V5cHJlc3Moa2V5UHJlc3NIYW5kbGVyKTtcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsaXplZCgpO1xuXG4gICAgLy8gV2FpdCBmb3IgbWVzc2FnZXNcbiAgICBVVElMLmVsKHdpbmRvdykub24oJ21lc3NhZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuZGF0YS5zb3VyY2UgIT0gJ21pbmRtZWxkJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKGV2ZW50LmRhdGEuYWN0aW9uID09ICdjbG9zZScpIHtcbiAgICAgICAgICAgICRtbS5yZW1vdmVDbGFzcygnb24nKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzZXRJbml0aWFsaXplZCgpIHtcbiAgICBpc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICBvbkluaXRDYWxsYmFja3MuZm9yRWFjaChcbiAgICAgICAgZnVuY3Rpb24gcnVuQ2FsbGJhY2sgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gY2FsbE9uTW9kYWxMb2FkZWQgKGNhbGxiYWNrKSB7XG4gICAgaWYgKCEgbW9kYWxMb2FkZWQpIHtcbiAgICAgICAgb25Nb2RhbExvYWRlZENhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcG9zdE1lc3NhZ2UoYWN0aW9uLCBkYXRhKSB7XG4gICAgdmFyIHdpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWluZG1lbGQtaWZyYW1lXCIpLmNvbnRlbnRXaW5kb3c7XG4gICAgd2luLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgIHNvdXJjZTogJ21pbmRtZWxkJyxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgIH0sIFwiKlwiKTtcbn1cblxuLyoqXG4gKiBPcGVucyB0aGUgdm9pY2UgbmF2aWdhdG9yIG1vZGFsIHdpbmRvd1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnF1ZXJ5XSAgICAgICAgICAgICAgICAgaWYgcHJvdmlkZWQsIHRoaXMgZmllbGQgd2lsbCBiZSB0aGUgaW5pdGlhbCBxdWVyeSwgYW5kIHdpbGwgaW1tZWRpYXRlbHkgc2hvdyByZXN1bHRzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmZvcmNlTmV3SUZyYW1lPWZhbHNlXSBpZiB0cnVlLCBhbnkgdm9pY2UgbmF2aWdhdG9ycyB0aGF0IGhhdmUgcHJldmlvdXNseSBiZWVuIGNyZWF0ZWQgd2lsbFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmUgZGVzdHJveWVkLCBhbmQgYSBuZXcgaW5zdGFuY2Ugd2lsbCBiZSBjcmVhdGVkLlxuICovXG5NTS52b2ljZU5hdmlnYXRvci5zaG93TW9kYWwgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKGlzSW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgdmFyIGlmcmFtZTtcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSB2b2ljZSBuYXZpZ2F0b3IgY29uZmlnXG4gICAgICAgIGlmICh0eXBlb2YgTU0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIE1NLndpZGdldHMgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIE1NLndpZGdldHMuY29uZmlnICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIC8vIE1vdmUgY29uZmlnIHRvIHZvaWNlIG5hdiBjb25maWdcbiAgICAgICAgICAgICAgICBNTS52b2ljZU5hdmlnYXRvci5jb25maWcgPSBNTS53aWRnZXRzLmNvbmZpZy52b2ljZSB8fCB7fTtcbiAgICAgICAgICAgICAgICBNTS52b2ljZU5hdmlnYXRvci5jb25maWcuYXBwSUQgPSBNTS53aWRnZXRzLmNvbmZpZy5hcHBJRDtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE1NLndpZGdldHMuY29uZmlnLmNsZWFuVXJsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBNTS52b2ljZU5hdmlnYXRvci5jb25maWcuY2xlYW5VcmwgPSBNTS53aWRnZXRzLmNvbmZpZy5jbGVhblVybDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNTS53aWRnZXRzLmNvbmZpZy5mYXllQ2xpZW50VXJsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBNTS52b2ljZU5hdmlnYXRvci5jb25maWcuZmF5ZUNsaWVudFVybCA9IE1NLndpZGdldHMuY29uZmlnLmZheWVDbGllbnRVcmw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBNTS52b2ljZU5hdmlnYXRvci5jb25maWcgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgY2FyZCBsYXlvdXRcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZy5jYXJkVGVtcGxhdGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZy5jYXJkTGF5b3V0ID0gJ2N1c3RvbSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnLmNhcmRMYXlvdXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZy5jYXJkTGF5b3V0ID0gJ2RlZmF1bHQnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIG1ha2UgYWJzb2x1dGUgVVJMc1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnLmN1c3RvbUNTU1VSTCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnLmN1c3RvbUNTU1VSTCA9IFVUSUwuY29udmVydFRvQWJzb2x1dGVQYXRoKE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZy5jdXN0b21DU1NVUkwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgbGlzdGVuaW5nIG1vZGVcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMubGlzdGVuaW5nTW9kZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnLmxpc3RlbmluZ01vZGUgPSBvcHRpb25zLmxpc3RlbmluZ01vZGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnLmxpc3RlbmluZ01vZGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZy5saXN0ZW5pbmdNb2RlID0gJ25vcm1hbCc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUGFzcyB0b2tlbiwgdXNlciBJRCwgYW5kIHNlc3Npb24gSUQgaWYgdGhleSBhcmUgc2V0IGFscmVhZHlcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE1NLnRva2VuICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgTU0uYWN0aXZlVXNlcklkICE9PSAndW5kZWZpbmVkJyAmJiBNTS5hY3RpdmVVc2VySWQgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIE1NLmFjdGl2ZVNlc3Npb25JZCAhPT0gJ3VuZGVmaW5lZCcgJiYgTU0uYWN0aXZlU2Vzc2lvbklkICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZy5tbUNyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IE1NLnRva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklEOiBNTS5hY3RpdmVVc2VySWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uSUQ6IE1NLmFjdGl2ZVNlc3Npb25JZFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiBkZWZpbmVkLCBwYXNzIGEgc3RhcnRpbmcgcXVlcnlcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5xdWVyeSAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMucXVlcnkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZy5zdGFydFF1ZXJ5ID0gb3B0aW9ucy5xdWVyeTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIE1NLnZvaWNlTmF2aWdhdG9yLmNvbmZpZy5zdGFydFF1ZXJ5ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5mb3JjZU5ld0lGcmFtZSAmJiAkbW1faWZyYW1lKSB7XG4gICAgICAgICAgICBpZnJhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWluZG1lbGQtaWZyYW1lJyk7XG4gICAgICAgICAgICBpZnJhbWUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIGlmcmFtZSBpZiBmaXJzdCBsb2FkXG4gICAgICAgIGlmICghJG1tX2lmcmFtZSB8fCBvcHRpb25zLmZvcmNlTmV3SUZyYW1lKSB7XG4gICAgICAgICAgICBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2ZyYW1lQm9yZGVyJywgJzAnKTtcbiAgICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21pbmRtZWxkLWlmcmFtZScpO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnYWxsb3d0cmFuc3BhcmVuY3knLCAndHJ1ZScpO1xuICAgICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3JjJywgTU0ubG9hZGVyLnJvb3RVUkwgKyAnd2lkZ2V0cy92b2ljZU5hdmlnYXRvci9tb2RhbC9tb2RhbC5odG1sJyk7XG5cbiAgICAgICAgICAgICRtbV9pZnJhbWUgPSBVVElMLmVsKGlmcmFtZSk7XG5cbiAgICAgICAgICAgIFVUSUwuZWwoaWZyYW1lKS5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG1vZGFsTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZSgnY29uZmlnJywgTU0udm9pY2VOYXZpZ2F0b3IuY29uZmlnKTtcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZSgnb3BlbicpO1xuICAgICAgICAgICAgICAgIG9uTW9kYWxMb2FkZWRDYWxsYmFja3MuZm9yRWFjaChcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcnVuQ2FsbGJhY2sgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkbW0uZWwoKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcG9zdE1lc3NhZ2UoJ29wZW4nLCBNTS52b2ljZU5hdmlnYXRvci5jb25maWcpO1xuICAgICAgICB9XG4gICAgICAgICRtbS5hZGRDbGFzcygnb24nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIE9wZW4gbW9kYWwgb24gaW5pdFxuICAgICAgICBvbkluaXRDYWxsYmFja3MucHVzaChcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNob3dNb2RhbE9uSW5pdCAoKSB7XG4gICAgICAgICAgICAgICAgTU0udm9pY2VOYXZpZ2F0b3Iuc2hvd01vZGFsKG9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbn07XG5cbi8qKlxuICogQ2xvc2VzIHRoZSB2b2ljZSBuYXZpZ2F0b3IgbW9kYWwgd2luZG93XG4gKi9cbk1NLnZvaWNlTmF2aWdhdG9yLmhpZGVNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBwb3N0TWVzc2FnZSgnY2xvc2UnKTtcbn07XG5cblxuLyoqXG4gKiBTZXRzIHRoZSB2b2ljZSBuYXZpZ2F0b3IncyB1c2VyJ3MgbG9jYXRpb25cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbGF0aXR1ZGUgbmV3IGxhdGl0dWRlIGZvciB1c2VyIGxvY2F0aW9uXG4gKiBAcGFyYW0ge251bWJlcn0gbG9uZ2l0dWRlIG5ldyBsb25naXR1ZGUgZm9yIHVzZXIgbG9jYXRpb25cbiAqL1xuTU0udm9pY2VOYXZpZ2F0b3Iuc2V0VXNlckxvY2F0aW9uID0gZnVuY3Rpb24gKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgICBpZiAoaXNJbml0aWFsaXplZCkge1xuICAgICAgICBjYWxsT25Nb2RhbExvYWRlZChcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldExvY2F0aW9uT25Nb2RhbExvYWRlZCAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogbGF0aXR1ZGUsXG4gICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogbG9uZ2l0dWRlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZSgnc2V0TG9jYXRpb24nLCBsb2NhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb25Jbml0Q2FsbGJhY2tzLnB1c2goXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRMb2NhdGlvbk9uSW5pdCAoKSB7XG4gICAgICAgICAgICAgICAgTU0udm9pY2VOYXZpZ2F0b3Iuc2V0VXNlckxvY2F0aW9uKGxhdGl0dWRlLCBsb25naXR1ZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbn07XG5cbi8vIHNjaGVkdWxlIGluaXRpYWxpemF0aW9uIG9mIHZvaWNlIG5hdmlnYXRvclxuVVRJTC5jb250ZW50TG9hZGVkKHdpbmRvdywgZnVuY3Rpb24oKSB7XG4gICAgaW5pdCgpO1xufSk7XG4iXX0=
