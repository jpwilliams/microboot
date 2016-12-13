module.exports = function third (arg, next) {
  arg.end3 = new Date().getTime()

  setTimeout(function () {
    return next()
  }, 2)
}
