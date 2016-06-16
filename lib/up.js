var debug = require('debug')('microboot:up')
var load = require('./load')
var run = require('./run')

module.exports = function up (phases, callback) {
    if (!(phases instanceof Array)) {
        throw new Error(`Phases on bootup must be an array`)
    }

    if (callback && typeof callback !== 'function') {
        throw new Error(`The optional callback on bootup must be a function if defined`)
    }

    callback = callback || function () {}

    if (!phases.length) {
        return callback()
    }

    debug('Loading phases...')

    load(phases, function (callbacks) {
        debug('Running phases...', callbacks)

        return run(callbacks, callback)
    })
}