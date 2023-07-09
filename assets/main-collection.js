!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return r(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return r(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var o=0,i=function(){};return{s:i,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,u=!0,a=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return u=t.done,t},e:function(t){a=!0,c=t},f:function(){try{u||null==n.return||n.return()}finally{if(a)throw c}}}}function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(e,r){for(var n=0;n<r.length;n++){var o=r[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,(i=o.key,c=void 0,c=function(e,r){if("object"!==t(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,r||"default");if("object"!==t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(i,"string"),"symbol"===t(c)?c:String(c)),o)}var i,c}function i(t,e,r){return e&&o(t.prototype,e),r&&o(t,r),Object.defineProperty(t,"prototype",{writable:!1}),t}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&d(t,e)}function u(e){var r=s();return function(){var n,o=y(e);if(r){var i=y(this).constructor;n=Reflect.construct(o,arguments,i)}else n=o.apply(this,arguments);return function(e,r){if(r&&("object"===t(r)||"function"==typeof r))return r;if(void 0!==r)throw new TypeError("Derived constructors may only return object or undefined");return a(e)}(this,n)}}function a(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function l(t){var e="function"==typeof Map?new Map:void 0;return l=function(t){if(null===t||(r=t,-1===Function.toString.call(r).indexOf("[native code]")))return t;var r;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,n)}function n(){return f(t,arguments,y(this).constructor)}return n.prototype=Object.create(t.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),d(n,t)},l(t)}function f(t,e,r){return f=s()?Reflect.construct.bind():function(t,e,r){var n=[null];n.push.apply(n,e);var o=new(Function.bind.apply(t,n));return r&&d(o,r.prototype),o},f.apply(null,arguments)}function s(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function d(t,e){return d=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},d(t,e)}function y(t){return y=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},y(t)}var p=function(t){c(r,t);var e=u(r);function r(){var t;return n(this,r),(t=e.call(this)).gridBtn=t.querySelector(".js-grid-view"),t.listBtn=t.querySelector(".js-list-view"),t.productGrid=document.querySelector(".js-product-grid"),t.viewButtons=t.querySelectorAll(".js-view-button"),t.viewButtons.forEach((function(e){e.addEventListener("click",(function(r){r.preventDefault(),t.viewButtons.forEach((function(t){t.classList.toggle("active",t===e)}));var n=e.dataset.view;t.switchView(n)}))})),t.checkLocalStorage(),t}return i(r,[{key:"switchView",value:function(t){var e="grid"===t?"grid":"list",r="grid"===t?"list":"grid";this.productGrid.classList.add(e),this.productGrid.classList.remove(r),localStorage.setItem("view",t)}},{key:"checkLocalStorage",value:function(){var t=localStorage.getItem("view")||"grid";this.switchView(t),this.gridBtn.classList.toggle("active","grid"===t),this.listBtn.classList.toggle("active","list"===t)}}]),r}(l(HTMLElement));customElements.define("grid-list-view",p);var v=function(t){c(o,t);var r=u(o);function o(){var t;return n(this,o),t=r.call(this),window.currentPage=1,t.querySelector(".js-collection-load-more").addEventListener("click",t.loadNextPage.bind(a(t))),t}return i(o,[{key:"getQueryForBlogPagination",value:function(t){var r,n="",o=e(new URLSearchParams(window.location.search));try{for(o.s();!(r=o.n()).done;){var i=r.value;"page"!==i[0]&&(""!==n&&(n+="&"),n+="".concat(i[0],"=").concat(i[1]))}}catch(t){o.e(t)}finally{o.f()}return"?section_id=".concat(t,"&page=").concat(window.currentPage).concat(""!==n?"&":"")+n}},{key:"loadNextPage",value:function(){var t=this,e=document.getElementById("product-grid").dataset.id;window.currentPage++;var r=this.getQueryForBlogPagination(e);fetch(r).then((function(t){return t.text()})).then((function(n){var o=(new DOMParser).parseFromString(n,"text/html").querySelector('[id*="'.concat(e,'"]')).innerHTML;t.renderPostGrid(o);var i=new URLSearchParams(r);i.delete("section_id"),history.pushState(null,null,"?"+i.toString())}))}},{key:"renderPostGrid",value:function(t){var e=(new DOMParser).parseFromString(t,"text/html"),r=e.getElementById("product-grid"),n=r.innerHTML,o=parseInt(e.querySelector(".js-product-count").innerHTML),i=parseInt(e.querySelector(".js-total-product-count").innerHTML);document.querySelector(".js-product-count").innerHTML=o>=i?i:o,r.querySelector(".template-main-collection__item")&&document.getElementById("product-grid").insertAdjacentHTML("beforeend",n),o>=i&&(document.querySelector(".js-collection-load-more").style.display="none")}}]),o}(l(HTMLElement));customElements.define("collection-load-more",v)}();