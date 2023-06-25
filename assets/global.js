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
        this.activeVariant = null
        this.availableVariant = null

        this.price = this.closest(".js-card-product-wrapper").querySelector(
            ".js-card-product-price"
        )
        this.saleBadge = this.closest(".js-card-product-wrapper").querySelector(
            ".js-card-product-sale-badge"
        )
        this.percentageBadge = this.closest(
            ".js-card-product-wrapper"
        ).querySelector(".js-percentage-badge")

        this.image = this.closest(".js-card-product-wrapper").querySelector(
            ".js-card-product-media"
        )
        this.qty = this.closest(".js-card-product-wrapper").querySelector(
            ".js-quantity"
        )
        this.stock = this.closest(".js-card-product-wrapper").querySelector(
            ".js-card-product-stock"
        )
        this.btnCart = this.closest(".js-card-product-wrapper").querySelector(
            ".js-btn-cart"
        )
        this.btnSoldOut = this.closest(
            ".js-card-product-wrapper"
        ).querySelector(".js-btn-sold-out")

        this.initSwatch()
    }

    initSwatch() {
        this.getVariantData()
        this.createNewListVariant(this.variantData)

        // Event handler for product option buttons
        const handleClick = (event) => {
            //console.log("event", event)
            if (event.target.tagName === "INPUT") {
                if (event.target.closest(".js-swatch")) {
                    const elements = event.target
                        .closest(".js-swatch")
                        .querySelectorAll(".js-swatch-element")
                    elements.forEach((element) => {
                        element.classList.remove("active")
                    })
                }

                const selectedValues = Array.from(this.swatchElements)
                    .map((element) => {
                        const input = element.querySelector("input:checked")

                        return input ? input.value : null
                    })
                    .filter((value) => value !== null)

                //this.updateAvailableVariant(selectedValues)
                this.isOptionAvailable(event, this.variantData, selectedValues)
            }
        }

        const delay = 300

        // Installing event handlers on product option buttons
        this.swatchElements.forEach((element) => {
            element.addEventListener("click", this.debounce(handleClick, delay))
        })

        this.getAvailableVariant()
        // Check the availability of swatch levels
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

    getAvailableVariant() {
        const sortedVariants = this.groupedVariants()
        const activeVariant = sortedVariants.find(
            (variant) => variant.available
        )
        this.activeVariant = activeVariant.options

        this.checkSwatchLevels()
    }

    getActiveSwatchValues() {
        this.swatchElements.forEach((element) => {
            const option = element.getAttribute("data-value")
            if (this.activeVariant.includes(option)) {
                element.classList.add("active")
                element.firstElementChild.checked = true
                const headerSwatch = element
                    .closest(".swatch--product")
                    .querySelector(".js-swatch-header em")
                headerSwatch.textContent = element.getAttribute("data-value")
            } else {
                element.classList.remove("active")
            }
        })
        return this.activeVariant
    }

    groupedVariants() {
        const groupedVariants = {}
        this.variantData.forEach((variant) => {
            const color = variant.options[0]

            if (!groupedVariants[color]) {
                groupedVariants[color] = []
            }

            groupedVariants[color].push(variant)
        })
        const uniqueColors = Object.keys(groupedVariants)
        const sortedVariants = []
        uniqueColors.forEach((color) => {
            sortedVariants.push(...groupedVariants[color])
        })

        return sortedVariants
    }

    updateSwatchOptions(levelIndex, options) {
        const swatchElements = this.querySelectorAll(
            `.js-swatch-level-${levelIndex}`
        )
        swatchElements.forEach((element) => {
            const swatch = element.getAttribute("data-value")
            const available = options.includes(swatch)

            element.classList.toggle("available", available)
            element.classList.toggle("unavailable", !available)
        })
    }

    checkSwatchLevels() {
        this.swatchLevels = []

        const selectedOptions = this.getActiveSwatchValues()
        const combinationsArray = Object.values(this.variantData)
        const filterAvailability = this.filterAvailability(
            combinationsArray,
            selectedOptions
        )
        if (filterAvailability) {
            for (let index = 0; index < selectedOptions.length - 1; index++) {
                const option = selectedOptions[index]
                let availableOptions = []
                for (let j = 0; j < filterAvailability.length; j++) {
                    const combination = filterAvailability[j]
                    if (combination.options.includes(option)) {
                        const secondOptions = combination.options
                        availableOptions.push(secondOptions[index + 1])
                    }
                }
                availableOptions = [...new Set(availableOptions)]

                this.updateSwatchOptions(index + 1, availableOptions)
            }
            if (selectedOptions.length <= 2) {
                const availableOptions = combinationsArray
                    .filter((combination) => combination.available)
                    .map((combination) => combination.options)
                const mergedOptions = [].concat(...availableOptions)
                this.updateSwatchOptions(0, mergedOptions)
            }
        }
    }

    isOptionAvailable(event, combinations, availableOptions) {
        const combinationsArray = Object.values(combinations)
        const startOptions =
            availableOptions.length > 1
                ? availableOptions.slice(0, -1)
                : availableOptions

        const filterCombinations = this.filterCombinations(
            combinationsArray,
            startOptions
        )

        const optionAvailability = this.getCombinationAvailability(
            filterCombinations,
            availableOptions
        )

        if (optionAvailability !== undefined) {
            this.activeVariant = optionAvailability.options
            this.availableVariant = optionAvailability
        } else {
            this.activeVariant = filterCombinations[0].options
            this.availableVariant = filterCombinations[0]
        }
        this.checkSwatchLevels()

        this.updateOptions()
        this.updatePrice()
        this.updateImage()
        this.updateURL()
    }

    getCombinationAvailability(combinations, availableOptions) {
        return combinations.find((combination) => {
            return combination.options.every((option) =>
                availableOptions.includes(option)
            )
        })
    }

    filterAvailability(combinations, startingOptions) {
        const filterAvailability = []
        const partialOptions = startingOptions.slice(0, 1)
        for (let i = startingOptions.length; i > 0; i--) {
            const partialFilteredOptions = combinations.filter(
                (combination) => {
                    if (
                        combination.options.length < partialOptions.length ||
                        !combination.available
                    ) {
                        return false
                    }

                    for (let j = 0; j < partialOptions.length; j++) {
                        if (combination.options[j] !== partialOptions[j]) {
                            return false
                        }
                    }

                    return true
                }
            )

            filterAvailability.push(...partialFilteredOptions)

            if (partialFilteredOptions.length > 0) {
                break
            }
        }

        return filterAvailability
    }

    filterCombinations(combinations, startingOptions) {
        const filterCombinations = []
        for (let i = startingOptions.length; i > 0; i--) {
            const partialOptions = startingOptions.slice(0, i)
            const partialFilteredOptions = combinations.filter(
                (combination) => {
                    if (
                        combination.options.length < partialOptions.length ||
                        !combination.available
                    ) {
                        return false
                    }

                    for (let j = 0; j < partialOptions.length; j++) {
                        if (combination.options[j] !== partialOptions[j]) {
                            return false
                        }
                    }

                    return true
                }
            )

            filterCombinations.push(...partialFilteredOptions)

            if (partialFilteredOptions.length > 0) {
                break
            }
        }
        return filterCombinations
    }

    updateOptions() {
        const availableVariant = this.availableVariant
        const availableVariantId = String(availableVariant.id)
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

        if (inventoryQty < 10) {
            this.stock.classList.remove("card-product__stock--normalstock")
            this.stock.classList.add("card-product__stock--lowstock")
        } else {
            this.stock.classList.remove("card-product__stock--lowstock")
            this.stock.classList.add("card-product__stock--normalstock")
        }

        //const isAvailable = availableVariant.available
        //qtyParentElement.classList.toggle('hidden', !isAvailable);
        //this.btnCart.classList.toggle('hidden', !isAvailable);
        //this.btnSoldOut.classList.toggle('hidden', isAvailable);
    }

    updatePrice() {
        const { compare_at_price: comparePrice, price: salePrice } =
            this.availableVariant
        const elementSalePrice = this.price.querySelector(".price__item--sale")
        const elementComparePrice = this.price.querySelector(
            ".price__item--regular"
        )
        const hasComparePrice = comparePrice !== null

        this.percentageBadge

        this.price.classList.toggle("price--on-sale", hasComparePrice)
        if (this.saleBadge) {
            this.saleBadge.classList.toggle("hidden", !hasComparePrice)
        }
        elementSalePrice.textContent = Shopify.formatMoney(salePrice)
        elementComparePrice.textContent = hasComparePrice
            ? Shopify.formatMoney(comparePrice)
            : ""
        if (hasComparePrice) {
            const getPercentage =
                ((comparePrice - salePrice) / comparePrice) * 100
            this.percentageBadge.textContent = Math.round(getPercentage) + "%"
        }
    }

    updateImage() {
        const image = this.availableVariant.featured_image

        if (image !== null) {
            this.image.firstElementChild.srcset = image.src
        }
    }

    updateURL() {
        const cardProductWrapper = this.closest(".js-card-product-wrapper")
        if (!this.availableVariant || !cardProductWrapper) return

        const url = cardProductWrapper.querySelector(
            ".js-card-product-title > a"
        )
        if (url) {
            url.search = `?variant=${this.availableVariant.id}`
        }
    }

    getVariantData() {
        this.variantData =
            this.variantData ||
            JSON.parse(
                this.querySelector('[type="application/json"]').textContent
            )
        return this.variantData
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
    }

    initSwatch() {
        this.getVariantData()
        this.createNewListVariant(this.variantData)

        const handleClick = (event) => {
            if (event.target.tagName === "INPUT") {
                if (event.target.closest(".js-swatch")) {
                    const elements = event.target
                        .closest(".js-swatch")
                        .querySelectorAll(".js-swatch-element")
                    elements.forEach((element) => {
                        element.classList.remove("active")
                    })
                }

                const selectedValues = Array.from(this.swatchElements)
                    .map((element) => {
                        const input = element.querySelector("input:checked")

                        return input ? input.value : null
                    })
                    .filter((value) => value !== null)

                //this.updateAvailableVariant(selectedValues)
                this.isOptionAvailable(event, this.variantData, selectedValues)

                if (event.target.closest(".js-main-product-sticky")) {
                    const block2 = document.querySelector(".js-product-sticky")
                    block2.variantData = this.variantData
                    block2.isOptionAvailable(
                        event,
                        this.variantData,
                        selectedValues
                    )
                } else if (event.target.closest(".js-product-sticky")) {
                    const block1 = document.querySelector(
                        ".js-main-product-sticky"
                    )
                    block1.variantData = this.variantData
                    block1.isOptionAvailable(
                        event,
                        this.variantData,
                        selectedValues
                    )
                }
            }
        }

        const delay = 300

        // Installing event handlers on product option buttons
        this.swatchElements.forEach((element) => {
            element.addEventListener("click", (event) => {
                this.debounce(handleClick, delay)(event)
            })
        })
        this.getAvailableVariant()
    }

    getAvailableVariant() {
        const sortedVariants = this.groupedVariants()
        const url = window.location.href
        const activeVariant = sortedVariants.find(
            (variant) => variant.available
        )

        if (url.includes("variant=")) {
            var regex = /variant=(\d+)/
            var match = url.match(regex)

            if (match) {
                let variantValue = match[1]
                let activeVariantValue = sortedVariants.find((variant) => {
                    if (variant.id.toString() === variantValue) {
                        return variant
                    }
                })

                const clickEvent = new Event("click")
                //this.checkSwatchLevels()

                const swatchElements =
                    this.querySelectorAll(`.js-swatch-level-0`)
                swatchElements.forEach((element) => {
                    const swatch = element.getAttribute("data-value")
                    const available =
                        activeVariantValue.options.includes(swatch)
                    if (available) {
                        element.addEventListener(
                            "click",
                            function (event) {
                                this.isOptionAvailable(
                                    event,
                                    this.variantData,
                                    activeVariantValue.options
                                )
                            }.bind(this)
                        )
                        element.dispatchEvent(clickEvent)
                    }
                })
            }
        } else {
            this.activeVariant = activeVariant.options
            this.checkSwatchLevels()
        }
    }

    isOptionAvailable(event, combinations, availableOptions) {
        this.layout = document.querySelector(".js-layout-slider")
        this.layoutGrouped = document.querySelector(".js-layout-grouped")
        const combinationsArray = Object.values(combinations)
        const startOptions =
            availableOptions.length > 1
                ? availableOptions.slice(0, -1)
                : availableOptions

        const filterCombinations = this.filterCombinations(
            combinationsArray,
            startOptions
        )

        const optionAvailability = this.getCombinationAvailability(
            filterCombinations,
            availableOptions
        )

        if (optionAvailability !== undefined) {
            this.activeVariant = optionAvailability.options
            this.availableVariant = optionAvailability
        } else {
            this.activeVariant = filterCombinations[0].options
            this.availableVariant = filterCombinations[0]
        }

        this.checkSwatchLevels()
        this.updateOptions()
        this.updatePrice()
        this.updateImage()
        this.updateURL()
        this.updatePickupAvailability()
        if (this.layout !== null) {
            this.updateSlider()
        }

        if (this.layoutGrouped !== null) {
            this.updateSliderGrouped(event)
        }
    }

    updatePickupAvailability() {
        const currentVariant = this.availableVariant
        const pickUpAvailability = document.querySelector("pickup-availability")
        if (!pickUpAvailability) return

        if (currentVariant && currentVariant.available) {
            pickUpAvailability.fetchAvailability(currentVariant.id)
        } else {
            pickUpAvailability.removeAttribute("available")
            pickUpAvailability.innerHTML = ""
        }
    }

    updateOptions() {
        this.cardProductCount = document.querySelectorAll(
            ".js-card-product-count"
        )
        this.variantSku = document.querySelector(".js-variant-sku")
        this.variantBarcode = document.querySelector(".js-variant-barcode")

        const availableVariant = this.availableVariant
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

        //const isAvailable = availableVariant.available
    }

    updateSliderGrouped(event) {
        const selectedVariantId = this.availableVariant.id.toString()
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
            "#" + this.availableVariant.option1 + "-panel .js-gallery"
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
        const selectedVariantId = this.availableVariant.id.toString()
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
    updateURL() {
        if (!this.availableVariant) return
        window.history.replaceState(
            {},
            "",
            `${this.dataset.url}?variant=${this.availableVariant.id}`
        )
    }
}

customElements.define("variant-product", VariantProduct)

class StickyAddToCart extends HTMLElement {
    constructor() {
        super()
        this.mainBlock = document.querySelector(".js-main-product-block")
        this.footer = document.querySelector(".copyright__row")
        this.stickyBlock = this
        this.stickySelect = this.querySelector(".js-sticky-select")
        this.stickyContent = this.querySelector(".js-sticky-product-content")
        this.scrolledMainBlock = false

        window.addEventListener("scroll", this.scrollContentDisplay.bind(this))
        this.stickySelect.addEventListener("click", this.onClick.bind(this))
        this.addEventListener("keyup", this.onKeyUp.bind(this))
    }

    scrollContentDisplay() {
        const mainBlockHeight = this.mainBlock.offsetHeight
        const footerOffset = this.footer.offsetTop
        const scrollPosition = window.scrollY

        if (
            !this.scrolledMainBlock &&
            scrollPosition >= this.mainBlock.offsetTop + mainBlockHeight
        ) {
            this.scrolledMainBlock = true
        }

        if (this.scrolledMainBlock) {
            if (
                scrollPosition < this.mainBlock.offsetTop ||
                scrollPosition >= footerOffset - window.innerHeight ||
                scrollPosition <=
                    this.mainBlock.offsetTop +
                        mainBlockHeight -
                        window.innerHeight
            ) {
                this.stickyBlock.classList.remove("show")
                this.close()
            } else {
                this.stickyBlock.classList.add("show")
            }
        } else {
            this.stickyBlock.classList.remove("show")
            this.close()
        }
    }

    onClick(event) {
        event.preventDefault()
        event.target.classList.contains("open") ? this.close() : this.open()
    }

    open() {
        this.stickySelect.classList.add("open")
        this.stickyContent.classList.add("open")
        //this.stickyContent.style.height = "auto"
        this.stickyContent.style.display = "flex"
    }
    close() {
        this.stickySelect.classList.remove("open")
        this.stickyContent.classList.remove("open")
        //this.stickyContent.style.height = "0"
        this.stickyContent.style.display = "none"
    }

    onKeyUp(event) {
        if (event.code.toUpperCase() !== "ESCAPE") return
        if (
            event.target.classList.contains("js-sticky-select") &&
            event.target.classList.contains("open")
        ) {
            this.close()
        }
    }
}

customElements.define("sticky-add-to-cart", StickyAddToCart)

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
        this.countTablet = parseInt(this.swiperSlider.dataset.countTablet) || 2
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
                    slidesPerView: this.countTablet,
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
