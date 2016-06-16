module.exports = function first (next) {
    global.end1 = new Date().getTime()

    setTimeout(function () {
        return next()
    }, 2)
}