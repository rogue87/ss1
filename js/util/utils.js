( function (W, undefined) {
    'use strict';

    var ConnTypes = require('../../constants').ConnectionTypes,
        _extend = function ( toObj, fromObj ) {
            for( var key in fromObj ) {
                if ( fromObj.hasOwnProperty( key ) && toObj[key] === undefined ) {
                    toObj[key] = fromObj[key];
                }
            }
        },
        imageOptimizationConnTypes = [ConnTypes.NO_NETWORK, ConnTypes.UNKNOWN, ConnTypes.TWO_G],
        noop = function () {

        },
        memoizationCache = {},
        basePrefix = 'id_',
        idCounter = 1;

    module.exports = {
        isFunction: function (fn) {
            return typeof fn === 'function';
        },

        extend: function ( toObj, fromObj ) {
            _extend( toObj.prototype, fromObj.prototype );
            _extend( toObj, fromObj );

            return toObj;
        },

        serializeParams: function ( params ) {
            var serializedParams = [];

            for ( var key in params ) {
                if ( params.hasOwnProperty( key ) ) {
                    serializedParams.push( key + '=' + params[key] );
                }
            }

            return serializedParams.join( '&' );
        },

        empty: function ( element ) {
            while ( element.firstChild ) {
                element.removeChild( element.firstChild );
            }

            return element;
        },

        getUniqueId: function (prefix) {
            return (prefix || basePrefix) + idCounter++;
        },

        simpleClone: function (obj) {
            return JSON.parse(JSON.stringify(obj));
        },

        loadImage: function (params) {
            var imageEl = document.createElement('img');

            imageEl.onload = function () {
                params.success(imageEl) || noop();
            };

            imageEl.onerror = params.error || noop;

            imageEl.src = params.src;
        },

        toOptimizeForImages: function (connectionType) {
            if (memoizationCache[connectionType] === undefined) {
                memoizationCache[connectionType] = imageOptimizationConnTypes.indexOf(connectionType) !== -1;
            }

            return memoizationCache[connectionType];
        },

        getNodeIndex: function (elem) {
            var index = 0;

            while(elem = elem.previousElementSibling) {
                index++;
            }

            return index;
        },

        createCustomEvent: function (eventName) {
            var customEvent;

            if (W.CustomEvent) {
                customEvent = new CustomEvent(eventName, {
                    bubbles: true
                });
            } else {
                customEvent = document.createEvent('Event');
                customEvent.initEvent(eventName, true, false);
            }

            return customEvent;

        },

        // Toggle Back Navigation Set For Allowing Back and Up Press Inside The Application

        toggleBackNavigation: function (enable) {
            enable = enable ? 'true' : 'false';

            platformSdk.bridge.allowBackPress(enable);
            platformSdk.bridge.allowUpPress(enable);
        }
    };

} )(window);