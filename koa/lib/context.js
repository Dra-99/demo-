const context = {}

const defineProperty = (target, name) => {
    Object.defineProperty(context, name, {
        get() {
            return this[target][name]
        },
        set(value) {
            this[target][name] = value
        }
    })
}

defineProperty('request', 'method')
defineProperty('request', 'url')
// defineProperty('request', 'headers')
defineProperty('request', 'path')
defineProperty('response', 'body')


module.exports = context