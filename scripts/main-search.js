class MainSearch extends HTMLElement {
    constructor() {
        super()

        this.input = this.querySelector(
            '.template-main-search input[type="search"]'
        )
        this.tabPanels = [...this.querySelectorAll(".js-tabpanel")]
        this.parent = this.closest("div")
        this.mainSearchHeader = document.querySelector(".js-main-search-header")
        this.mainHeader = document.querySelector(
            "#shopify-section-header"
        ).offsetHeight

        this.tempTotalWrapper = this.querySelector(
            ".template-main-search__wrapper"
        )
        this.mainSearchHeaderPos =
            this.mainSearchHeader.getBoundingClientRect().top +
            window.pageYOffset -
            this.mainHeader

        this.searchParams = new URLSearchParams(window.location.search)
        this.tempTotal = 0
        this.initialize()
    }

    initialize() {
        const form = this.querySelector("form.search")
        form.addEventListener("submit", this.onFormSubmit.bind(this))
        this.input.focus()
        this.input.setSelectionRange(
            this.input.value.length,
            this.input.value.length
        )

        this.input.addEventListener(
            "input",
            this.debounce((event) => {
                this.onChange(event)
            }, 500).bind(this)
        )

        let qParam = this.searchParams.get("q")
        if (qParam) {
            setTimeout(() => {
                window.scrollTo({
                    top: this.mainSearchHeaderPos,
                    behavior: "smooth",
                })
            }, "1")
        }
    }

    getQuery() {
        return this.input.value.trim()
    }

    onFormSubmit(event) {
        if (!this.getQuery().length) event.preventDefault()
    }

    onChange() {
        const searchTerm = this.getQuery()

        if (!searchTerm.length) {
            return
        }

        if (searchTerm.length < 3) {
            return
        }

        this.getSearchResults(searchTerm)
    }

    getSearchResults(searchTerm) {
        this.setLiveRegionLoadingState()

        // get string params URL
        let typeParam = this.searchParams.get("type")

        // make new string URL
        let newSearchParams = new URLSearchParams()

        // add new type URL
        if (typeParam === "product") {
            newSearchParams.set("type", "product")
        } else if (typeParam === "article") {
            newSearchParams.set("type", "article")
        } else if (typeParam === "page") {
            newSearchParams.set("type", "page")
        } else {
            newSearchParams.set("sort_by", "price-ascending")
        }

        newSearchParams.set("q", encodeURIComponent(searchTerm))

        let route = `${window.Shopify.routes.root}search`

        fetch(`${route}?${newSearchParams}&section_id=main-search`)
            .then((response) => {
                if (!response.ok) {
                    var error = new Error(response.status)
                    this.unsetLiveRegionLoadingState()
                    throw error
                }

                return response.text()
            })
            .then((text) => {
                const resultsMarkup = new DOMParser()
                    .parseFromString(text, "text/html")
                    .querySelector(".main-search__wrapper").innerHTML
                this.renderSearchResults(resultsMarkup)
                // update string URL
                history.pushState(null, null, "?" + newSearchParams.toString())
                console.log(this.mainSearchHeaderPos)
                setTimeout(() => {
                    window.scrollTo({
                        top: this.mainSearchHeaderPos,
                        behavior: "smooth",
                    })
                }, "1")
                //window.scrollTo(mainSearchHeaderPos, 0)
            })
            .catch((error) => {
                this.unsetLiveRegionLoadingState()
                throw error
            })
    }

    renderSearchResults(resultsMarkup) {
        this.parent.innerHTML = resultsMarkup
        this.unsetLiveRegionLoadingState()
    }

    setLiveRegionLoadingState() {
        this.setAttribute("loading", true)
    }

    unsetLiveRegionLoadingState() {
        this.removeAttribute("loading")
    }

    debounce = (fn, wait) => {
        let t
        return (...args) => {
            clearTimeout(t)
            t = setTimeout(() => fn.apply(this, args), wait)
        }
    }
}

customElements.define("main-search", MainSearch)

class SearchLoadMore extends HTMLElement {
    constructor() {
        super()
        window.currentPage = 1
        this.querySelector(".js-search-load-more").addEventListener(
            "click",
            this.loadNextPage.bind(this)
        )
    }

    getQueryForSearchPagination(sectionId) {
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
        const sectionId = document.getElementById("main-search-terms-grid")
            .dataset.id
        window.currentPage++
        const query = this.getQueryForSearchPagination(sectionId)
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
        const postGrid = content.getElementById("main-search-terms-grid")
        const innerHTML = postGrid.innerHTML
        const itemsFetched = parseInt(
            content.querySelector(".js-terms-count").innerHTML
        )
        const totalProducts = parseInt(
            content.querySelector(".js-total-terms-count").innerHTML
        )

        document.querySelector(".js-terms-count").innerHTML =
            itemsFetched >= totalProducts ? totalProducts : itemsFetched
        if (postGrid.querySelector(".js-main-search-item")) {
            document
                .getElementById("main-search-terms-grid")
                .insertAdjacentHTML("beforeend", innerHTML)
        }
        if (itemsFetched >= totalProducts) {
            document.querySelector(".js-search-load-more").style.display =
                "none"
        }
    }
}

customElements.define("search-load-more", SearchLoadMore)
