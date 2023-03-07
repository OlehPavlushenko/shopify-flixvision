class DetailsOpen extends HTMLElement {
    constructor() {
        super()
        this.detailsContainer = this.querySelector('.js-details')
        this.summaryToggle = this.querySelector('.js-summary')

        this.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close()
            }
        })

        this.summaryToggle.addEventListener(
            'click',
            ((event) => {
                this.onSummaryClick(event)
            }).bind(this)
        )

        if (this.querySelector('.js-modal-close-btn')) {
            this.querySelector('.js-modal-close-btn').addEventListener(
                'click',
                this.close.bind(this)
            )
        }

        this.summaryToggle.setAttribute('role', 'button')
    }

    onSummaryClick(event) {
        event.preventDefault()
        event.target.closest('details-open').classList.contains('open')
            ? this.close()
            : this.open(event)
    }

    onBodyClick(event) {
        if (
            !this.detailsContainer.contains(event.target) &&
            !this.summaryToggle.contains(event.target)
        ) {
            this.close(false)
        }
    }

    open(event) {
        this.onBodyClickEvent =
            this.onBodyClickEvent || this.onBodyClick.bind(this)

        event.target.closest('details-open').classList.add('open')
        document.body.addEventListener('click', this.onBodyClickEvent)
        if (event.target.classList.contains('search-modal__toggle-open')) {
            trapFocus(
                this.detailsContainer,
                this.detailsContainer.querySelector(
                    'input:not([type="hidden"])'
                )
            )
        } else {
            trapFocus(this.detailsContainer)
        }
    }

    close(focusToggle = true) {
        removeTrapFocus(focusToggle ? this.summaryToggle : null)
        if (this.detailsContainer.classList.contains('search-modal')) {
            this.detailsContainer.querySelector('.js-modal-input').value = ''
            this.detailsContainer
                .querySelector('header-search')
                .removeAttribute('results')
            this.detailsContainer
                .querySelector('header-search')
                .removeAttribute('open')
        }
        this.classList.remove('open')
        document.body.removeEventListener('click', this.onBodyClickEvent)
    }
}

customElements.define('details-open', DetailsOpen)
