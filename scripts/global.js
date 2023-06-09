/*
 * Shopify Common JS
 *
 */
if (typeof window.Shopify == "undefined") {
    window.Shopify = {}
}

Shopify.bind = function (fn, scope) {
    return function () {
        return fn.apply(scope, arguments)
    }
}

Shopify.setSelectorByValue = function (selector, value) {
    for (var i = 0, count = selector.options.length; i < count; i++) {
        var option = selector.options[i]
        if (value == option.value || value == option.innerHTML) {
            selector.selectedIndex = i
            return i
        }
    }
}

Shopify.addListener = function (target, eventName, callback) {
    target.addEventListener
        ? target.addEventListener(eventName, callback, false)
        : target.attachEvent("on" + eventName, callback)
}

Shopify.postLink = function (path, options) {
    options = options || {}
    var method = options["method"] || "post"
    var params = options["parameters"] || {}

    var form = document.createElement("form")
    form.setAttribute("method", method)
    form.setAttribute("action", path)

    for (var key in params) {
        var hiddenField = document.createElement("input")
        hiddenField.setAttribute("type", "hidden")
        hiddenField.setAttribute("name", key)
        hiddenField.setAttribute("value", params[key])
        form.appendChild(hiddenField)
    }
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
}

Shopify.CountryProvinceSelector = function (
    country_domid,
    province_domid,
    options
) {
    this.countryEl = document.getElementById(country_domid)
    this.provinceEl = document.getElementById(province_domid)
    this.provinceContainer = document.getElementById(
        options["hideElement"] || province_domid
    )

    Shopify.addListener(
        this.countryEl,
        "change",
        Shopify.bind(this.countryHandler, this)
    )

    this.initCountry()
    this.initProvince()
}

Shopify.CountryProvinceSelector.prototype = {
    initCountry: function () {
        var value = this.countryEl.getAttribute("data-default")
        Shopify.setSelectorByValue(this.countryEl, value)
        this.countryHandler()
    },

    initProvince: function () {
        var value = this.provinceEl.getAttribute("data-default")
        if (value && this.provinceEl.options.length > 0) {
            Shopify.setSelectorByValue(this.provinceEl, value)
        }
    },

    countryHandler: function (e) {
        var opt = this.countryEl.options[this.countryEl.selectedIndex]
        var raw = opt.getAttribute("data-provinces")
        var provinces = JSON.parse(raw)

        this.clearOptions(this.provinceEl)
        if (provinces && provinces.length == 0) {
            this.provinceContainer.style.display = "none"
        } else {
            for (var i = 0; i < provinces.length; i++) {
                var opt = document.createElement("option")
                opt.value = provinces[i][0]
                opt.innerHTML = provinces[i][1]
                this.provinceEl.appendChild(opt)
            }

            this.provinceContainer.style.display = ""
        }
    },

    clearOptions: function (selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild)
        }
    },

    setOptions: function (selector, values) {
        for (var i = 0, count = values.length; i < values.length; i++) {
            var opt = document.createElement("option")
            opt.value = values[i]
            opt.innerHTML = values[i]
            selector.appendChild(opt)
        }
    },
}

Shopify.formatMoney = function (cents, format) {
    if (typeof cents == "string") {
        cents = cents.replace(".", "")
    }
    var value = ""
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/
    var formatString = format || this.money_format

    function defaultOption(opt, def) {
        return typeof opt == "undefined" ? def : opt
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2)
        thousands = defaultOption(thousands, ",")
        decimal = defaultOption(decimal, ".")

        if (isNaN(number) || number == null) {
            return 0
        }

        number = (number / 100.0).toFixed(precision)

        var parts = number.split("."),
            dollars = parts[0].replace(
                /(\d)(?=(\d\d\d)+(?!\d))/g,
                "$1" + thousands
            ),
            cents = parts[1] ? decimal + parts[1] : ""

        return dollars + cents
    }

    switch (formatString.match(placeholderRegex)[1]) {
        case "amount":
            value = formatWithDelimiters(cents, 2)
            break
        case "amount_no_decimals":
            value = formatWithDelimiters(cents, 0)
            break
        case "amount_with_comma_separator":
            value = formatWithDelimiters(cents, 2, ".", ",")
            break
        case "amount_no_decimals_with_comma_separator":
            value = formatWithDelimiters(cents, 0, ".", ",")
            break
    }

    return formatString.replace(placeholderRegex, value)
}

class MenuDrawer extends HTMLElement {
    constructor() {
        super()

        this.mainDetailsToggle = this.querySelector("details")

        this.addEventListener("keyup", this.onKeyUp.bind(this))
        this.addEventListener("focusout", this.onFocusOut.bind(this))
        this.bindEvents()
    }

    bindEvents() {
        this.querySelectorAll("summary").forEach((summary) =>
            summary.addEventListener("click", this.onSummaryClick.bind(this))
        )
        this.querySelectorAll("button:not(.localization-selector)").forEach(
            (button) =>
                button.addEventListener(
                    "click",
                    this.onCloseButtonClick.bind(this)
                )
        )
    }

