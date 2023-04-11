const selectors={customerAddresses:"[data-customer-addresses]",addressCountrySelect:"[data-address-country-select]",addressContainer:"[data-address]",modalContainer:"[data-address-modal]",toggleAddressButton:"button[aria-expanded]",cancelAddressButton:'button[type="reset"]',deleteAddressButton:"button[data-confirm-message]"},attributes={expanded:"aria-expanded",confirmMessage:"data-confirm-message"};class CustomerAddresses{constructor(){this.elements=this._getElements(),0!==Object.keys(this.elements).length&&(this._setupCountries(),this._setupEventListeners())}_getElements(){const e=document.querySelector(selectors.customerAddresses);return e?{container:e,addressContainer:e.querySelector(selectors.addressContainer),toggleButtons:document.querySelectorAll(selectors.toggleAddressButton),cancelButtons:e.querySelectorAll(selectors.cancelAddressButton),deleteButtons:e.querySelectorAll(selectors.deleteAddressButton),countrySelects:e.querySelectorAll(selectors.addressCountrySelect)}:{}}_setupCountries(){Shopify&&Shopify.CountryProvinceSelector&&(new Shopify.CountryProvinceSelector("AddressCountryNew","AddressProvinceNew",{hideElement:"AddressProvinceContainerNew"}),this.elements.countrySelects.forEach((e=>{const t=e.dataset.formId;new Shopify.CountryProvinceSelector(`AddressCountry_${t}`,`AddressProvince_${t}`,{hideElement:`AddressProvinceContainer_${t}`})})))}_setupEventListeners(){this.elements.toggleButtons.forEach((e=>{e.addEventListener("click",this._handleAddEditButtonClick)})),this.elements.cancelButtons.forEach((e=>{e.addEventListener("click",this._handleCancelButtonClick)})),this.elements.deleteButtons.forEach((e=>{e.addEventListener("click",this._handleDeleteButtonClick)})),document.addEventListener("keydown",this._handleEscKeyPress)}_toggleBodyScroll(){const e=document.body.classList,t="overflow-hidden";e.contains(t)?e.remove(t):e.add(t)}_toggleExpanded(e){e.setAttribute(attributes.expanded,("false"===e.getAttribute(attributes.expanded)).toString())}_handleAddEditButtonClick=({currentTarget:e})=>{this._toggleExpanded(e);const t=e.parentNode.querySelector(selectors.modalContainer);this._toggleBodyScroll(),trapFocus(t,t.querySelector("input[id]"))};_handleCancelButtonClick=({currentTarget:e})=>{const t=e.closest(selectors.addressContainer).querySelector(`[${attributes.expanded}]`);this._toggleExpanded(t),this._toggleBodyScroll(),removeTrapFocus(t)};_handleEscKeyPress=e=>{if(!("Escape"===e.key||27===e.keyCode))return;const t=document.querySelector("[aria-expanded='true']");this._toggleExpanded(t),removeTrapFocus(t)};_handleDeleteButtonClick=({currentTarget:e})=>{confirm(e.getAttribute(attributes.confirmMessage))&&Shopify.postLink(e.dataset.target,{parameters:{_method:"delete"}})}}