var debugLoad = require('debug')('microboot:load')
var resolve = require('path').resolve
var microloader = require('microloader')

module.exports = {
  load: load
}

function load (paths) {
  var callbacks = []

  microloader(paths).forEach(function (file) {
    debugLoad('- loading "' + file + '"...')

    var ret = require(resolve(file))

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
