module.exports = function second (next) {
    global.end2 = new Date().getTime()

    setTimeout(function () {
        return next()
    }, 2)
}