    onKeyUp(event) {
        if (event.code.toUpperCase() !== "ESCAPE") return

        const openDetailsElement = event.target.closest("details[open]")
        if (!openDetailsElement) return

        openDetailsElement === this.mainDetailsToggle
            ? this.closeMenuDrawer(
                  event,
                  this.mainDetailsToggle.querySelector("summary")
              )
            : this.closeSubmenu(openDetailsElement)
    }

    onSummaryClick(event) {
        const summaryElement = event.currentTarget
        const detailsElement = summaryElement.parentNode
        const parentMenuElement = detailsElement.closest(".has-submenu")
        const isOpen = detailsElement.hasAttribute("open")
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        )

        function addTrapFocus() {
            trapFocus(
                summaryElement.nextElementSibling,
                detailsElement.querySelector("button")
            )
            summaryElement.nextElementSibling.removeEventListener(
                "transitionend",
                addTrapFocus
            )
        }

        if (detailsElement === this.mainDetailsToggle) {
            if (isOpen) event.preventDefault()
            isOpen
                ? this.closeMenuDrawer(event, summaryElement)
                : this.openMenuDrawer(summaryElement)

            if (window.matchMedia("(max-width: 990px)")) {
                document.documentElement.style.setProperty(
                    "--viewport-height",
                    `${window.innerHeight}px`
                )
            }
        } else {
            setTimeout(() => {
                detailsElement.classList.add("menu-opening")
                summaryElement.setAttribute("aria-expanded", true)
                parentMenuElement &&
                    parentMenuElement.classList.add("submenu-open")
                !reducedMotion || reducedMotion.matches
                    ? addTrapFocus()
                    : summaryElement.nextElementSibling.addEventListener(
                          "transitionend",
                          addTrapFocus
                      )
            }, 100)
        }
    }

    openMenuDrawer(summaryElement) {
        setTimeout(() => {
            this.mainDetailsToggle.classList.add("menu-opening")
        })
        summaryElement.setAttribute("aria-expanded", true)
        trapFocus(this.mainDetailsToggle, summaryElement)
        document.body.classList.add(
            `overflow-hidden-${this.dataset.breakpoint}`
        )
    }

    closeMenuDrawer(event, elementToFocus = false) {
        if (event === undefined) return

        this.mainDetailsToggle.classList.remove("menu-opening")
        this.mainDetailsToggle
            .querySelectorAll("details")
            .forEach((details) => {
                details.removeAttribute("open")
                details.classList.remove("menu-opening")
            })
        this.mainDetailsToggle
            .querySelectorAll(".submenu-open")
            .forEach((submenu) => {
                submenu.classList.remove("submenu-open")
            })
        document.body.classList.remove(
            `overflow-hidden-${this.dataset.breakpoint}`
        )
        removeTrapFocus(elementToFocus)
        this.closeAnimation(this.mainDetailsToggle)
    }

    onFocusOut() {
        setTimeout(() => {
            if (
                this.mainDetailsToggle.hasAttribute("open") &&
                !this.mainDetailsToggle.contains(document.activeElement)
            )
                this.closeMenuDrawer()
        })
    }

    onCloseButtonClick(event) {
        const detailsElement = event.currentTarget.closest("details")
        this.closeSubmenu(detailsElement)
    }

    closeSubmenu(detailsElement) {
        const parentMenuElement = detailsElement.closest(".submenu-open")
        parentMenuElement && parentMenuElement.classList.remove("submenu-open")
        detailsElement.classList.remove("menu-opening")
        detailsElement
            .querySelector("summary")
            .setAttribute("aria-expanded", false)
        removeTrapFocus(detailsElement.querySelector("summary"))
        this.closeAnimation(detailsElement)
    }

    closeAnimation(detailsElement) {
        let animationStart

        const handleAnimation = (time) => {
            if (animationStart === undefined) {
                animationStart = time
            }

            const elapsedTime = time - animationStart

            if (elapsedTime < 400) {
                window.requestAnimationFrame(handleAnimation)
            } else {
                detailsElement.removeAttribute("open")
                if (detailsElement.closest("details[open]")) {
                    trapFocus(
                        detailsElement.closest("details[open]"),
                        detailsElement.querySelector("summary")
                    )
                }
            }
        }

        window.requestAnimationFrame(handleAnimation)
    }
}

customElements.define("menu-drawer", MenuDrawer)

class DeferredMedia extends HTMLElement {
    constructor() {
        super()
        this.querySelector('[id^="Deferred-Poster-"]')?.addEventListener(
            "click",
            this.loadContent.bind(this)
        )
    }

