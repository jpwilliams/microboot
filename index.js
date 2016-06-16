function Microboot (options) {
    this.options = options

    return this
}

Microboot.prototype.up = require('./lib/up')

module.exports = new Microboot()