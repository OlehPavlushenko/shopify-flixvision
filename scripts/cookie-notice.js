class CookiePolicy extends HTMLElement {
    constructor() {
        super()

        this.content = this.querySelector(".js-cookie-policy")
        this.button = this.querySelector(".js-cookie-policy-button")
        this.cookieName = "cookieEnabled"
        this.cookieContentShowClass = "cookie-policy--show"

        if (!!this.getCookie(this.cookieName)) {
            return
        }

        this.show()
        this.button.addEventListener("click", this.close.bind(this))
    }

    getCookie(name) {
        let matches = document.cookie.match(
            new RegExp(
                "(?:^|; )" +
                    name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
                    "=([^;]*)"
            )
        )
        return matches ? decodeURIComponent(matches[1]) : undefined
    }

    show() {
        this.content.classList.add(this.cookieContentShowClass)
    }

    close(event) {
        event.preventDefault()
        this.content.classList.remove(this.cookieContentShowClass)

        this.setCookie(this.cookieName, true)
    }

    setCookie(name, value, options = {}) {
        options = {
            path: "/",
            secure: false,
            ...options,
        }
        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString()
        }
        let updatedCookie =
            encodeURIComponent(name) + "=" + encodeURIComponent(value)
        for (let [key, value] of Object.entries(options)) {
            updatedCookie += "; " + key
            if (value !== true) {
                updatedCookie += "=" + value
            }
        }
        document.cookie = updatedCookie
    }
}

customElements.define("cookie-policy", CookiePolicy)