    loadContent() {
        if (!this.getAttribute("loaded")) {
            const content = document.createElement("div")
            content.appendChild(
                this.querySelector(
                    "template"
                ).content.firstElementChild.cloneNode(true)
            )

            this.setAttribute("loaded", true)
            //window.pauseAllMedia()
            this.appendChild(
                content.querySelector("video, model-viewer, iframe")
            ).focus()

            setTimeout(() => {
                const video = this.querySelector("template").nextElementSibling
                video.muted = video.dataset.muted === "true"
                video.play()
            })
        }
    }
}

customElements.define("deferred-media", DeferredMedia)

class QuantityInput extends HTMLElement {
    constructor() {
        super()
        this.input = this.querySelector("input")

        this.changeEvent = new Event("change", { bubbles: true })

        this.querySelectorAll("button").forEach((button) =>
            button.addEventListener("click", this.onButtonClick.bind(this))
        )
    }

    onButtonClick(event) {
        event.preventDefault()
        const previousValue = this.input.value

        event.target.name === "plus"
            ? this.input.stepUp()
            : this.input.stepDown()

        if (previousValue !== this.input.value)
            this.input.dispatchEvent(this.changeEvent)
        this.changeValue(this.input.value)
    }

    changeValue(newValue) {
        this.input.value = newValue
        this.input.dispatchEvent(this.changeEvent)
    }
}

customElements.define("quantity-input", QuantityInput)

class VariantPills extends HTMLElement {
    constructor() {
        super()

        this.swatchElements = this.querySelectorAll(".js-swatch-element")
        this.swatchLevels = []
        this.getVariantList = {}

        this.initSwatch()
    }

    initSwatch() {
        this.getVariantData()
        console.log(this.variantData)
        this.createNewListVariant(this.variantData)

        console.log(this.getVariantList)

        // Event handler for product option buttons
        const handleClick = (event) => {
            if (event.target.tagName === "INPUT") {
                const selectedValues = Array.from(this.swatchElements).map(
                    (element) => {
                        const input = element.querySelector("input:checked")
                        return input ? input.value : undefined
                    }
                )
                console.log(event)
                this.updateSwatchLevels(selectedValues)
                this.getAvailableVariant(event)
            }
        }

        const delay = 300

        // Installing event handlers on product option buttons
        this.swatchElements.forEach((element) => {
            element.addEventListener("click", this.debounce(handleClick, delay))
        })

        // Check the availability of swatch levels
        this.checkSwatchLevels()
    }

    createNewListVariant(variantData) {
        for (let i = 0; i < variantData.length; i++) {
            const options = variantData[i].options
            const available = variantData[i].available

            let currentLevel = this.getVariantList

            for (let j = 0; j < options.length; j++) {
                const option = options[j]
                const isLastLevel = j === options.length - 1

                if (!currentLevel.hasOwnProperty(option)) {
                    currentLevel[option] = {}
                }

                if (isLastLevel) {
                    currentLevel[option].available = available
                }

                currentLevel = currentLevel[option]
            }
        }
    }

    getActiveSwatchValues() {
        const selectedValues = Array.from(this.swatchElements)
            .map((element) => {
                return element.classList.contains("active")
                    ? element.dataset.swatch
                    : null
            })
            .filter((value) => value !== null)

        console.log("Selected values:", selectedValues)
        return selectedValues
    }

    updateSwatchLevels(selectedValues) {
        const selectedOptions = selectedValues.filter(
            (value) => value !== undefined
        )
        const numLevels = Math.min(
            this.swatchElements.length,
            selectedOptions.length
        )

        for (let i = 0; i < numLevels; i++) {
            const level = this.swatchLevels[i]
            const value = selectedOptions[i]
            const options = Object.keys(level)

            if (value !== undefined) {
                const nextLevel = level[value]
                if (nextLevel) {
                    this.updateSwatchOptions(i + 1, Object.keys(nextLevel))
                }
            } else {
                this.updateSwatchOptions(i + 1, options)
            }
        }
    }

    updateSwatchOptions(levelIndex, options) {
        const swatchElements = this.querySelectorAll(
            `.js-swatch-level-${levelIndex}`
        )
        swatchElements.forEach((element) => {
            const swatch = element.getAttribute("data-swatch")
            const available = options.includes(swatch)

            element.classList.toggle("available", available)
            element.classList.toggle("unavailable", !available)
        })
    }

