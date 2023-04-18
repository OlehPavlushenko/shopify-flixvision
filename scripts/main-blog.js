class BlogLoadMore extends HTMLElement {
    constructor() {
        super()
        window.currentPage = 1
        this.querySelector(".js-blog-load-more").addEventListener(
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
        const sectionId = document.getElementById("main-blog-post-grid").dataset
            .id
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
        const postGrid = content.getElementById("main-blog-post-grid")
        const innerHTML = postGrid.innerHTML
        const itemsFetched = parseInt(
            content.querySelector(".js-post-count").innerHTML
        )
        const totalProducts = parseInt(
            content.querySelector(".js-total-post-count").innerHTML
        )

        document.querySelector(".js-post-count").innerHTML =
            itemsFetched >= totalProducts ? totalProducts : itemsFetched
        if (postGrid.querySelector(".article")) {
            document
                .getElementById("main-blog-post-grid")
                .insertAdjacentHTML("beforeend", innerHTML)
        }
        if (itemsFetched >= totalProducts) {
            document.querySelector(".js-blog-load-more").style.display = "none"
        }
    }
}

customElements.define("blog-load-more", BlogLoadMore)
