class MainSearch extends HTMLElement {
    constructor() {
        super()

        this.input = this.querySelector(
            '.template-main-search input[type="search"]'
        )
        this.tabPanels = [...this.querySelectorAll(".js-tabpanel")]
        this.parent = this.closest("div")

        this.tempTotalWrapper = this.querySelector(
            ".template-main-search__wrapper"
        )
        this.tempTotal = 0
        this.initialize()
    }

    initialize() {
        const form = this.querySelector("form.search")
        form.addEventListener("submit", this.onFormSubmit.bind(this))

        this.input.addEventListener(
            "input",
            this.debounce((event) => {
                this.onChange(event)
            }, 500).bind(this)
        )
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

        let searchParams = new URLSearchParams(window.location.search)

        // get string params URL
        let typeParam = searchParams.get("type")

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
        console.log("set")
    }

    unsetLiveRegionLoadingState() {
        this.removeAttribute("loading")
        console.log("unset")
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
