class GridListView extends HTMLElement {
    constructor() {
        super()

        this.gridBtn = this.querySelector(".js-grid-view")
        this.listBtn = this.querySelector(".js-list-view")
        this.productGrid = document.querySelector(".js-product-grid")

        this.gridBtn.addEventListener(
            "click",
            ((event) => {
                event.preventDefault()
                this.gridBtn.classList.add("active")
                this.listBtn.classList.remove("active")
                this.switchView("grid")
            }).bind(this)
        )

        this.listBtn.addEventListener(
            "click",
            ((event) => {
                event.preventDefault()
                this.listBtn.classList.add("active")
                this.gridBtn.classList.remove("active")
                this.switchView("list")
            }).bind(this)
        )

        this.checkLocalStorage()
    }

    switchView(view) {
        if (view === "grid") {
            this.productGrid.classList.add("grid")
            this.productGrid.classList.remove("list")
        } else if (view === "list") {
            this.productGrid.classList.add("list")
            this.productGrid.classList.remove("grid")
        }
        // Save the state to local storage
        localStorage.setItem("view", view)
    }

    checkLocalStorage() {
        const previousView = localStorage.getItem("view")
        if (previousView) {
            this.switchView(previousView)
            if (previousView === "grid") {
                this.gridBtn.classList.add("active")
                this.listBtn.classList.remove("active")
            } else {
                this.listBtn.classList.add("active")
                this.gridBtn.classList.remove("active")
            }
        } else {
            // Default view is grid
            this.switchView("grid")
            this.gridBtn.classList.add("active")
            this.listBtn.classList.remove("active")
        }
    }
}

customElements.define("grid-list-view", GridListView)
