module.exports = function first (arg, next) {
    arg.end1 = new Date().getTime()

    setTimeout(function () {
        return next()
    }, 2)
}