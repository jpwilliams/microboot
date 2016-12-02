var debug = require('debug')('microboot')
var load = require('./loader').load
var run = require('./run')

module.exports = function up (phases, arg, callback) {
    this.opts = this.opts || {}

    if (!(phases instanceof Array)) {
        throw new Error('Phases on bootup must be an array')
    }

    if (arg && !callback && typeof arg === 'function') {
        callback = arg
        arg = {}
    }

    if (callback && typeof callback !== 'function') {
        throw new Error('The optional callback on bootup must be a function if defined')
    }

    callback = callback || function () {}
    arg = arg || {}

    if (!phases.length) {
        return callback(arg)
    }

    debug('Loading phases...')

    var funcs = load(phases)

    debug('Running phases...')

    run(funcs, arg, callback)
}
