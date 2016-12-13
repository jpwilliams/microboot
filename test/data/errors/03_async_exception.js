module.exports = function asyncException (arg, next) {
  return next(new Error('Error thrown'))
}
