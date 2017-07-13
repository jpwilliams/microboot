module.exports = (arg) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      arg.promiseRun = true
      resolve()
    }, 500)
  })
}
