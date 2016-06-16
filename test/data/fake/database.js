module.exports = function database (next) {
    global.database = true

    return next()
}