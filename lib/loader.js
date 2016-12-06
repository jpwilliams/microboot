var debugLoad = require('debug')('microboot:load')
var debugLookup = require('debug')('microboot:lookup')
var exists = require('fs').existsSync
var readdirSync = require('fs').readdirSync
var statSync = require('fs').statSync
var join = require('path').join
var basename = require('path').basename
var resolve = require('path').resolve
var glob = require('glob')

module.exports = {
    load: load,
    lookup: lookup
}

function load (paths) {
    var callbacks = []

    if (!(paths instanceof Array)) {
        throw new Error('Error loading files; invalid "paths" argument', paths)
    }

    paths.forEach(function (path) {
        lookup(path).forEach(function (item) {
            debugLoad('- loading "' + item + '"...')

            var func = require(resolve(item))

            if (typeof func === 'function') {
                debugLoad('- loaded "' + item + '" and added to list')

                callbacks.push(func)
            } else {
                debugLoad('- loaded "' + item + '"')
            }
        })
    })

    debugLoad('- loaded ' + callbacks.length + ' functions')

    return callbacks
}

function lookup (path) {
    debugLookup('- searching "' + path + '"')

    var files = []
    var re = new RegExp('\\.js$')

    if (!exists(path)) {
        if (exists(path + '.js')) {
            path += '.js'
        } else {
            files = glob.sync(path)

            if (!files.length) {
                throw new Error('Cannot resolve path "' + path + '"')
            }

            for (var i = 0; i < files.length; i++) {
                if (!re.test(files[i]) || basename(files[i])[0] === '.') {
                    files.splice(i--, 1)
                } else {
                    debugLookup('- found "' + files[i] + '"')
                }
            }

            return files
        }
    }

    var stat = statSync(path)

    if (stat.isFile()) {
        return [path]
    }

    readdirSync(path).forEach(function (file) {
        file = join(path, file)

        var stat = statSync(file)

        if (stat.isDirectory()) {
            files = files.concat(lookup(file))
        }

        if (!stat.isFile() || !re.test(file) || basename(file)[0] === '.') {
            return
        }

        debugLookup('- found "' + file + '"')

        files.push(file)
    })

    return files
}