    checkSwatchLevels() {
        this.swatchLevels = []

        const recursiveCheck = (level, levelIndex, selectedOptions) => {
            const options = Object.keys(level)
            console.log(level)
            if (levelIndex > 0) {
                let previousLevel = this.getVariantList
                for (let i = 0; i < levelIndex; i++) {
                    const option = selectedOptions[i]
                    previousLevel = previousLevel[option]
                }

                if (previousLevel) {
                    const unavailableOptions = Object.keys(previousLevel)

                    const swatchElements = Array.from(
                        this.querySelectorAll(`.js-swatch-level-${levelIndex}`)
                    )
                    swatchElements.forEach((element) => {
                        const option = element.getAttribute("data-option")
                        if (!unavailableOptions.includes(option)) {
                            element.classList.add("hidden")
                        }
                    })
                }
            }

            const availableOptions = options.filter((option) => {
                // Check if the current level is an option
                const isOption =
                    typeof level[option] === "object" &&
                    level[option] !== null &&
                    "available" in level[option]
                // Check the availability of the option if it is an option, otherwise always return true
                return isOption ? level[option].available : true
            })

            if (availableOptions.length > 0) {
                const swatchElement = this.swatchElements[levelIndex]
                console.log(availableOptions)
                if (swatchElement) {
                    this.updateSwatchOptions(levelIndex, availableOptions)
                }

                this.swatchLevels[levelIndex] = availableOptions

                const nextLevelIndex = levelIndex + 1
                if (nextLevelIndex < selectedOptions.length) {
                    let nextLevelOption = selectedOptions[levelIndex]

                    const nextLevel = level[nextLevelOption]
                    if (typeof nextLevel === "object" && nextLevel !== null) {
                        console.log(`Moving to next level: ${nextLevelOption}`)
                        recursiveCheck(
                            nextLevel,
                            nextLevelIndex,
                            selectedOptions
                        )
                    }
                }
            }
        }

        const selectedOptions = this.getActiveSwatchValues()
        // Initialize the swatch elements in this.swatchElements

        recursiveCheck(this.getVariantList, 0, selectedOptions)
    }

    getVariantData() {
        this.variantData =
            this.variantData ||
            JSON.parse(
                this.querySelector('[type="application/json"]').textContent
            )
        return this.variantData
    }

    getAvailableVariant(event) {
        const selectedValues = this.getActiveSwatchValues()
        let currentLevel = this.getVariantList

        for (let i = 0; i < selectedValues.length; i++) {
            const value = selectedValues[i]
            const isLastLevel = i === selectedValues.length - 1

            if (value !== undefined) {
                currentLevel = currentLevel[value]

                if (currentLevel && isLastLevel) {
                    const available = currentLevel.available
                    console.log("Available:", available)
                    // Perform any action based on the available variant
                    // For example, update price, image, etc.
                }
            } else {
                break
            }
        }
    }

    debounce(func, delay) {
        let timeoutId
        return function () {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(func, delay, ...arguments)
        }
    }
}

customElements.define("variant-pills", VariantPills)

class VariantProduct extends VariantPills {
    constructor() {
        super()
        this.layout = document.querySelector(".js-layout-slider")
        this.layoutGrouped = document.querySelector(".js-layout-grouped")
        this.cardProductCount = document.querySelectorAll(
            ".js-card-product-count"
        )
        this.variantSku = document.querySelector(".js-variant-sku")
        this.variantBarcode = document.querySelector(".js-variant-barcode")
    }

    getAvailableVariant(event) {
        const selectedOptions = []
        const products = this.variantData
        this.swatchElement.forEach((element) => {
            let radio = element.firstElementChild
            if (radio.checked) {
                selectedOptions.push(radio.value)
            }
        })

        // Filtering the data array by the selected options
        this.availableVariant = products.filter((product) => {
            return selectedOptions.every((option, index) => {
                return product.options[index] === option
            })
        })

        this.updateOptions(event)
        this.updatePrice()
        this.updateImage()
        this.updateURL()
        this.updatePickupAvailability()
        if (this.layout !== null) {
            this.updateSlider()
        }

        console.log(this.availableVariant[0])

        if (this.layoutGrouped !== null) {
            this.updateSliderGrouped(event)
        }
    }

    updatePickupAvailability() {
        const currentVariant = this.availableVariant[0]
        const pickUpAvailability = document.querySelector("pickup-availability")
        if (!pickUpAvailability) return

        if (currentVariant && currentVariant.available) {
            pickUpAvailability.fetchAvailability(currentVariant.id)
        } else {
            pickUpAvailability.removeAttribute("available")
            pickUpAvailability.innerHTML = ""
        }
    }

    updateOptions(event) {
        const availableVariant = this.availableVariant[0]
        const availableVariantId = availableVariant.id.toString()
        const selectElement = this.querySelector("select")
        const option = selectElement.querySelector(
            `option[value='${availableVariantId}']`
        )
        const inventoryManagement = availableVariant.inventory_management
        const inventoryPolicy = option ? option.dataset.inventoryPolicy : null
        const inventoryQty = option ? option.dataset.qty : null
        //const qtyParentElement = this.qty.parentElement

        if (option) {
            option.selected = true
        }

        if (inventoryManagement === "shopify" && inventoryPolicy === "deny") {
            this.qty.setAttribute("max", inventoryQty)
        } else {
            this.qty.removeAttribute("max")
        }

        if (this.cardProductCount !== null) {
            this.cardProductCount.forEach((element) => {
                element.textContent = inventoryQty
            })
        }

        if (this.variantSku !== null) {
            this.variantSku.textContent = availableVariant.sku
        }

        if (this.variantBarcode !== null) {
            this.variantBarcode.textContent = availableVariant.barcode
        }

        if (inventoryQty < 10) {
            this.stock.classList.remove("card-product__stock--normalstock")
            this.stock.classList.add("card-product__stock--lowstock")
        } else {
            this.stock.classList.remove("card-product__stock--lowstock")
            this.stock.classList.add("card-product__stock--normalstock")
        }

        const isAvailable = availableVariant.available

        if (!isAvailable) {
            const headerSwatch = event.target
                .closest(".swatch--product")
                .querySelector(".js-swatch-header em")
            headerSwatch.textContent = event.target.value
        }
    }

