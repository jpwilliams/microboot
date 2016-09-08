module.exports = function async_exception (arg, next) {
    return next(new Error('Error thrown'))
}