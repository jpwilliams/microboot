var debug = require('debug')('microboot:run')

module.exports = run

function run (callbacks, callback) {
    var remaining = [].concat(callbacks)
    var next = remaining.shift()

    debug('- running "' + next.name + '"')

    next(function () {
        if (!remaining.length) {
            return callback()
        }

        return run(remaining, callback)
    })
}