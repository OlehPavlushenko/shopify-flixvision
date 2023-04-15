class MainSearch extends HTMLElement {
    constructor() {
        super()
        this.route = "/search"
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
            }, 300).bind(this)
        )

        this.tabPanels.forEach((tabPanel, i) => {
            this.onTabPanel(tabPanel)
        })

        this.updateCounter()
    }

    updateCounter() {
        const counter = this.querySelector(".total-counter")
        this.tempTotal = this.tempTotalWrapper.dataset.liquidTotal
        if (counter) {
            counter.textContent = this.tempTotal
        }
    }

    onTabPanel(tabPanel) {
        const loadMore = tabPanel.querySelector(".load-more")
        const limit = tabPanel.dataset.limit || 0
        const step = tabPanel.dataset.step || 0
        const pageCount = Math.ceil(limit / step)

        let currentPage = 1
        currentPage = this.showItems(
            tabPanel,
            currentPage,
            limit,
            step,
            pageCount,
            loadMore
        )

        this.unsetLiveRegionLoadingState()

        if (loadMore) {
            loadMore.addEventListener("click", () => {
                currentPage = this.showItems(
                    tabPanel,
                    currentPage + 1,
                    limit,
                    step,
                    pageCount,
                    loadMore
                )
            })
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
        const queryKey = searchTerm.replace(" ", "-").toLowerCase()
        this.setLiveRegionLoadingState()

        fetch(
            `${this.route}?q=${encodeURIComponent(
                searchTerm
            )}&${encodeURIComponent(
                "resources[type]"
            )}=product,article,collection,page&${encodeURIComponent(
                "resources[options][fields]"
            )}=product_type,tag,title,variants.title,vendor&section_id=main-search`
        )
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

    showItems(tabPanel, pageIndex, limit, step, pageCount, loadMore) {
        this.showLoadMore(pageCount, pageIndex, loadMore)

        const startRange = (pageIndex - 1) * step
        const endRange = pageIndex == pageCount ? limit : pageIndex * step
        const items = tabPanel.querySelectorAll(".grid__item")
        const counter = tabPanel.querySelector(".counter")

        if (items.length) {
            for (let i = startRange + 1; i <= endRange; i++) {
                if (items[i - 1]) {
                    items[i - 1].classList.remove("hidden")
                }
            }
        }

        if (counter) {
            counter.textContent = `Showing ${endRange} of ${limit}`
        }

        return pageIndex
    }

    showLoadMore(pageCount, pageIndex, loadMore) {
        if (loadMore) {
            if (pageCount === pageIndex) {
                loadMore.classList.add("hidden")
            } else {
                loadMore.classList.remove("hidden")
            }
        }
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
