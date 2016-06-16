var debug = require('debug')('microboot:load')
var fs = require('fs')
var path = require('path')

module.exports = load

function load (phases, callback, callbacks) {
    callbacks = callbacks || []
    var folders = [].concat(phases)
    var folder = folders.shift()
    var absolute_folder = path.resolve(folder)

    debug('- loading "' + folder + '"')

    var files = fs.readdirSync(absolute_folder)

    files.sort()

    for (var i = 0; i < files.length; i++) {
        var absolute_file = path.resolve(absolute_folder, files[i])
        callbacks.push(require(absolute_file))
    }

    if (!folders.length) {
        return callback(callbacks)
    }

    return load(folders, callback, callbacks)
}