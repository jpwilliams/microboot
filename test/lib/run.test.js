/* global describe, it, expect, sinon */
var run = require('../../lib/run')
var resolve = require('path').resolve

describe('microboot/lib/run', function () {
  it('should return the "run" function', function () {
    expect(run).to.be.a('function')
  })

  it('should return immediately if no callbacks are given', function () {
    var callback = sinon.spy()

    run([], {}, callback)
    expect(callback).to.have.been.called
  })

  it('should throw if invalid objects given to run', function () {
    expect(run.bind(run, [{
      path: 'anything/here.js'
    }], {}, function () {})).to.throw('Error running phases; invalid phases provided')

    expect(run.bind(run, [{
      func: function () {}
    }], {}, function () {})).to.throw('Error running phases; invalid phases provided')

    expect(run.bind(run, [{
      func: 'notafunction'
    }], {}, function () {})).to.throw('Error running phases; invalid phases provided')

    expect(run.bind(run, [{
      func: function () {},
      path: function () {}
    }], {}, function () {})).to.throw('Error running phases; invalid phases provided')
  })

  it('should throw on a usual synchronous error', function () {
    var syncException = require(resolve('test/data/errors/02_sync_exception'))

    expect(run.bind(run, [{
      func: syncException,
      path: 'anything'
    }], {}, function () {})).to.throw('Error thrown')
  })

  it('should handle throwing an asynchronous error', function () {
    var asyncException = require(resolve('test/data/errors/03_async_exception'))

    expect(run.bind(run, [{
      func: asyncException,
      path: 'anything'
    }], {}, function () {})).to.throw('Error thrown')
  })

  it('should throw if no callback is given', function () {
    expect(run.bind(run, [])).to.throw('invalid callback specified')
  })
})
