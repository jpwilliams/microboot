function Microboot () {
    return this
}

Microboot.prototype.up = require('./lib/up')
Microboot.prototype.options = require('./lib/options')

module.exports = new Microboot()