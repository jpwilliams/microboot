function Microboot (options) {
    this.options = options

    return this
}

Microboot.prototype.up = require('./lib/up')
Microboot.prototype.down = require('./lib/down')

module.exports = new Microboot()