//{ subscribeToCartAjaxRequests, cartRequestAdd, cartRequestChange, cartRequestUpdate, subscribeToCartStateUpdate }
if ("liquidAjaxCart" in window) {
    var recommendProducts = {},
        recommendResults = false

    let addToCartButton = document.querySelector(".js-btn-cart-combo")

    if (addToCartButton) {
        let stateCombo = true
        addToCartButton.addEventListener("click", function (event) {
            let mainProductForm = event.target.closest(".js-main-combo-action")
            let mainProductCombo = event.target.closest(".js-combo-action")

            mainProductForm.classList.add("js-ajax-cart-form-in-progress")

            let formData = new FormData(mainProductForm)
            console.log(formData)
            let id = formData.get("id")
            let quantity = formData.get("quantity")
            let properties = formData.get("properties[Combo Discount]")

            let formItem = {}

            if (id && quantity && properties) {
                formItem = {
                    id: id,
                    quantity: quantity,
                    properties: { "Combo Discount": properties },
                }
            }

            let otherForms = mainProductCombo.querySelectorAll(
                ".card-product__form"
            )
            let otherItems = []

            otherForms.forEach(function (form) {
                let otherFormData = new FormData(form)
                let id = otherFormData.get("id")
                let quantity = formData.get("quantity")
                let otherItem = {}

                if (id && quantity) {
                    otherItem = {
                        id: id,
                        quantity: quantity,
                    }
                    otherItems.push(otherItem)
                }
            })

            let items = [formItem, ...otherItems]

            let options = {
                lastComplete: (requestState) => {
                    let productForm = document.querySelector(
                        ".js-main-combo-action"
                    )
                    productForm.classList.remove(
                        "js-ajax-cart-form-in-progress"
                    )
                    console.log(productForm)
                    if (requestState.requestType === "add") {
                        buildNotification(requestState)
                    }
                },
            }

            liquidAjaxCart.cartRequestAdd({ items: items }, options)
        })
    }

    liquidAjaxCart.configureCart("updateOnWindowFocus", false)

    liquidAjaxCart.subscribeToCartAjaxRequests(
        (requestState, subscribeToResult) => {
            if (requestState.requestType === "add") {
                subscribeToResult((requestState) => {
                    if (requestState.responseData.ok) {
                        let product_key = requestState.responseData.body.id
                        let product_id = String(
                            requestState.responseData.body.product_id
                        )

                        if (
                            requestState.requestBody &&
                            requestState.requestBody.items
                        ) {
                            console.log(requestState)
                        } else {
                            recommendProducts[product_key] = product_id
                            buildNotification(requestState)
                            setCookie("cart_recommend", recommendProducts)
                        }
                    }
                })
            }

            if (requestState.requestType === "change") {
                subscribeToResult((requestState) => {
                    if (requestState.responseData?.ok) {
                        let items = requestState.responseData.body.items
                        let cartItems = []

                        if (items.length === 0) {
                            for (const key in recommendProducts) {
                                if (
                                    Object.hasOwnProperty.call(
                                        recommendProducts,
                                        key
                                    )
                                ) {
                                    delete recommendProducts[key]
                                }
                            }
                            deleteCookie("cart_recommend")
                        } else {
                            items.forEach((element) => {
                                cartItems.push(element.id)
                            })

                            for (const key in recommendProducts) {
                                if (
                                    Object.hasOwnProperty.call(
                                        recommendProducts,
                                        key
                                    )
                                ) {
                                    if (!cartItems.includes(+key)) {
                                        delete recommendProducts[key]
                                    }
                                }
                            }
                        }
                        setCookie("cart_recommend", recommendProducts)
                    }
                })
            }
        }
    )

    liquidAjaxCart.cartRequestUpdate()

    liquidAjaxCart.subscribeToCartStateUpdate(async (state) => {
        const cartTotalHeader = document.querySelector(".cart-count-ajax-cart")

        if (state.status.cartStateSet && !state.status.requestInProgress) {
            cartTotalHeader.textContent = Shopify.formatMoney(
                state.cart.total_price
            )
            const cartDrawerShipping = document.querySelector(
                ".js-cart-drawer-shipping"
            )
            if (cartDrawerShipping && cartDrawerShipping.isConnected) {
                let currentTotal = state.cart.total_price
                const shippingTotal = document
                    .querySelector(".js-cart-drawer-shipping")
                    .getAttribute("data-total")
                calculateProgress(currentTotal, shippingTotal)
            }

            let getCookieValue = getCookie("cart_recommend")

            if (typeof getCookieValue !== "undefined") {
                if (
                    Object.keys(getCookieValue).length < state.cart.items.length
                ) {
                    refreshCookie(state)
                }
                if (
                    Object.keys(getCookieValue).length !== 0 &&
                    getCookieValue.constructor === Object
                ) {
                    let cartIds = []

                    for (const key in getCookieValue) {
                        if (Object.hasOwnProperty.call(getCookieValue, key)) {
                            const id = getCookieValue[key]
                            cartIds.push(id)
                        }
                    }

                    let handles = getRecommendProducts(cartIds)

                    handles.then((result) => {
                        if (result.length > 0) {
                            let strHandles = result.join("=")
                            sentRecommendIds(strHandles)
                        }
                    })
                }
            } else {
                refreshCookie(state)
            }
        }
    })
}

