var debugLoad = require('debug')('microboot:load')
var microloader = require('microloader')

module.exports = load

function load (paths) {
  var callbacks = []

  microloader(paths, {
    absolute: true
  }).forEach(function (file) {
    debugLoad('- loading "' + file + '"...')

    var ret = require(file)

    if (typeof ret === 'function') {
      debugLoad('- loaded "' + file + '" and added' + (ret.name ? (' "' + ret.name + '"') : '') + ' to list')

      callbacks.push({
        func: ret,
        path: file
      })
    } else {
      debugLoad('- loaded "' + ret + '"')
    }
  })

  debugLoad('- loaded ' + callbacks.length + ' functions')

  return callbacks
}
