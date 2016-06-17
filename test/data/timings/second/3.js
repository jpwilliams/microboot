module.exports = function third (next) {
    global.end3 = new Date().getTime()

    setTimeout(function () {
        return next()
    }, 2)
}