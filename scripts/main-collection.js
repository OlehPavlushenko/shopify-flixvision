class GridListView extends HTMLElement {
    constructor() {
        super()

        this.gridBtn = this.querySelector(".js-grid-view")
        this.listBtn = this.querySelector(".js-list-view")
        this.productGrid = document.querySelector(".js-product-grid")
        this.viewButtons = this.querySelectorAll(".js-view-button")

        this.viewButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault()
                this.viewButtons.forEach((btn) => {
                    btn.classList.toggle("active", btn === button)
                })
                const view = button.dataset.view
                this.switchView(view)
            })
        })

        this.checkLocalStorage()
    }

    switchView(view) {
        const activeClass = view === "grid" ? "grid" : "list"
        const inactiveClass = view === "grid" ? "list" : "grid"
        this.productGrid.classList.add(activeClass)
        this.productGrid.classList.remove(inactiveClass)
        localStorage.setItem("view", view)
    }

    checkLocalStorage() {
        const previousView = localStorage.getItem("view") || "grid"
        this.switchView(previousView)
        this.gridBtn.classList.toggle("active", previousView === "grid")
        this.listBtn.classList.toggle("active", previousView === "list")
    }
}

customElements.define("grid-list-view", GridListView)

class CollectionLoadMore extends HTMLElement {
    constructor() {
        super()
        window.currentPage = 1
        this.querySelector(".js-collection-load-more").addEventListener(
            "click",
            this.loadNextPage.bind(this)
        )
    }

    getQueryForBlogPagination(sectionId) {
        const params = new URLSearchParams(window.location.search)
        let query = ""

        for (let p of params) {
            if (p[0] !== "page") {
                if (query !== "") {
                    query += "&"
                }

                query += `${p[0]}=${p[1]}`
            }
        }

        const partQuery = `?section_id=${sectionId}&page=${window.currentPage}${
            query !== "" ? "&" : ""
        }`

        return partQuery + query
    }

    loadNextPage() {
        const sectionId = document.getElementById("product-grid").dataset.id
        window.currentPage++
        const query = this.getQueryForBlogPagination(sectionId)
        fetch(query)
            .then((response) => response.text())
            .then((responseText) => {
                const html = new DOMParser()
                    .parseFromString(responseText, "text/html")
                    .querySelector(`[id*="${sectionId}"]`).innerHTML
                this.renderPostGrid(html)

                const searchParams = new URLSearchParams(query)
                searchParams.delete("section_id")
                history.pushState(null, null, "?" + searchParams.toString())
            })
    }

    renderPostGrid(html) {
        const content = new DOMParser().parseFromString(html, "text/html")
        const postGrid = content.getElementById("product-grid")
        const innerHTML = postGrid.innerHTML
        const itemsFetched = parseInt(
            content.querySelector(".js-product-count").innerHTML
        )
        const totalProducts = parseInt(
            content.querySelector(".js-total-product-count").innerHTML
        )

        document.querySelector(".js-product-count").innerHTML =
            itemsFetched >= totalProducts ? totalProducts : itemsFetched
        if (postGrid.querySelector(".template-main-collection__item")) {
            document
                .getElementById("product-grid")
                .insertAdjacentHTML("beforeend", innerHTML)
        }
        if (itemsFetched >= totalProducts) {
            document.querySelector(".js-collection-load-more").style.display =
                "none"
        }
    }
}

customElements.define("collection-load-more", CollectionLoadMore)