    updateSliderGrouped(event) {
        const selectedVariantId = this.availableVariant[0].id.toString()
        const selectedButton = event.target.closest(".js-element-tab")

        if (selectedButton) {
            const ariaControls = selectedButton.getAttribute("aria-controls")
            const headTabs = document.querySelectorAll(".js-tab")

            headTabs.forEach((tab) => {
                if (tab.getAttribute("aria-controls") === ariaControls) {
                    tab.click()
                }
            })
        }
        const swiperContainer = document.querySelector(
            "#" + this.availableVariant[0].option1 + "-panel .js-gallery"
        )

        if (swiperContainer) {
            const slides = swiperContainer.querySelectorAll(".swiper-slide")

            let slideIndex = -1
            const swiperInstance = swiperContainer.swiper

            if (swiperInstance) {
                slides.forEach((slide, index) => {
                    const variantId = slide.getAttribute("data-variant-id")
                    if (variantId === selectedVariantId) {
                        slideIndex = index
                        return
                    }
                })

                if (slideIndex !== -1) {
                    swiperInstance.slideTo(slideIndex)
                }
            }
        }
    }

    updateSlider() {
        const selectedVariantId = this.availableVariant[0].id.toString()
        const swiperContainer = document.querySelector(".js-gallery")

        if (swiperContainer) {
            const slides = swiperContainer.querySelectorAll(".swiper-slide")

            let slideIndex = -1
            const swiperInstance = swiperContainer.swiper

            if (swiperInstance) {
                slides.forEach((slide, index) => {
                    const variantId = slide.getAttribute("data-variant-id")
                    if (variantId === selectedVariantId) {
                        slideIndex = index
                        return
                    }
                })

                if (slideIndex !== -1) {
                    swiperInstance.slideTo(slideIndex)
                }
            }
        }
    }
}

customElements.define("variant-product", VariantProduct)

class LocalizationForm extends HTMLElement {
    constructor() {
        super()
        this.elements = {
            input: this.querySelector(
                'input[name="locale_code"], input[name="currency_code"]'
            ),
        }

        this.querySelectorAll("a").forEach((item) =>
            item.addEventListener("click", this.onItemClick.bind(this))
        )
    }

    onItemClick(event) {
        event.preventDefault()
        const form = this.querySelector("form")
        this.elements.input.value = event.currentTarget.dataset.value
        if (form) form.submit()
    }
}

customElements.define("localization-form", LocalizationForm)

// Animate Section

class inViewport {
    constructor(settings) {
        this.options = Object.assign(
            {
                sectionClass:
                    ".section-move-right, .section-move-bottom, .section-fade, .section-move-top",
                inViewportClass: "in-viewport-section",
                threshold: 0.3,
                rootMargin: "0px",
                root: null,
            },
            settings
        )

        const sections = document.querySelectorAll(this.options.sectionClass)

        if ("IntersectionObserver" in window) {
            // IntersectionObserver Supported
            const config = {
                root: this.options.rootMargin.null,
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold,
            }

            const observer = new IntersectionObserver(onChange, config)
            sections.forEach((section) => observer.observe(section))

            function onChange(changes, observer) {
                changes.forEach((change) => {
                    if (change.intersectionRatio > 0) {
                        // Stop watching and load the image
                        loadImage(change.target)
                        observer.unobserve(change.target)
                    }
                })
            }
        } else {
            // IntersectionObserver NOT Supported
            sections.forEach((section) => loadImage(section))
        }

        function loadImage(section) {
            section.classList.add("in-viewport-section")
        }
    }
}

const inViewportSections = new inViewport()

// Countdown element

class countdownContainer extends HTMLElement {
    constructor() {
        super()
        this.daysSpan = this.querySelector(".days")
        this.hoursSpan = this.querySelector(".hours")
        this.minutesSpan = this.querySelector(".minutes")
        this.secondsSpan = this.querySelector(".seconds")

        this.deadline = this.getAttribute("data-date")
        this.initializeClock(this.deadline)
    }

    initializeClock(endTime) {
        this.updateClock(endTime)
        this.timeInterval = setInterval(() => this.updateClock(endTime), 1000)
    }

