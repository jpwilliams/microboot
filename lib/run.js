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

    debug('- running "' + next.name + '"')

    var async = next.length > 1

    if (!async) {
        next(arg)

        return run(remaining, arg, callback)
    }

    return next(arg, function (err) {
        if (err) {
            throw err
        }

        return run(remaining, arg, callback)
    })
}