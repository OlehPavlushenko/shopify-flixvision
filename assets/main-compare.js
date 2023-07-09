!function(){function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,l(r.key),r)}}function n(t){var n=c();return function(){var o,i=a(t);if(n){var c=a(this).constructor;o=Reflect.construct(i,arguments,c)}else o=i.apply(this,arguments);return function(t,n){if(n&&("object"===e(n)||"function"==typeof n))return n;if(void 0!==n)throw new TypeError("Derived constructors may only return object or undefined");return r(t)}(this,o)}}function r(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function o(e){var t="function"==typeof Map?new Map:void 0;return o=function(e){if(null===e||(n=e,-1===Function.toString.call(n).indexOf("[native code]")))return e;var n;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,r)}function r(){return i(e,arguments,a(this).constructor)}return r.prototype=Object.create(e.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),u(r,e)},o(e)}function i(e,t,n){return i=c()?Reflect.construct.bind():function(e,t,n){var r=[null];r.push.apply(r,t);var o=new(Function.bind.apply(e,r));return n&&u(o,n.prototype),o},i.apply(null,arguments)}function c(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function u(e,t){return u=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},u(e,t)}function a(e){return a=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},a(e)}function l(t){var n=function(t,n){if("object"!==e(t)||null===t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var o=r.call(t,n||"default");if("object"!==e(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===n?String:Number)(t)}(t,"string");return"symbol"===e(n)?n:String(n)}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&u(e,t)}(f,e);var o,i,c,a=n(f);function f(){var e,t,n,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,f),e=a.call(this),t=r(e),o=function(t,n){var o;return function(){for(var i=arguments.length,c=new Array(i),u=0;u<i;u++)c[u]=arguments[u];clearTimeout(o),o=setTimeout((function(){return t.apply(r(e),c)}),n)}},(n=l(n="debounce"))in t?Object.defineProperty(t,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[n]=o;var i=e.debounce(e.getMaxHeight,150);return window.addEventListener("resize",i),e.loadCompareProducts(),e}return o=f,(i=[{key:"init",value:function(){new Swiper(".js-swiper",{loop:!1,slidesPerView:1,spaceBetween:0,navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"},pagination:!1,breakpoints:{550:{slidesPerView:2},991:{slidesPerView:3},1400:{slidesPerView:4}}})}},{key:"loadCompareProducts",value:function(){var e=this,t=(JSON.parse(localStorage.getItem("productsCompare"))||[]).map((function(e){return e.name})).join("="),n=document.querySelector(".js-list-container"),r=document.querySelector(".js-page-compare-title");t&&(r.classList.add("hidden"),fetch(window.Shopify.routes.root+"collections/all?section_id=page-compare&handle="+encodeURIComponent(t)).then((function(e){if(!e.ok)throw new Error("Network response was not ok");return e.text()})).then((function(t){var o=document.createElement("div");o.innerHTML=t;var i=o.querySelector(".js-page-block");i&&i.innerHTML.trim().length&&(n.innerHTML=i.innerHTML,setTimeout((function(){new Promise((function(t){e.init(),t()})).then((function(){e.getMaxHeight()}))}),100),n.querySelectorAll(".js-btn-compare").forEach((function(e){e.addEventListener("click",(function(e){e.preventDefault();var t=e.currentTarget;setTimeout((function(){t.closest(".js-card-item").remove(),0==(JSON.parse(localStorage.getItem("productsCompare"))||[]).length&&(n.classList.add("hidden"),r.classList.remove("hidden"))}),300)}))})))})).catch((function(e){console.error("Error:",e)})))}},{key:"getMaxHeight",value:function(){this.resetHeight();var e=document.querySelectorAll(".main-compare-page__body--item"),t={"item-main":0,"item-desc":0,"item-rating":0,"item-vendor":0,"item-available":0,"item-type":0,"item-option-first":0,"item-option-second":0,"item-option-third":0,"item-tags":0};e.forEach((function(e){var n=e.classList.item(1),r=e.offsetHeight;r>t[n]&&(t[n]=r)})),e.forEach((function(e){var n=e.classList.item(1);e.style.height="".concat(t[n],"px")})),console.log(t),document.querySelectorAll(".main-compare-page__head--item").forEach((function(e){var n=e.classList.item(1);e.style.height="".concat(t[n],"px")}))}},{key:"resetHeight",value:function(){document.querySelectorAll(".main-compare-page__body--item").forEach((function(e){e.style.height="auto"}))}}])&&t(o.prototype,i),c&&t(o,c),Object.defineProperty(o,"prototype",{writable:!1}),f}(o(HTMLElement));customElements.define("page-compare",f)}();