var debug = require('debug')('microboot:up')
var load = require('./loader').load
var run = require('./run')

module.exports = function up (phases, callback) {
    if (!(phases instanceof Array)) {
        throw new Error('Phases on bootup must be an array')
    }

    if (callback && typeof callback !== 'function') {
        throw new Error('The optional callback on bootup must be a function if defined')
    }

    callback = callback || function () {}

    if (!phases.length) {
        return callback()
    }

    debug('Loading phases...')

    var funcs = load(phases, !this.options.no_recursive)

    debug('Running phases...')

    run(funcs, callback)
}