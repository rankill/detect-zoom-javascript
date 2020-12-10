
/* Detect-zoom
 * -----------
 * Cross Browser Zoom and Pixel Ratio Detector
 * Version 1.0.4 | Apr 1 2013
 * dual-licensed under the WTFPL and MIT license
 * Maintained by https://github/tombigel
 * Original developer https://github.com/yonran
 */

//AMD and CommonJS initialization copied from https://github.com/zohararad/audio5js
(function (root, ns, factory) {
	"use strict";

	if (typeof (module) !== 'undefined' && module.exports) { // CommonJS
		module.exports = factory(ns, root);
	} else if (typeof (define) === 'function' && define.amd) { // AMD
		define("detect-zoom", function () {
			return factory(ns, root);
		});
	} else {
		root[ns] = factory(ns, root);
	}

}(window, 'detectZoom', function () {

	/**
	 * Use devicePixelRatio if supported by the browser
	 * @return {Number}
	 * @private
	 */
	const devicePixelRatio = () => {
		return window.devicePixelRatio || 1;
    };
    
    const isRetinaDevice = () => {
        return devicePixelRatio() > 1
    }
	/**
	 * Fallback function to set default values
	 * @return {Object}
	 * @private
	 */
	const fallback = () => ({
        zoom: 1,
        devicePxPerCssPx: 1
    })

    const commonZoomMethod = (screenResolution = window.outerWidth, windowWidth = window.innerWidth) => {
        const zoom = Math.round(((screenResolution) / windowWidth)*100) / 100;
		return {
			zoom: zoom * 100,
			devicePxPerCssPx: zoom * devicePixelRatio()
		};
    }


	/**
	 * For chrome
	 * @return {Object}
	 */
	const chrome = commonZoomMethod;

	/**
	 * For safari (same as chrome)
	 * @return {Object}
	 */
	const safari = commonZoomMethod;

	/**
	 * Firefox 18.x
	 * Mozilla added support for devicePixelRatio to Firefox 18,
	 * but it is affected by the zoom level, and by retina display 
     * so we need to check retina displays and treat it as normal display
	 * @return {Object}
	 * @private
	 */
    const firefox18 = function () {
        const pixelRatio = isRetinaDevice ? devicePixelRatio() / 2 : devicePixelRatio()
        const screenWidthResolution = screen.width * pixelRatio;
		return commonZoomMethod(screenWidthResolution);
	};



	/**
	 * Generate detection function
	 * @private
	 */
	const detectFunction = (function () {
        let func = fallback;

        const isSafari =
            /Safari/.test(navigator.userAgent) &&
            /Apple Computer/.test(navigator.vendor);

		//chrome
		if(!!window.chrome && !(!!window.opera || navigator.userAgent.indexOf(' Opera') >= 0)){
			func = chrome;
		}
		//safari
		else if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || isSafari){
			func = safari;
		}	
		//WebKit
		else if ('webkitRequestAnimationFrame' in window) {
			func = webkit;
		}
		//Last one is Firefox
		//FF 18.x
		else if (window.devicePixelRatio) {
			func = firefox18;
		}

		return func;
	}());


	return ({
		/**
		 * Ratios.zoom shorthand
		 * @return {Number} Zoom level
		 */
		zoom: function () {
			return detectFunction().zoom;
		},

		/**
		 * Ratios.devicePxPerCssPx shorthand
		 * @return {Number} devicePxPerCssPx level
		 */
		device: function () {
			return detectFunction().devicePxPerCssPx;
		}
	});
}));

//-----------------------
// debouncing plugin by Paul Irish https://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/
//-----------------------
(function($,sr){
	const debounce = function (func, threshold, execAsap) {
		let timeout;

		return function debounced () {
			const obj = this, args = arguments;
			function delayed () {
				if (!execAsap)
					func.apply(obj, args);
				timeout = null;
			};

			if (timeout)
				clearTimeout(timeout);
			else if (execAsap)
				func.apply(obj, args);

			timeout = setTimeout(delayed, threshold || 100);
		};
	}
	// smartresize
	jQuery.fn[sr] = function(fn){  return fn ? this.on('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');


//-----------------------
// Custom functions
//-----------------------

const aZoom = $('.a-zoom');
const dZoom = $('.d-zoom');

function getZoomValues () {
	const zoom = detectZoom.zoom();
	const device = detectZoom.device();
	const newZoomVal = parseFloat(zoom,10).toFixed(0);
	const newDeviceVal = parseFloat(device,10).toFixed(0);
	aZoom.text(newZoomVal);
	dZoom.text(newDeviceVal);
}

$(document).ready(function() {
	getZoomValues();
});
$(window).smartresize(function(){
	getZoomValues();

});
