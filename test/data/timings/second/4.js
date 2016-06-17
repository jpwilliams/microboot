module.exports = function fourth (next) {
    global.end4 = new Date().getTime()

    setTimeout(function () {
        return next()
    }, 2)
}