var chai = require('chai')

var sinonChai = require('sinon-chai')
chai.use(sinonChai)

global.sinon = require('sinon')
global.expect = chai.expect
