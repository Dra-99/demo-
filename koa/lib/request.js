const url = require("url")

const request = {
    get method() {
        return this.req.method
    },
    get header() {
        return this.req.headers
    },
    get url() {
        return this.req.url
    },
    get path() {
        return url.parse(this.req.url).path
    },
    get query() {
        return url.parse(this.req.url).query
    }
}

module.exports = request