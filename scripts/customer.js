const selectors = {
    customerAddresses: "[data-customer-addresses]",
    addressCountrySelect: "[data-address-country-select]",
    addressContainer: "[data-address]",
    modalContainer: "[data-address-modal]",
    toggleAddressButton: "button[aria-expanded]",
    cancelAddressButton: 'button[type="reset"]',
    deleteAddressButton: "button[data-confirm-message]",
}

const attributes = {
    expanded: "aria-expanded",
    confirmMessage: "data-confirm-message",
}

class CustomerAddresses {
    constructor() {
        this.elements = this._getElements()
        if (Object.keys(this.elements).length === 0) return
        this._setupCountries()
        this._setupEventListeners()
    }

    _getElements() {
        const container = document.querySelector(selectors.customerAddresses)
        return container
            ? {
                  container,
                  addressContainer: container.querySelector(
                      selectors.addressContainer
                  ),
                  toggleButtons: document.querySelectorAll(
                      selectors.toggleAddressButton
                  ),
                  cancelButtons: container.querySelectorAll(
                      selectors.cancelAddressButton
                  ),
                  deleteButtons: container.querySelectorAll(
                      selectors.deleteAddressButton
                  ),
                  countrySelects: container.querySelectorAll(
                      selectors.addressCountrySelect
                  ),
              }
            : {}
    }

    _setupCountries() {
        if (Shopify && Shopify.CountryProvinceSelector) {
            // eslint-disable-next-line no-new
            new Shopify.CountryProvinceSelector(
                "AddressCountryNew",
                "AddressProvinceNew",
                {
                    hideElement: "AddressProvinceContainerNew",
                }
            )
            this.elements.countrySelects.forEach((select) => {
                const formId = select.dataset.formId
                // eslint-disable-next-line no-new
                new Shopify.CountryProvinceSelector(
                    `AddressCountry_${formId}`,
                    `AddressProvince_${formId}`,
                    {
                        hideElement: `AddressProvinceContainer_${formId}`,
                    }
                )
            })
        }
    }

    _setupEventListeners() {
        this.elements.toggleButtons.forEach((element) => {
            element.addEventListener("click", this._handleAddEditButtonClick)
        })
        this.elements.cancelButtons.forEach((element) => {
            element.addEventListener("click", this._handleCancelButtonClick)
        })
        this.elements.deleteButtons.forEach((element) => {
            element.addEventListener("click", this._handleDeleteButtonClick)
        })
        document.addEventListener("keydown", this._handleEscKeyPress)
    }

    _toggleBodyScroll() {
        const bodyClassList = document.body.classList
        const overflowHiddenClass = "overflow-hidden"

        bodyClassList.contains(overflowHiddenClass)
            ? bodyClassList.remove(overflowHiddenClass)
            : bodyClassList.add(overflowHiddenClass)
    }

    _toggleExpanded(target) {
        target.setAttribute(
            attributes.expanded,
            (target.getAttribute(attributes.expanded) === "false").toString()
        )
    }

    _handleAddEditButtonClick = ({ currentTarget }) => {
        this._toggleExpanded(currentTarget)
        const modal = currentTarget.parentNode.querySelector(
            selectors.modalContainer
        )
        this._toggleBodyScroll()
        trapFocus(modal, modal.querySelector("input[id]"))
    }

    _handleCancelButtonClick = ({ currentTarget }) => {
        const originalFocusLocation = currentTarget
            .closest(selectors.addressContainer)
            .querySelector(`[${attributes.expanded}]`)
        this._toggleExpanded(originalFocusLocation)
        this._toggleBodyScroll()
        removeTrapFocus(originalFocusLocation)
    }

    _handleEscKeyPress = (e) => {
        let isEscPressed = e.key === "Escape" || e.keyCode === 27
        if (!isEscPressed) {
            return
        }
        const expandedTarget = document.querySelector("[aria-expanded='true']")
        this._toggleExpanded(expandedTarget)
        removeTrapFocus(expandedTarget)
    }

    _handleDeleteButtonClick = ({ currentTarget }) => {
        // eslint-disable-next-line no-alert
        if (confirm(currentTarget.getAttribute(attributes.confirmMessage))) {
            Shopify.postLink(currentTarget.dataset.target, {
                parameters: { _method: "delete" },
            })
        }
    }
}
