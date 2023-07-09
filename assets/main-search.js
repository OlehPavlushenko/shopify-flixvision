!function(){function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(e){return function(e){if(Array.isArray(e))return r(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||n(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(e,t){if(e){if("string"==typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(e,t):void 0}}function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,d(r.key),r)}}function a(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&p(e,t)}function c(t){var n=h();return function(){var r,o=y(t);if(n){var i=y(this).constructor;r=Reflect.construct(o,arguments,i)}else r=o.apply(this,arguments);return function(t,n){if(n&&("object"===e(n)||"function"==typeof n))return n;if(void 0!==n)throw new TypeError("Derived constructors may only return object or undefined");return s(t)}(this,r)}}function s(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function l(e){var t="function"==typeof Map?new Map:void 0;return l=function(e){if(null===e||(n=e,-1===Function.toString.call(n).indexOf("[native code]")))return e;var n;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,r)}function r(){return f(e,arguments,y(this).constructor)}return r.prototype=Object.create(e.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),p(r,e)},l(e)}function f(e,t,n){return f=h()?Reflect.construct.bind():function(e,t,n){var r=[null];r.push.apply(r,t);var o=new(Function.bind.apply(e,r));return n&&p(o,n.prototype),o},f.apply(null,arguments)}function h(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function p(e,t){return p=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},p(e,t)}function y(e){return y=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},y(e)}function d(t){var n=function(t,n){if("object"!==e(t)||null===t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var o=r.call(t,n||"default");if("object"!==e(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===n?String:Number)(t)}(t,"string");return"symbol"===e(n)?n:String(n)}var m=function(e){u(r,e);var n=c(r);function r(){var e,i,a,u;return o(this,r),e=n.call(this),i=s(e),u=function(t,n){var r;return function(){for(var o=arguments.length,i=new Array(o),a=0;a<o;a++)i[a]=arguments[a];clearTimeout(r),r=setTimeout((function(){return t.apply(s(e),i)}),n)}},(a=d(a="debounce"))in i?Object.defineProperty(i,a,{value:u,enumerable:!0,configurable:!0,writable:!0}):i[a]=u,e.input=e.querySelector('.template-main-search input[type="search"]'),e.tabPanels=t(e.querySelectorAll(".js-tabpanel")),e.parent=e.closest("div"),e.mainSearchHeader=document.querySelector(".js-main-search-header"),e.mainHeader=document.querySelector("#shopify-section-header").offsetHeight,e.tempTotalWrapper=e.querySelector(".template-main-search__wrapper"),e.mainSearchHeaderPos=e.mainSearchHeader.getBoundingClientRect().top+window.pageYOffset-e.mainHeader,e.searchParams=new URLSearchParams(window.location.search),e.tempTotal=0,e.initialize(),e}return a(r,[{key:"initialize",value:function(){var e=this;this.querySelector("form.search").addEventListener("submit",this.onFormSubmit.bind(this)),this.input.focus(),this.input.setSelectionRange(this.input.value.length,this.input.value.length),this.input.addEventListener("input",this.debounce((function(t){e.onChange(t)}),500).bind(this)),this.searchParams.get("q")&&setTimeout((function(){window.scrollTo({top:e.mainSearchHeaderPos,behavior:"smooth"})}),"1")}},{key:"getQuery",value:function(){return this.input.value.trim()}},{key:"onFormSubmit",value:function(e){this.getQuery().length||e.preventDefault()}},{key:"onChange",value:function(){var e=this.getQuery();e.length&&(e.length<3||this.getSearchResults(e))}},{key:"getSearchResults",value:function(e){var t=this;this.setLiveRegionLoadingState();var n=this.searchParams.get("type"),r=new URLSearchParams;"product"===n?r.set("type","product"):"article"===n?r.set("type","article"):"page"===n?r.set("type","page"):r.set("sort_by","price-ascending"),r.set("q",encodeURIComponent(e));var o="".concat(window.Shopify.routes.root,"search");fetch("".concat(o,"?").concat(r,"&section_id=main-search")).then((function(e){if(!e.ok){var n=new Error(e.status);throw t.unsetLiveRegionLoadingState(),n}return e.text()})).then((function(e){var n=(new DOMParser).parseFromString(e,"text/html").querySelector(".main-search__wrapper").innerHTML;t.renderSearchResults(n),history.pushState(null,null,"?"+r.toString()),console.log(t.mainSearchHeaderPos),setTimeout((function(){window.scrollTo({top:t.mainSearchHeaderPos,behavior:"smooth"})}),"1")})).catch((function(e){throw t.unsetLiveRegionLoadingState(),e}))}},{key:"renderSearchResults",value:function(e){this.parent.innerHTML=e,this.unsetLiveRegionLoadingState()}},{key:"setLiveRegionLoadingState",value:function(){this.setAttribute("loading",!0)}},{key:"unsetLiveRegionLoadingState",value:function(){this.removeAttribute("loading")}}]),r}(l(HTMLElement));customElements.define("main-search",m);var v=function(e){u(r,e);var t=c(r);function r(){var e;return o(this,r),e=t.call(this),window.currentPage=1,e.querySelector(".js-search-load-more").addEventListener("click",e.loadNextPage.bind(s(e))),e}return a(r,[{key:"getQueryForSearchPagination",value:function(e){var t,r="",o=function(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=n(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var o=0,i=function(){};return{s:i,n:function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u=!0,c=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return u=e.done,e},e:function(e){c=!0,a=e},f:function(){try{u||null==r.return||r.return()}finally{if(c)throw a}}}}(new URLSearchParams(window.location.search));try{for(o.s();!(t=o.n()).done;){var i=t.value;"page"!==i[0]&&(""!==r&&(r+="&"),r+="".concat(i[0],"=").concat(i[1]))}}catch(e){o.e(e)}finally{o.f()}return"?section_id=".concat(e,"&page=").concat(window.currentPage).concat(""!==r?"&":"")+r}},{key:"loadNextPage",value:function(){var e=this,t=document.getElementById("main-search-terms-grid").dataset.id;window.currentPage++;var n=this.getQueryForSearchPagination(t);fetch(n).then((function(e){return e.text()})).then((function(r){var o=(new DOMParser).parseFromString(r,"text/html").querySelector('[id*="'.concat(t,'"]')).innerHTML;e.renderPostGrid(o);var i=new URLSearchParams(n);i.delete("section_id"),history.pushState(null,null,"?"+i.toString())}))}},{key:"renderPostGrid",value:function(e){var t=(new DOMParser).parseFromString(e,"text/html"),n=t.getElementById("main-search-terms-grid"),r=n.innerHTML,o=parseInt(t.querySelector(".js-terms-count").innerHTML),i=parseInt(t.querySelector(".js-total-terms-count").innerHTML);document.querySelector(".js-terms-count").innerHTML=o>=i?i:o,n.querySelector(".js-main-search-item")&&document.getElementById("main-search-terms-grid").insertAdjacentHTML("beforeend",r),o>=i&&(document.querySelector(".js-search-load-more").style.display="none")}}]),r}(l(HTMLElement));customElements.define("search-load-more",v)}();