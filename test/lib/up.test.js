/* global describe, beforeEach, it, expect, sinon */
var up = require('../../lib/up')

describe('microboot/lib/up', function () {
  beforeEach(function () {
    global.database = false
    global.endpoints = false
    global.end1 = false
    global.end2 = false
    global.end3 = false
    global.end4 = false
  })

  it('should export up function', function () {
    expect(up).to.be.a('function')
  })

  it('should fail if first argument is not an array', function () {
    expect(up).to.throw('Phases on bootup must be an array')
  })

  it('should succeed if passed no phases and no arg', function () {
    var callback = sinon.spy()

    up([], callback)
    expect(callback).to.have.been.called
  })

  it('should succeed if passed valid phases but no callback', function () {
    expect(up.bind(up, ['test/data/fake'])).to.not.throw()
  })

  it('should succeed if passed valid phases and an arg', function () {
    expect(up.bind(up, ['test/data/fake'], {})).to.not.throw()
  })

  it('should use arg as callback if no callback passed and arg is function', function (done) {
    this.slow(200)

    up(['test/data/fake'], function () {
      done()
    })
  })

  it('should use callback as callback if arg has been specified', function (done) {
    this.slow(200)

    up(['test/data/fake'], function () {}, function () {
      done()
    })
  })

  it('should search for phases based on CWD', function () {
    expect(up.bind(up, ['na'])).to.throw('Cannot resolve path')
  })

  it('should fail if passed invalid phases', function () {
    expect(up.bind(up, ['na'])).to.throw('Cannot resolve path')
  })

  it('should fail if passed a mixture of valid and invalid phases', function () {
    expect(up.bind(up, ['test/data/fake', 'na'])).to.throw('Cannot resolve path')
  })

  it('should run database and endpoints phase', function (done) {
    this.slow(200)

    up(['test/data/fake'], {}, function (arg) {
      expect(arg.database).to.equal(true)
      expect(arg.endpoints).to.equal(true)

      done()
    })
  })

  it('should run items in order', function (done) {
    up(['test/data/timings/first'], function (arg) {
      expect(arg.end1).to.be.below(arg.end2)

      done()
    })
  })

  it('should run phases in order', function (done) {
    up(['test/data/timings/second', 'test/data/timings/first'], function (arg) {
      expect(arg.end3).to.be.below(arg.end4)
      expect(arg.end4).to.be.below(arg.end1)
      expect(arg.end1).to.be.below(arg.end2)

      done()
    })
  })

  it('should fail if a non-function callback is provided', function () {
    expect(up.bind(up, [], {}, {})).to.throw('optional callback on bootup must be a function')
  })
})
