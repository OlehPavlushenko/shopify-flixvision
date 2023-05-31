class SectionHeader extends HTMLElement {
    constructor() {
        super()

        this.headerMain = document.querySelector(".js-header-main")
        this.megaMenuWrappers = Array.from(
            this.querySelectorAll(".js-mega-menu-wrapper")
        )
        this.megaSubMenuWrappers = Array.from(
            this.querySelectorAll(".js-mega-submenu-wrapper")
        )

        this.megaMenus = Array.from(this.querySelectorAll(".js-mega-menu"))
        this.megaSubmenus = Array.from(
            this.querySelectorAll(".js-mega-submenu")
        )
        this.menuToggles = Array.from(this.querySelectorAll(".js-menu-toggle"))
        this.menuBacks = Array.from(this.querySelectorAll(".js-menu-back"))
        this.submenuBacks = Array.from(
            this.querySelectorAll(".js-submenu-back")
        )

        this.mobileMenu = this.querySelector(".js-mobile-menu")
        this.mobileMenuOverlay = this.querySelector(".js-mobile-menu-overlay")

        this.resizeFunction()
        window.addEventListener("resize", this.resizeFunction.bind(this))
        ;["click", "enter"].forEach((event) => {
            this.megaSubMenuWrappers.forEach((wrapper) => {
                let currentTarget = Array.from(
                    wrapper.querySelectorAll(".js-mega-submenu-next-button")
                )
                currentTarget.forEach((details) => {
                    details.addEventListener(
                        event,
                        this.showMegaMenu.bind(this)
                    )
                })
            })
            this.menuToggles.forEach((menuToggle) => {
                menuToggle.addEventListener(
                    event,
                    this.showMobileMenu.bind(this)
                )
            })
            this.menuBacks.forEach((menuBack) => {
                menuBack.addEventListener(event, this.closeMegaMenu.bind(this))
            })
            this.submenuBacks.forEach((submenuBack) => {
                submenuBack.addEventListener(
                    event,
                    this.closeMegaSubMenu.bind(this)
                )
            })
        })

        this.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                this.onKeyUp(event)
            }
        })
    }

    resizeFunction() {
        let mobile = window.matchMedia("(max-width: 991px)").matches

        ;["click", "enter"].forEach((event) =>
            this.megaMenuWrappers.forEach((wrapper) => {
                if (mobile) {
                    let currentTarget = Array.from(
                        wrapper.querySelectorAll(".js-mega-parent-next-button")
                    )
                    currentTarget.forEach((details) => {
                        details.addEventListener(
                            event,
                            this.showMegaMenu.bind(this)
                        )
                    })
                } else {
                    wrapper.addEventListener(event, (evt) => {
                        if (evt.target.closest(".header__menu-item-summary")) {
                            this.showDesktopMegaMenu(evt)
                        }
                    })

                    this.addEventListener("keydown", (event) => {
                        if (event.key === "Escape") {
                            this.closeMegaMenu(event)
                        }
                    })
                }
            })
        )
    }

    showMobileMenu(event) {
        event.preventDefault()

        this.mobileMenu.classList.toggle("menu-opening")
        this.mobileMenuOverlay.classList.toggle("menu-opening")
        document.body.classList.toggle("overflow-hidden")
    }

    closeMobileMenu() {
        this.mobileMenu.classList.remove("menu-opening")
        this.mobileMenuOverlay.classList.remove("menu-opening")
        trapFocus(this)
        document.body.classList.remove("overflow-hidden")
    }

    onBodyClick(event) {
        const targetElement = event.target.closest(".js-mega-menu-wrapper")

        if (!targetElement) {
            this.closeMegaMenu(event)
        }
    }

    showDesktopMegaMenu(event) {
        event.preventDefault()
        let megaMenuCurrent = event.currentTarget
            .closest(".js-mega-menu-wrapper")
            .querySelector(".js-mega-menu")

        this.megaMenus.forEach((megaMenu) => {
            if (!megaMenuCurrent.classList.contains("mega-menu--open")) {
                megaMenu.classList.remove("mega-menu--open")
            }
        })
        megaMenuCurrent.classList.toggle("mega-menu--open")
        document.body.addEventListener("click", this.onBodyClick.bind(this))
    }

    showMegaMenu(event) {
        event.preventDefault()

        let details = event.target

        if (!details.classList.contains("js-mega-parent-next-button")) {
            let megaSubmenu = event.target
                .closest(".js-mega-submenu-wrapper")
                .querySelector(".js-mega-submenu")
            megaSubmenu.classList.toggle("mega-menu--open")
        } else {
            let megaMenu = event.target
                .closest(".js-mega-menu-wrapper")
                .querySelector(".js-mega-menu")
            megaMenu.classList.toggle("mega-menu--open")
        }
    }

    closeMegaMenu(event) {
        event.target.blur()
        if (event.target.closest(".js-mega-menu-wrapper")) {
            let openElement = event.target.closest(".js-mega-menu-wrapper")
            let openElementActive = event.target
                .closest(".header__menu-item-details")
                .querySelector(".header__menu-item-link")
            trapFocus(openElement, openElementActive)
        }

        this.megaMenus.forEach((megaMenu) => {
            megaMenu.classList.remove("mega-menu--open")
        })
    }

    closeMegaSubMenu(event) {
        //console.log(event)
        if (event.target.closest(".js-mega-submenu-wrapper")) {
            let openElement = event.target.closest(".js-mega-submenu-wrapper")
            let openElementActive = event.target
                .closest(".js-mega-submenu-wrapper")
                .querySelector(".js-mega-menu-title")

            trapFocus(openElement, openElementActive)
        }

        this.megaSubmenus.forEach((megaSubmenu) => {
            megaSubmenu.classList.remove("mega-menu--open")
        })
    }

    onKeyUp(event) {
        if (
            event.target.classList.contains("js-menu-toggle") ||
            event.target.classList.contains("header__menu-item-link")
        ) {
            this.closeMobileMenu()
        }

        if (
            event.target.classList.contains("js-mega-parent-next-button") ||
            event.target.classList.contains("js-mega-menu-title") ||
            event.target.classList.contains("js-submenu-back") ||
            event.target.classList.contains("mega-menu__list-column-title")
        ) {
            this.closeMegaMenu(event)
        }

        if (
            event.target.classList.contains("js-mega-submenu-next-button") ||
            event.target.classList.contains("mega-menu__list") ||
            event.target.classList.contains("js-mega-submenu-row") ||
            event.target.classList.contains("mega-menu__list-item-link")
        ) {
            this.closeMegaSubMenu(event)
        }
    }

    connectedCallback() {
        this.stickyBlock = document.querySelector(".js-sticky-block")
        this.header = document.querySelector(".section-header")
        this.announcement = document.querySelector(".index-announcement")
        this.headerIsAlwaysSticky =
            this.getAttribute("data-sticky-type") === "always"
        this.headerBounds = {}

        if (this.headerIsAlwaysSticky) {
            this.header.classList.add("shopify-section-header-sticky")
        }

        this.currentScrollTop = 0
        this.preventReveal = false

        this.onScrollHandler = this.onScroll.bind(this)

        this.setHeaderHeight()
        window
            .matchMedia("(min-width: 320px)")
            .addEventListener("change", this.setHeaderHeight.bind(this))

        window.addEventListener("scroll", this.onScrollHandler, false)
        window.addEventListener("load", this.checkScroll.bind(this))
        this.createObserver()
    }

    checkScroll() {
        console.log(this.headerBounds.top)
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop
        console.log(scrollTop)
        if (scrollTop > 0 && scrollTop > this.headerBounds.top) {
            this.header.classList.add("scrolled-past-header")
            this.stickyBlock.style.setProperty(
                "height",
                `${this.header.offsetHeight}px`
            )
        } else if (scrollTop <= this.headerBounds.top) {
            this.header.classList.remove("scrolled-past-header")
            this.stickyBlock.style.setProperty("height", "0")
        }
    }

    createObserver() {
        let observer = new IntersectionObserver((entries, observer) => {
            const headerRect = this.header.getBoundingClientRect()
            this.headerBounds = {
                top: headerRect.top + window.pageYOffset,
                bottom: headerRect.bottom + window.pageYOffset,
            }
            observer.disconnect()
        })

        observer.observe(this.header)
    }

    onScroll() {
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop

        if (
            scrollTop > this.currentScrollTop &&
            scrollTop > this.headerBounds.bottom
        ) {
            this.header.classList.add("scrolled-past-header")
            this.stickyBlock.style.setProperty(
                "height",
                `${this.header.offsetHeight}px`
            )
        } else if (scrollTop <= this.headerBounds.top) {
            this.header.classList.remove("scrolled-past-header")
            this.stickyBlock.style.setProperty("height", "0")
        }

        this.currentScrollTop = scrollTop
    }

    setHeaderHeight() {
        document.documentElement.style.setProperty(
            "--header-height",
            `${this.header.offsetHeight}px`
        )
        document.documentElement.style.setProperty(
            "--announcement-bar-height",
            `${this.announcement.offsetHeight}px`
        )
    }
}

customElements.define("sticky-header", SectionHeader)
