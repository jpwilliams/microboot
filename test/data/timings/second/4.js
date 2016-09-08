module.exports = function fourth (arg, next) {
    arg.end4 = new Date().getTime()

    setTimeout(function () {
        return next()
    }, 2)
}