function buildNotification(requestState) {
    fetch(window.Shopify.routes.root + "?section_id=cart-notification")
        .then((response) => response.text())
        .then((text) => {
            if (text) {
                let html = document.createElement("div")
                html.innerHTML = text
                let cartNotification = html.querySelector(
                    ".js-cart-notification"
                )
                document.body.appendChild(cartNotification)
                let modal = document.querySelector(".js-cart-notification")
                modal.classList.add("open")
                document.body.classList.add("overflow-hidden")
                getNotification(requestState)
            }
        })
}

function getNotification(state) {
    console.log(state)
    let imageSize = document
        .querySelector("#cart-recommend")
        .getAttribute("data-size")
    let modal = document.querySelector(".js-cart-notification")
    trapFocus(modal)

    if (state.responseData?.ok) {
        if (state.requestBody instanceof FormData) {
            modal.querySelector(".js-cart-notification-title").textContent =
                state.responseData.body.product_title
            modal
                .querySelector(".js-cart-notification-image")
                .parentElement.classList.add("media__size--" + imageSize)
            modal.querySelector(".js-cart-notification-image").src =
                state.responseData.body.image

            modal.querySelector(".js-cart-notification-image").alt =
                state.responseData.body.product_title
        } else {
            let item = state.responseData.body.items[0]
            modal.querySelector(".js-cart-notification-title").textContent =
                item.product_title
            modal
                .querySelector(".js-cart-notification-image")
                .parentElement.classList.add("media__size--" + imageSize)
            modal.querySelector(".js-cart-notification-image").src = item.image

            modal.querySelector(".js-cart-notification-image").alt =
                item.product_title
        }
    } else {
        modal.querySelector(".js-cart-notification-title").textContent =
            state.responseData.body.message +
            " " +
            state.responseData.body.status
        modal
            .querySelector(".js-cart-notification-image")
            .parentElement.parentElement.remove()
        modal.querySelector(".js-cart-msg").textContent =
            state.responseData.body.description
    }

    modal.classList.add("open")
    document.body.classList.add("overflow-hidden")

    let close = document.querySelectorAll(".js-modal-close")

    close.forEach((element) => {
        element.addEventListener("click", (event) => {
            event.preventDefault()
            closeNotification(modal)
        })
    })

    modal.addEventListener("click", (event) => {
        if (event.target == modal) {
            closeNotification(modal)
        }
    })

    modal.addEventListener("keyup", (event) => {
        if (event.code.toUpperCase() === "ESCAPE") {
            closeNotification(modal)
        }
    })
}

function closeNotification(modal) {
    modal.classList.remove("open")
    document.body.classList.remove("overflow-hidden")
    modal.remove()
    removeTrapFocus(modal)
}

async function getRecommendProducts(ids) {
    const productItems = []

    const promises = ids.map((id) => {
        return fetch(
            `${window.Shopify.routes.root}recommendations/products.json?product_id=${id}&limit=4&intent=complementary`
        )
            .then((response) => response.json())
            .then(({ products }) => {
                for (const product of products) {
                    const handle = String(product.handle)
                    if (!productItems.includes(handle)) {
                        productItems.push(handle)
                    }
                }
            })
    })

    await Promise.all(promises)

    return productItems
}

