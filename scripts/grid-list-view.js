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
