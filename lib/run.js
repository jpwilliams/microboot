var debug = require('debug')('microboot:run')

module.exports = run

function run (callbacks, arg, callback) {
  var remaining = [].concat(callbacks)
  var next = remaining.shift()

  if (typeof callback !== 'function') {
    throw new Error('Error running phases; invalid callback specified')
  }

  if (!next) {
    debug('Boot completed.')

    return callback(arg)
  }

  if (typeof next.func !== 'function' || typeof next.path !== 'string') {
    throw new Error('Error running phases; invalid phases provided')
  }

  debug('- running ' + (next.func.name ? ('"' + next.func.name + '" (') : '') + next.path + (next.func.name ? ')' : ''))

  var async = next.func.length > 1

  if (!async) {
    next.func(arg)

    return run(remaining, arg, callback)
  }

  return next.func(arg, function (err) {
    if (err) {
      throw err
    }

    return run(remaining, arg, callback)
  })
}