    updateClock(endTime) {
        const t = this.getTimeRemaining(endTime)

        this.daysSpan.innerHTML = t.days
        this.hoursSpan.innerHTML = ("0" + t.hours).slice(-2)
        this.minutesSpan.innerHTML = ("0" + t.minutes).slice(-2)
        this.secondsSpan.innerHTML = ("0" + t.seconds).slice(-2)

        if (t.total <= 0) {
            clearInterval(this.timeInterval)
        }
    }

    getTimeRemaining(endTime) {
        const total = Date.parse(endTime) - Date.parse(new Date())
        const seconds = Math.floor((total / 1000) % 60)
        const minutes = Math.floor((total / 1000 / 60) % 60)
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
        const days = Math.floor(total / (1000 * 60 * 60 * 24))

        return {
            total,
            days,
            hours,
            minutes,
            seconds,
        }
    }
}

customElements.define("countdown-container", countdownContainer)

// Promo Popup element

class PromoPopup extends HTMLElement {
    constructor() {
        super()

        this.popup = this.querySelector(".js-promo-popup")
        this.detailsContainer = this.popup.querySelector(
            ".js-promo-popup-wrapper"
        )
        this.closeButton = this.querySelector(".js-promo-popup-close")
        this.linkButton = this.querySelector(".js-promo-popup-btn")
        this.sessionStorageName = this.popup.dataset.name

        this.closeButton.addEventListener("click", this.close.bind(this))

        if (this.linkButton && this.linkButton.isConnected) {
            this.linkButton.addEventListener(
                "click",
                this.setSessionStorage.bind(this)
            )
        }

        if (this.sessionStorageName === "newsletterPromoPopup") {
            this.searchPosted = window.location.search
            this.searchCustomer = window.location.search.split("&")

            if (this.searchPosted == "?customer_posted=true") {
                this.popup.classList.add("subscribing")
                this.setSessionStorage()
            }
            if (this.searchCustomer.includes("form_type=customer")) {
                this.popup.classList.add("customerIn")
                this.setSessionStorage()
            }
        }

        if (window.location.pathname !== "/challenge") {
            if (!this.getSessionStorage()) {
                this.addTimer()
            }
        }
    }

    close(e) {
        e.preventDefault()
        this.popup.classList.remove("promo-popup--show")
        document.body.classList.remove("overflow-hidden")
        this.setSessionStorage()
    }

    setSessionStorage() {
        sessionStorage.setItem(this.sessionStorageName, "true")
    }

    getSessionStorage() {
        return sessionStorage.getItem(this.sessionStorageName) === "true"
    }

    addTimer() {
        let delay = 1000 * this.popup.dataset.delay
        setTimeout(this.show.bind(this), delay)
    }

    onBodyClick(e) {
        //console.log(e.target)
        if (
            this.popup.contains(e.target) &&
            !this.detailsContainer.contains(e.target)
        ) {
            this.popup.classList.remove("promo-popup--show")
            document.body.classList.remove("overflow-hidden")
        }
    }

    show(e) {
        this.onBodyClickEvent =
            this.onBodyClickEvent || this.onBodyClick.bind(this)
        document.body.addEventListener("click", this.onBodyClickEvent)

        this.popup.classList.add("promo-popup--show")
        document.body.classList.add("overflow-hidden")
    }
}

customElements.define("promo-popup", PromoPopup)

class ProductRecommendations extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const handleIntersection = (entries, observer) => {
            if (!entries[0].isIntersecting) return
            observer.unobserve(this)

            fetch(
                `${window.Shopify.routes.root}recommendations/products${this.dataset.url}`
            )
                .then((response) => response.text())
                .then((text) => {
                    const html = document.createElement("div")
                    html.innerHTML = text
                    const recommendations = html.querySelector(
                        "product-recommendations"
                    )

                    if (
                        recommendations &&
                        recommendations.innerHTML.trim().length
                    ) {
                        this.innerHTML = recommendations.innerHTML
                    }

                    if (
                        !this.querySelector("slideshow-component") &&
                        this.classList.contains("complementary-products")
                    ) {
                        this.remove()
                    }

                    if (html.querySelector(".grid__item")) {
                        this.classList.add("product-recommendations--loaded")
                    }
                })
                .catch((e) => {
                    console.error(e)
                })
        }

        new IntersectionObserver(handleIntersection.bind(this), {
            rootMargin: "0px 0px 400px 0px",
        }).observe(this)
    }
}

customElements.define("product-recommendations", ProductRecommendations)

class SwiperSection extends HTMLElement {
    constructor() {
        super()
        this.swiperSlider = this.querySelector(".js-swiper")
        this.swiperNext = this.querySelector(".js-button-next")
        this.swiperPrev = this.querySelector(".js-button-prev")
        this.swiperBullets = this.querySelector(".js-pagination")
        this.countDesktop =
            parseInt(this.swiperSlider.dataset.countDesktop) || 3
        this.countMobile = parseInt(this.swiperSlider.dataset.countMobile) || 2
        this.swiper = null
        this.init()
    }

