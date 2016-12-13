module.exports = function second (arg, next) {
  arg.end2 = new Date().getTime()

  setTimeout(function () {
    return next()
  }, 2)
}
