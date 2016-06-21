var dirname = require('path').dirname
var working_dir = dirname(module.parent.filename)

var up = require('./lib/up')(working_dir)
up.up = up

module.exports = up