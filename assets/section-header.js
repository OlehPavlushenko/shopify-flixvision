class SectionHeader extends HTMLElement{constructor(){super(),this.headerMain=document.querySelector(".js-header-main"),this.megaMenuWrappers=Array.from(this.querySelectorAll(".js-mega-menu-wrapper")),this.megaSubMenuWrappers=Array.from(this.querySelectorAll(".js-mega-submenu-wrapper")),this.megaMenus=Array.from(this.querySelectorAll(".js-mega-menu")),this.megaSubmenus=Array.from(this.querySelectorAll(".js-mega-submenu")),this.menuToggles=Array.from(this.querySelectorAll(".js-menu-toggle")),this.menuBacks=Array.from(this.querySelectorAll(".js-menu-back")),this.submenuBacks=Array.from(this.querySelectorAll(".js-submenu-back")),this.mobileMenu=this.querySelector(".js-mobile-menu"),this.mobileMenuOverlay=this.querySelector(".js-mobile-menu-overlay"),this.resizeFunction=this.resizeFunction.bind(this),this.showMegaMenu=this.showMegaMenu.bind(this),this.showMobileMenu=this.showMobileMenu.bind(this),this.init(),window.addEventListener("resize",this.resizeFunction),this.megaSubMenuWrappers.forEach((e=>{Array.from(e.querySelectorAll(".js-mega-submenu-next-button")).forEach((e=>{e.addEventListener("click",this.showMegaMenu),e.addEventListener("keypress",this.showMegaMenu)}))})),this.menuToggles.forEach((e=>{e.addEventListener("click",this.showMobileMenu),e.addEventListener("keypress",this.showMobileMenu)})),this.menuBacks.forEach((e=>{e.addEventListener("click",this.closeMegaMenu),e.addEventListener("keypress",this.closeMegaMenu)})),this.submenuBacks.forEach((e=>{e.addEventListener("click",this.closeMegaSubMenu),e.addEventListener("keypress",this.closeMegaSubMenu)})),this.addEventListener("keyup",this.onKeyUp)}init(){this.resizeFunction()}resizeFunction(){const e=window.matchMedia("(max-width: 991px)").matches;this.megaMenuWrappers.forEach((t=>{const s=Array.from(t.querySelectorAll(".js-mega-parent-next-button"));e?s.forEach((e=>{e.addEventListener("click",this.showMegaMenu),e.addEventListener("keypress",this.showMegaMenu)})):(t.addEventListener("click",(e=>{e.target.closest(".header__menu-item-summary")&&this.showDesktopMegaMenu(e)})),this.addEventListener("keyup",(e=>{"Escape"===e.key&&this.closeMegaMenu(e)})))}))}showMobileMenu(e){e.preventDefault(),this.mobileMenu.classList.toggle("menu-opening"),this.mobileMenuOverlay.classList.toggle("menu-opening"),document.body.classList.toggle("overflow-hidden")}closeMobileMenu(){this.mobileMenu.classList.remove("menu-opening"),this.mobileMenuOverlay.classList.remove("menu-opening"),trapFocus(this),document.body.classList.remove("overflow-hidden")}onBodyClick(e){e.target.closest(".js-mega-menu-wrapper")||this.closeMegaMenu(e)}showDesktopMegaMenu(e){e.preventDefault();const t=e.currentTarget.closest(".js-mega-menu-wrapper").querySelector(".js-mega-menu");this.megaMenus.forEach((e=>{t.classList.contains("mega-menu--open")||e.classList.remove("mega-menu--open")})),t.classList.toggle("mega-menu--open"),document.body.addEventListener("click",this.onBodyClick.bind(this))}showMegaMenu(e){e.preventDefault();if(e.target.classList.contains("js-mega-parent-next-button")){e.target.closest(".js-mega-menu-wrapper").querySelector(".js-mega-menu").classList.toggle("mega-menu--open")}else{e.target.closest(".js-mega-submenu-wrapper").querySelector(".js-mega-submenu").classList.toggle("mega-menu--open")}}closeMegaMenu(e){if(e.target.blur(),e.target.closest(".js-mega-menu-wrapper")){const t=e.target.closest(".js-mega-menu-wrapper"),s=e.target.closest(".header__menu-item-details").querySelector(".header__menu-item-link");trapFocus(t,s)}this.megaMenus.forEach((e=>{e.classList.remove("mega-menu--open")}))}closeMegaSubMenu(e){if(console.log(e),e.target.closest(".js-mega-submenu-wrapper")){const t=e.target.closest(".js-mega-submenu-wrapper"),s=e.target.closest(".js-mega-submenu-wrapper").querySelector(".js-mega-menu-title");trapFocus(t,s)}this.megaSubmenus.forEach((e=>{e.classList.remove("mega-menu--open")}))}onKeyUp(e){const t=e.target.classList,s=e.target.parentNode.classList;(t.contains("js-menu-toggle")||s.contains("header__menu-item-link"))&&this.closeMobileMenu(),(t.contains("js-mega-parent-next-button")||t.contains("js-mega-menu-title")||t.contains("js-submenu-back")||s.contains("mega-menu__list-column-title"))&&this.closeMegaMenu(e),(t.contains("js-mega-submenu-next-button")||s.contains("mega-menu__list")||s.contains("js-mega-submenu-row")||s.contains("mega-menu__list-item-link"))&&this.closeMegaSubMenu(e)}connectedCallback(){this.stickyBlock=document.querySelector(".js-sticky-block"),this.header=document.querySelector(".section-header"),this.announcement=document.querySelector(".index-announcement"),this.headerIsAlwaysSticky="always"===this.getAttribute("data-sticky-type"),this.headerBounds={},this.setHeaderHeight(),window.matchMedia("(min-width: 320px)").addEventListener("change",this.setHeaderHeight.bind(this)),this.headerIsAlwaysSticky&&this.header.classList.add("shopify-section-header-sticky"),this.currentScrollTop=0,this.preventReveal=!1,this.onScrollHandler=this.onScroll.bind(this),this.hideHeaderOnScrollUp=()=>this.preventReveal=!0,this.addEventListener("preventHeaderReveal",this.hideHeaderOnScrollUp),window.addEventListener("scroll",this.onScrollHandler,!1),this.createObserver()}setHeaderHeight(){document.documentElement.style.setProperty("--header-height",`${this.header.offsetHeight}px`),document.documentElement.style.setProperty("--announcement-bar-height",`${this.announcement.offsetHeight}px`)}disconnectedCallback(){this.removeEventListener("preventHeaderReveal",this.hideHeaderOnScrollUp),window.removeEventListener("scroll",this.onScrollHandler)}createObserver(){new IntersectionObserver(((e,t)=>{this.headerBounds=e[0].intersectionRect,t.disconnect()})).observe(this.header)}onScroll(){const e=window.pageYOffset||document.documentElement.scrollTop;e>this.currentScrollTop&&e>this.headerBounds.bottom||e<this.currentScrollTop&&e>this.headerBounds.bottom?(this.header.classList.add("scrolled-past-header"),this.stickyBlock.style.setProperty("height",`${this.header.offsetHeight}px`)):e<=this.headerBounds.top&&(this.header.classList.remove("scrolled-past-header"),this.stickyBlock.style.setProperty("height","0")),this.currentScrollTop=e}}customElements.define("sticky-header",SectionHeader);