    init() {
        const sectionSwiper = new Swiper(this.swiperSlider, {
            // Optional parameters
            loop: false,
            slidesPerView: this.countMobile,
            spaceBetween: 20,
            // Navigation arrows
            navigation: {
                nextEl: this.swiperNext,
                prevEl: this.swiperPrev,
            },
            pagination: {
                el: this.swiperBullets,
                clickable: true,
            },
            breakpoints: {
                550: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                991: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                1200: {
                    slidesPerView: this.countDesktop,
                    spaceBetween: 30,
                },
            },
        })
    }
}

customElements.define("swiper-section", SwiperSection)

class SwiperMainProduct extends HTMLElement {
    constructor() {
        super()
        this.swiperGalleryThumb = this.querySelector(".js-gallery-thumb")
        this.swiperGallery = this.querySelector(".js-gallery")
        this.swiperNext = this.querySelector(".js-button-next")
        this.swiperPrev = this.querySelector(".js-button-prev")
        this.swiperBullets = this.querySelector(".js-pagination")

        this.length = this.querySelectorAll(".js-gallery li").length
        this.length = this.querySelectorAll(".js-gallery li").length
        this.swiperThumb = this.querySelector(".js-gallery-thumb")

        this.loop = false
        this.centeredSlides = false
        if (this.length > 3) {
            this.loop = true
            this.centeredSlides = true
        }
        if (this.length == 1) {
            this.swiperThumb.classList.add("hidden")
        }

        this.init()
    }

    init() {
        const sectionSwiperGalleryThumb = new Swiper(this.swiperGalleryThumb, {
            //loop: true,
            spaceBetween: 10,
            slidesPerView: 3,
            grabCursor: true,
            freeMode: true,
            slideToClickedSlide: true,
            watchSlidesProgress: true,
            breakpoints: {
                550: {
                    slidesPerView: 4,
                },
                991: {
                    slidesPerView: 4,
                },
                1200: {
                    slidesPerView: 4,
                },
            },
        })

        const sectionSwiperGallery = new Swiper(this.swiperGallery, {
            loop: this.loop,
            zoom: true,
            centeredSlides: this.centeredSlides,
            grabCursor: true,
            //effect: "fade",
            slidesPerView: 1,
            spaceBetween: 10,
            keyboard: {
                enabled: true,
            },
            //freeMode: true,
            navigation: {
                nextEl: this.swiperNext,
                prevEl: this.swiperPrev,
            },
            pagination: {
                el: this.swiperBullets,
                clickable: true,
            },
            thumbs: {
                swiper: sectionSwiperGalleryThumb,
            },
            breakpoints: {
                550: {
                    slidesPerView: 1.6,
                },
                991: {
                    slidesPerView: 1.5,
                },
                1200: {
                    slidesPerView: 1.5,
                },
            },
        })
    }
}

customElements.define("slider-main-product", SwiperMainProduct)

class CompareWishlist extends HTMLElement {
    constructor() {
        super()

        this.btnAddCompare = this.querySelector(".js-btn-compare")
        this.btnAddWishlist = this.querySelector(".js-btn-wishlist")

        this.btnTitleCompareRemove = this.btnAddCompare
            .querySelector(".js-remove-compare-title")
            .getAttribute("title")
        this.btnTitleCompareAdd = this.btnAddCompare
            .querySelector(".js-add-compare-title")
            .getAttribute("title")

        this.btnTitleWishlistRemove = this.btnAddWishlist
            .querySelector(".js-remove-wishlist-title")
            .getAttribute("title")
        this.btnTitleWishlistAdd = this.btnAddWishlist
            .querySelector(".js-add-wishlist-title")
            .getAttribute("title")

        this.removeTitleCompare = this.querySelector(
            ".js-remove-compare-title"
        ).textContent
        this.removeTitleWishlist = this.querySelector(
            ".js-remove-wishlist-title"
        ).textContent

        this.btnAddCompare.addEventListener(
            "click",
            this.onButtonClickCompare.bind(this)
        )
        this.btnAddWishlist.addEventListener(
            "click",
            this.onButtonClickWishlist.bind(this)
        )

        this.loadCompareProducts()
        this.loadWishlistProducts()
    }

    onButtonClickCompare(event) {
        event.preventDefault()
        const id = this.btnAddCompare.dataset.compareId
        const name = this.btnAddCompare.dataset.handle
        this.addProductCompare(id, name)
    }

    onButtonClickWishlist(event) {
        event.preventDefault()
        const id = this.btnAddWishlist.dataset.wishlistId
        const name = this.btnAddWishlist.dataset.handle
        this.addProductWishlist(id, name)
    }

