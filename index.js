const Microboot = require('./lib/Microboot')

function microboot (stages = [], arg, callback) {
  if (!arg) {
    arg = {}
  } else if (!callback && typeof arg === 'function') {
    callback = arg
    arg = {}
  }

  if (callback && typeof callback !== 'function') {
    throw new Error('Callback passed but not a function', callback)
  }

  const microboot = new Microboot(stages, arg)
  const boot = microboot.boot()

  if (!callback) {
    return boot
  }

  boot.then((arg) => callback(null, arg)).catch(callback)
}

module.exports = microboot