function sentRecommendIds(ids) {
    const cartRecommendREsults = document.querySelector("#cart-recommend")
    const imageSize = document
        .querySelector("#cart-recommend")
        .getAttribute("data-size")

    fetch(
        window.Shopify.routes.root +
            "collections/all?section_id=cart-recommend&id=" +
            encodeURIComponent(ids)
    )
        .then((response) => response.text())
        .then((text) => {
            const html = document.createElement("div")
            html.innerHTML = text
            const cartRecommend = html.querySelector(".js-cart-recommend-block")

            if (cartRecommend && cartRecommend.innerHTML.trim().length) {
                recommendResults = true
                cartRecommendREsults.innerHTML = cartRecommend.innerHTML

                let cartRecommendREsultsItem =
                    cartRecommendREsults.querySelectorAll(
                        ".js-cart-recommend-item"
                    )

                cartRecommendREsultsItem.forEach((item) => {
                    item.querySelector(".card-product__media").classList.add(
                        "media__size--" + imageSize
                    )
                })
                const swiper = new Swiper(".js-recommend-swiper", {
                    // Optional parameters
                    loop: false,
                    slidesPerView: 2,
                    spaceBetween: 10,
                    // Navigation arrows
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    },
                    breakpoints: {
                        551: {
                            slidesPerView: 2,
                            spaceBetween: 15,
                        },
                    },
                })
            }
        })
}

function refreshCookie(state) {
    if (
        Object.keys(state.cart).length !== 0 &&
        state.cart.constructor === Object
    ) {
        state.cart.items.forEach((element) => {
            let product_key = element.id
            let product_id = String(element.product_id)

            recommendProducts[product_key] = product_id
            setCookie("cart_recommend", recommendProducts)
        })
    }
}

function setCookie(name, json) {
    let cookieValue = ""
    let expire = ""
    let period = ""

    //Specify the cookie name and value
    cookieValue = name + "=" + JSON.stringify(json) + ";"

    //Specify the path to set the cookie
    cookieValue += "path=/ ;"

    //Specify how long you want to keep cookie
    period = 30 //days to store
    expire = new Date()
    expire.setTime(expire.getTime() + 1000 * 3600 * 24 * period)
    expire.toString()
    cookieValue += "expires=" + expire + ";"

    //console.log('set-'+cookieValue)
    //Set cookie
    document.cookie = cookieValue
}

function deleteCookie(name) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
}

function getCookie(name) {
    let cookieValue = ""
    let cookieArray = new Array()

    //Get cookie
    cookieValue = document.cookie

    //Divide the cookie into an array and convert them to JSON
    if (cookieValue) {
        cookieArray = cookieValue.split(";")
        for (const iterator in cookieArray) {
            if (cookieArray[iterator].includes(name)) {
                let data = cookieArray[iterator].split("=")
                return JSON.parse(data[1])
            }
        }
    }
}

function calculateProgress(currentVal, targetVal) {
    let progressBar = document.querySelectorAll(
        ".cart-drawer-shippingThreshold__progress"
    )
    let progressNum = document.querySelectorAll(".cart-drawer-shipping__num")
    let progressOuter = document.querySelectorAll(
        ".cart-drawer-shipping__numOuter"
    )
    let successMsg = document.querySelectorAll(".cart-drawer-shipping__success")
    // calculate how far progress is from the total as a percentage
    let result = Math.round((100 * currentVal) / targetVal)
    progressBar.forEach(function (el) {
        el.setAttribute("style", "width: ".concat(result, "%"))
    })
    // Update the progess text. If threshold is met, show success message
    let newProgressNum = (targetVal - currentVal) / 100
    if (newProgressNum <= 0) {
        successMsg.forEach(function (el) {
            el.style.display = "block"
        })
        progressOuter.forEach(function (el) {
            el.style.display = "none"
        })
        progressNum.forEach(function (el) {
            el.textContent = Shopify.formatMoney(newProgressNum * 100)
        })
    } else {
        successMsg.forEach(function (el) {
            el.style.display = "none"
        })
        progressOuter.forEach(function (el) {
            el.style.display = "block"
        })
        progressNum.forEach(function (el) {
            el.textContent = Shopify.formatMoney(newProgressNum * 100)
        })
    }
}
