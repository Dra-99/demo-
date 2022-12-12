const response = {
    set status(value) {
        this.res.statusCode = value
    },
    _body: '',

    set body(value) {
        this._body = value
    },

    get body() {
        return this._body
    }
}

module.exports = response