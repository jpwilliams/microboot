var run = require('../../lib/run')
var resolve = require('path').resolve

describe('microboot/lib/run', function () {
    it('should return the "run" function', function () {
        expect(run).to.be.a('function')
    })

    it('should return immediately if no callbacks are given', function () {
        var callback = sinon.spy()

        run([], callback)
        expect(callback).to.have.been.called
    })
    
    it('should throw on a usual synchronous error', function () {
        var sync_exception = require(resolve('test/data/errors/02_sync_exception'))

        expect(run.bind(run, [sync_exception], function () {})).to.throw('Error thrown')
    })
    
    it('should handle throwing an asynchronous error', function () {
        var async_exception = require(resolve('test/data/errors/03_async_exception'))

        expect(run.bind(run, [async_exception], function () {})).to.throw('Error thrown')
    })

    it('should throw if no callback is given', function () {
        expect(run.bind(run, [])).to.throw('invalid callback specified')
    })
})