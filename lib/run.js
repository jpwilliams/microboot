var debug = require('debug')('microboot:run')

module.exports = run

function run (callbacks, callback) {
    var remaining = [].concat(callbacks)
    var next = remaining.shift()

    if (typeof callback !== 'function') {
        throw new Error('Error running phases; invalid callback specified')
    }

    if (!next) {
        debug('Boot completed.')

        return callback()
    }

    debug('- running "' + next.name + '"')

    var async = !!next.length

    if (!async) {
        next()

        return run(remaining, callback)
    }

    return next(function (err) {
        if (err) {
            throw err
        }

        return run(remaining, callback)
    })
}