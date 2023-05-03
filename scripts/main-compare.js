class PageCompare extends HTMLElement {
    constructor() {
        super()

        const debouncedGetMaxHeight = this.debounce(this.getMaxHeight, 150)

        window.addEventListener("resize", debouncedGetMaxHeight)
        this.loadCompareProducts()
    }

    init() {
        const sectionSwiper = new Swiper(".js-swiper", {
            // Optional parameters
            loop: false,
            slidesPerView: 1,
            spaceBetween: 0,
            // Navigation arrows
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            pagination: false,
            breakpoints: {
                550: {
                    slidesPerView: 2,
                },
                991: {
                    slidesPerView: 3,
                },
                1400: {
                    slidesPerView: 4,
                },
            },
        })
    }

    loadCompareProducts() {
        let products = JSON.parse(localStorage.getItem("productsCompare")) || []
        let productNames = products.map((product) => product.name)
        let namesString = productNames.join("=")

        let pageResults = document.querySelector(".js-list-container")
        let titleResults = document.querySelector(".js-page-compare-title")
        if (namesString) {
            titleResults.classList.add("hidden")
            fetch(
                window.Shopify.routes.root +
                    "collections/all?section_id=page-compare&handle=" +
                    encodeURIComponent(namesString)
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok")
                    }
                    return response.text()
                })
                .then((text) => {
                    const html = document.createElement("div")
                    html.innerHTML = text
                    const pageBlock = html.querySelector(".js-page-block")

                    if (pageBlock && pageBlock.innerHTML.trim().length) {
                        pageResults.innerHTML = pageBlock.innerHTML
                        setTimeout(() => {
                            const initPromise = new Promise((resolve) => {
                                this.init()
                                resolve()
                            })

                            initPromise.then(() => {
                                this.getMaxHeight()
                            })
                        }, 100)
                        let btnAddWishlistAll =
                            pageResults.querySelectorAll(".js-btn-compare")

                        btnAddWishlistAll.forEach((item) => {
                            item.addEventListener("click", (event) => {
                                event.preventDefault()
                                const element = event.currentTarget
                                setTimeout(() => {
                                    element.closest(".js-card-item").remove()
                                    let getRestProducts =
                                        JSON.parse(
                                            localStorage.getItem(
                                                "productsCompare"
                                            )
                                        ) || []
                                    if (getRestProducts.length == 0) {
                                        pageResults.classList.add("hidden")
                                        titleResults.classList.remove("hidden")
                                    }
                                }, 300)
                            })
                        })
                    }
                })
                .catch((error) => {
                    console.error("Error:", error)
                })
        }
    }

    getMaxHeight() {
        this.resetHeight()
        const rightColumnItems = document.querySelectorAll(
            ".main-compare-page__body--item"
        )

        let maxHeight = {
            "item-main": 0,
            "item-desc": 0,
            "item-rating": 0,
            "item-vendor": 0,
            "item-available": 0,
            "item-type": 0,
            "item-option-first": 0,
            "item-option-second": 0,
            "item-option-third": 0,
            "item-tags": 0,
        }

        rightColumnItems.forEach((item) => {
            const className = item.classList.item(1)
            const height = item.offsetHeight
            if (height > maxHeight[className]) {
                maxHeight[className] = height
            }
        })

        rightColumnItems.forEach((item) => {
            const className = item.classList.item(1)
            item.style.height = `${maxHeight[className]}px`
        })

        console.log(maxHeight)

        const leftColumnItems = document.querySelectorAll(
            ".main-compare-page__head--item"
        )
        leftColumnItems.forEach((item) => {
            const className = item.classList.item(1)
            item.style.height = `${maxHeight[className]}px`
        })
    }
    resetHeight() {
        const rightColumnItems = document.querySelectorAll(
            ".main-compare-page__body--item"
        )
        rightColumnItems.forEach((item) => {
            item.style.height = "auto"
        })
    }

    debounce = (fn, wait) => {
        let t
        return (...args) => {
            clearTimeout(t)
            t = setTimeout(() => fn.apply(this, args), wait)
        }
    }
}

customElements.define("page-compare", PageCompare)
