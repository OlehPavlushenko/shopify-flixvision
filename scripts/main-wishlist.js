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
        let titleResults = document.querySelector(".js-page-wishlist-title")
        if (namesString) {
            titleResults.classList.add("hidden")
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

                        btnAddWishlistAll.forEach((item) => {
                            item.addEventListener("click", (event) => {
                                event.preventDefault()
                                const element = event.currentTarget
                                setTimeout(() => {
                                    element.closest(".js-card-item").remove()
                                    let getRestProducts =
                                        JSON.parse(
                                            localStorage.getItem(
                                                "productsWishlist"
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
}

customElements.define("page-wishlist", PageWishlist)
