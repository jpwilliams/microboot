module.exports = function second (next) {
    global.end4 = new Date().getTime()

    setTimeout(function () {
        return next()
    }, 2)
}