    addProductCompare(id, name) {
        const newProduct = {
            id,
            name,
        }

        let products = JSON.parse(localStorage.getItem("productsCompare")) || []
        let existingProduct = products.find((product) => product.id === id)

        if (
            existingProduct &&
            this.btnAddCompare.classList.contains("active")
        ) {
            this.deleteProductCompare(name, id)
            return
        }

        if (products.some((product) => product.id === id)) {
            return // already added
        }

        if (products.length > 3) {
            this.buildNotification(name, "fullcompare")
            return // full added
        } else {
            this.buildNotification(name, "addcompare")
        }

        products.push(newProduct)
        localStorage.setItem("productsCompare", JSON.stringify(products))
        this.btnAddCompare.classList.add("active")
        this.btnAddCompare.setAttribute("title", this.btnTitleCompareRemove)
    }

    addProductWishlist(id, name) {
        const newProduct = {
            id,
            name,
        }

        let products =
            JSON.parse(localStorage.getItem("productsWishlist")) || []
        let existingProduct = products.find((product) => product.id === id)

        if (
            existingProduct &&
            this.btnAddWishlist.classList.contains("active")
        ) {
            this.deleteProductWishlist(name, id)
            return
        }

        if (products.some((product) => product.id === id)) {
            return // already added
        }

        if (products.length > 15) {
            this.buildNotification(name, "fullwishlist")
            return // full added
        } else {
            this.buildNotification(name, "addwishlist")
        }

        products.push(newProduct)
        localStorage.setItem("productsWishlist", JSON.stringify(products))
        this.btnAddWishlist.classList.add("active")
        this.btnAddWishlist.setAttribute("title", this.btnTitleWishlistRemove)
    }

    deleteProductCompare(name, id) {
        let products = JSON.parse(localStorage.getItem("productsCompare")) || []
        let existingProductIndex = products.findIndex(
            (product) => product.id === id
        )

        if (existingProductIndex === -1) {
            return //product not found
        }
        this.buildNotification(name, "removecompare")

        products.splice(existingProductIndex, 1)
        localStorage.setItem("productsCompare", JSON.stringify(products))
        this.btnAddCompare.classList.remove("active")
        this.btnAddCompare.setAttribute("title", this.btnTitleCompareAdd)
    }

    deleteProductWishlist(name, id) {
        let products =
            JSON.parse(localStorage.getItem("productsWishlist")) || []
        let existingProductIndex = products.findIndex(
            (product) => product.id === id
        )

        if (existingProductIndex === -1) {
            return //product not found
        }
        this.buildNotification(name, "removewishlist")

        products.splice(existingProductIndex, 1)
        localStorage.setItem("productsWishlist", JSON.stringify(products))
        this.btnAddWishlist.classList.remove("active")
        this.btnAddWishlist.setAttribute("title", this.btnTitleWishlistAdd)
    }

    loadCompareProducts() {
        let products = JSON.parse(localStorage.getItem("productsCompare")) || []

        products.forEach((product) => {
            let element = document.querySelector(
                `[data-compare-id="${product.id}"]`
            )

            if (element) {
                element.classList.add("active")
                element.setAttribute("title", this.btnTitleCompareRemove)
            }
        })
    }

    loadWishlistProducts() {
        let products =
            JSON.parse(localStorage.getItem("productsWishlist")) || []

        products.forEach((product) => {
            let element = document.querySelector(
                `[data-wishlist-id="${product.id}"]`
            )

            if (element) {
                element.classList.add("active")
                element.setAttribute("title", this.btnTitleWishlistRemove)
            }
        })
    }

    buildNotification(handle, action) {
        const url = `${
            window.Shopify.routes.root
        }collections/all?section_id=compare-notification&id=${action}&handle=${encodeURIComponent(
            handle
        )}`
        fetch(url)
            .then((response) => response.text())
            .then((text) => {
                if (text) {
                    const html = document.createElement("div")
                    html.innerHTML = text
                    const notification = html.querySelector(
                        ".js-item-notification"
                    )
                    document.body.appendChild(notification)
                    notification.classList.add("open")
                    document.body.classList.add("overflow-hidden")
                    this.getNotification(notification)
                }
            })
    }

    getNotification() {
        let imageSize = this.closest(".js-card-product-wrapper")
            .querySelector(".js-card-product-media")
            .getAttribute("data-size")
        let modal = document.querySelector(".js-item-notification")
        trapFocus(modal)

        modal
            .querySelector(".js-item-notification-media")
            .classList.add("media__size--" + imageSize)

        modal.classList.add("open")
        document.body.classList.add("overflow-hidden")

        let close = document.querySelectorAll(".js-modal-close")

        close.forEach((element) => {
            element.addEventListener("click", (event) => {
                event.preventDefault()
                this.closeNotification(modal)
            })
        })

        modal.addEventListener("click", (event) => {
            if (event.target == modal) {
                this.closeNotification(modal)
            }
        })

        modal.addEventListener("keyup", (event) => {
            if (event.code.toUpperCase() === "ESCAPE") {
                closeNotification(modal)
            }
        })
    }

    closeNotification(modal) {
        modal.classList.remove("open")
        document.body.classList.remove("overflow-hidden")
        modal.remove()
        removeTrapFocus(modal)
    }
}

customElements.define("compare-wishlist", CompareWishlist)
