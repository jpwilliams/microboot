var up_init = require('../../lib/up')
var up = up_init(__dirname)

describe('microboot/lib/up', function () {
    beforeEach(function () {
        global.database = false
        global.endpoints = false
        global.end1 = false
        global.end2 = false
        global.end3 = false
        global.end4 = false
    })

    it('should export init function', function () {
        expect(up_init).to.be.a('function')
    })

    it('should return up function', function () {
        expect(up).to.be.a('function')
    })

    it('should fail if first argument is not an array', function () {
        expect(up).to.throw('Phases on bootup must be an array')
    })

    it('should succeed if passed no phases', function () {
        var callback = sinon.spy()

        up([], callback)
        expect(callback).to.have.been.called
    })

    it('should succeed if passed valid phases but no callback', function () {
        expect(up.bind(up, ['../data/fake'])).to.not.throw()
    })

    it('should search for phases based on CWD', function () {
        expect(up.bind(up, ['na'])).to.throw('Cannot resolve path')
    })

    it('should fail if passed invalid phases', function () {
        expect(up.bind(up, ['na'])).to.throw('Cannot resolve path')
    })

    it('should fail if passed a mixture of valid and invalid phases', function () {
        expect(up.bind(up, ['../data/fake', 'na'])).to.throw('Cannot resolve path')
    })

    it('should run database and endpoints phase', function (done) {
        this.slow(200)

        up(['../data/fake'], function () {
            expect(global.database).to.equal(true)
            expect(global.endpoints).to.equal(true)

            done()
        })
    })

    it('should run items in order', function (done) {
        up(['../data/timings/first'], function () {
            expect(global.end1).to.be.below(global.end2)

            done()
        })
    })

    it('should run phases in order', function (done) {
        up(['../data/timings/second', '../data/timings/first'], function () {
            expect(global.end3).to.be.below(global.end4)
            expect(global.end4).to.be.below(global.end1)
            expect(global.end1).to.be.below(global.end2)

            done()
        })
    })

    it ('should fail if a non-function callback is provided', function () {
        expect(up.bind(up, [], {})).to.throw('optional callback on bootup must be a function')
    })
})