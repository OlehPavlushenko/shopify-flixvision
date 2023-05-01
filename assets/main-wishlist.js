class PageWishlist extends HTMLElement {
    constructor() {
        super()

        this.loadWishlistProducts()
    }

    loadWishlistProducts() {
        let products =
            JSON.parse(localStorage.getItem("productsWishlist")) || []
        let productNames = products.map((product) => product.name)
        let namesString = productNames.join("=")

        let pageResults = document.querySelector(".js-list-container")
        let imageSize = pageResults.getAttribute("data-size")

        fetch(
            window.Shopify.routes.root +
                "collections/all?section_id=page-wishlist&handle=" +
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
                    let btnAddWishlistAll =
                        pageResults.querySelectorAll(".js-btn-wishlist")
                    let pageResultsItem =
                        pageResults.querySelectorAll(".js-card-item")

                    pageResultsItem.forEach((item) => {
                        let media = item.querySelector(".js-card-product-media")
                        media.classList.add("media__size--" + imageSize)
                        media.setAttribute("data-size", imageSize)
                    })

                    btnAddWishlistAll.forEach((item) => {
                        item.addEventListener("click", (event) => {
                            event.preventDefault()
                            const element = event.currentTarget
                            setTimeout(() => {
                                element.closest(".js-card-item").remove()
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

customElements.define("page-wishlist", PageWishlist)
