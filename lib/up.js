var debug = require('debug')('microboot:up')
var load = require('./loader').load
var run = require('./run')
var working_dir

module.exports = function (root) {
    working_dir = root

    return up
}

function up (phases, callback) {
    this.opts = this.opts || {}

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

    var funcs = load(working_dir, phases)

    debug('Running phases...')

    run(funcs, callback)
}