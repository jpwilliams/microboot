module.exports = function endpoints (arg, next) {
    setTimeout(function () {
        arg.endpoints = true

        return next()
    }, 50)
}