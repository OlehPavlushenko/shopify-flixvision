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

        this.resizeFunction = this.resizeFunction.bind(this)
        this.showMegaMenu = this.showMegaMenu.bind(this)
        this.showMobileMenu = this.showMobileMenu.bind(this)
        // Инициализация
        this.init()

        // Обработчик изменения размера окна
        window.addEventListener("resize", this.resizeFunction)

        // Обработчики событий клика и нажатия клавиши "Enter"
        this.megaSubMenuWrappers.forEach((wrapper) => {
            let currentTarget = Array.from(
                wrapper.querySelectorAll(".js-mega-submenu-next-button")
            )
            currentTarget.forEach((details) => {
                details.addEventListener("click", this.showMegaMenu)
                details.addEventListener("keypress", this.showMegaMenu)
            })
        })

        this.menuToggles.forEach((menuToggle) => {
            menuToggle.addEventListener("click", this.showMobileMenu)
            menuToggle.addEventListener("keypress", this.showMobileMenu)
        })

        this.menuBacks.forEach((menuBack) => {
            menuBack.addEventListener("click", this.closeMegaMenu)
            menuBack.addEventListener("keypress", this.closeMegaMenu)
        })

        this.submenuBacks.forEach((submenuBack) => {
            submenuBack.addEventListener("click", this.closeMegaSubMenu)
            submenuBack.addEventListener("keypress", this.closeMegaSubMenu)
        })

        // Обработчик нажатия клавиши "Escape"
        this.addEventListener("keyup", this.onKeyUp)
    }

    // Инициализация
    init() {
        this.resizeFunction()
    }

    // Обработчик изменения размера окна
    resizeFunction() {
        const mobile = window.matchMedia("(max-width: 991px)").matches

        this.megaMenuWrappers.forEach((wrapper) => {
            const currentTarget = Array.from(
                wrapper.querySelectorAll(".js-mega-parent-next-button")
            )

            if (mobile) {
                currentTarget.forEach((details) => {
                    details.addEventListener("click", this.showMegaMenu)
                    details.addEventListener("keypress", this.showMegaMenu)
                })
            } else {
                wrapper.addEventListener("click", (evt) => {
                    if (evt.target.closest(".header__menu-item-summary")) {
                        this.showDesktopMegaMenu(evt)
                    }
                })

                this.addEventListener("keyup", (event) => {
                    if (event.key === "Escape") {
                        this.closeMegaMenu(event)
                    }
                })
            }
        })
    }

    // Показать мобильное меню
    showMobileMenu(event) {
        event.preventDefault()

        this.mobileMenu.classList.toggle("menu-opening")
        this.mobileMenuOverlay.classList.toggle("menu-opening")
        document.body.classList.toggle("overflow-hidden")
    }

    // Закрыть мобильное меню
    closeMobileMenu() {
        this.mobileMenu.classList.remove("menu-opening")
        this.mobileMenuOverlay.classList.remove("menu-opening")
        trapFocus(this)
        document.body.classList.remove("overflow-hidden")
    }

    // Обработчик клика вне элемента
    onBodyClick(event) {
        const targetElement = event.target.closest(".js-mega-menu-wrapper")

        if (!targetElement) {
            this.closeMegaMenu(event)
        }
    }

    // Показать мега-меню на десктопе
    showDesktopMegaMenu(event) {
        event.preventDefault()
        const megaMenuCurrent = event.currentTarget
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

    // Показать мега-меню
    showMegaMenu(event) {
        event.preventDefault()

        const details = event.target

        if (!details.classList.contains("js-mega-parent-next-button")) {
            const megaSubmenu = event.target
                .closest(".js-mega-submenu-wrapper")
                .querySelector(".js-mega-submenu")
            megaSubmenu.classList.toggle("mega-menu--open")
        } else {
            const megaMenu = event.target
                .closest(".js-mega-menu-wrapper")
                .querySelector(".js-mega-menu")
            megaMenu.classList.toggle("mega-menu--open")
        }
    }

    // Закрыть мега-меню
    closeMegaMenu(event) {
        event.target.blur()
        if (event.target.closest(".js-mega-menu-wrapper")) {
            const openElement = event.target.closest(".js-mega-menu-wrapper")
            const openElementActive = event.target
                .closest(".header__menu-item-details")
                .querySelector(".header__menu-item-link")
            trapFocus(openElement, openElementActive)
        }

        this.megaMenus.forEach((megaMenu) => {
            megaMenu.classList.remove("mega-menu--open")
        })
    }

    // Закрыть подменю мега-меню
    closeMegaSubMenu(event) {
        console.log(event)
        if (event.target.closest(".js-mega-submenu-wrapper")) {
            const openElement = event.target.closest(".js-mega-submenu-wrapper")
            const openElementActive = event.target
                .closest(".js-mega-submenu-wrapper")
                .querySelector(".js-mega-menu-title")

            trapFocus(openElement, openElementActive)
        }

        this.megaSubmenus.forEach((megaSubmenu) => {
            megaSubmenu.classList.remove("mega-menu--open")
        })
    }

    // Обработчик нажатия клавиши
    onKeyUp(event) {
        const targetClassList = event.target.classList
        const targetParentClassList = event.target.parentNode.classList

        if (
            targetClassList.contains("js-menu-toggle") ||
            targetParentClassList.contains("header__menu-item-link")
        ) {
            this.closeMobileMenu()
        }

        if (
            targetClassList.contains("js-mega-parent-next-button") ||
            targetClassList.contains("js-mega-menu-title") ||
            targetClassList.contains("js-submenu-back") ||
            targetParentClassList.contains("mega-menu__list-column-title")
        ) {
            this.closeMegaMenu(event)
        }

        if (
            targetClassList.contains("js-mega-submenu-next-button") ||
            targetParentClassList.contains("mega-menu__list") ||
            targetParentClassList.contains("js-mega-submenu-row") ||
            targetParentClassList.contains("mega-menu__list-item-link")
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

        this.setHeaderHeight()

        window
            .matchMedia("(min-width: 320px)")
            .addEventListener("change", this.setHeaderHeight.bind(this))

        if (this.headerIsAlwaysSticky) {
            this.header.classList.add("shopify-section-header-sticky")
        }

        this.currentScrollTop = 0
        this.preventReveal = false

        this.onScrollHandler = this.onScroll.bind(this)
        this.hideHeaderOnScrollUp = () => (this.preventReveal = true)

        this.addEventListener("preventHeaderReveal", this.hideHeaderOnScrollUp)
        window.addEventListener("scroll", this.onScrollHandler, false)

        this.createObserver()
    }

    // Установить высоту шапки
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

    disconnectedCallback() {
        this.removeEventListener(
            "preventHeaderReveal",
            this.hideHeaderOnScrollUp
        )
        window.removeEventListener("scroll", this.onScrollHandler)
    }

    createObserver() {
        const observer = new IntersectionObserver((entries, observer) => {
            this.headerBounds = entries[0].intersectionRect
            observer.disconnect()
        })

        observer.observe(this.header)
    }

    // Обработчик прокрутки страницы
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
        } else if (
            scrollTop < this.currentScrollTop &&
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
}

customElements.define("sticky-header", SectionHeader)
