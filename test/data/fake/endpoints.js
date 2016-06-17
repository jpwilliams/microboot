module.exports = function endpoints (next) {
    setTimeout(function () {
        global.endpoints = true

        return next()
    }, 50)
}