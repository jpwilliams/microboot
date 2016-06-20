module.exports = function async_exception (next) {
    return next(new Error('Error thrown'))
}