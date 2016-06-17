var up = require('../../lib/up')

describe('microboot/lib/up', function () {
    beforeEach(function () {
        global.database = false
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

    it('should succeed if passed no phases', function () {
        var callback = sinon.spy()

        up([], callback)
        expect(callback).to.have.been.called
    })

    it('should search for phases based on CWD', function () {
        expect(up.bind(up, ['na'])).to.throw(process.cwd() + '/na')
    })

    it('should fail if passed invalid phases', function () {
        expect(up.bind(up, ['na'])).to.throw('no such file or directory')
    })

    it('should fail if passed a mixture of valid and invalid phases', function () {
        expect(up.bind(up, ['test/data/fake', 'na'])).to.throw('no such file or directory')
    })

    it('should run database phase', function (done) {
        up(['test/data/fake'], function () {
            expect(global.database).to.equal(true)

            done()
        })
    })

    it('should run items in order', function (done) {
        up(['test/data/timings/first'], function () {
            expect(global.end1).to.be.below(global.end2)

            done()
        })
    })

    it('should run phases in order', function (done) {
        up(['test/data/timings/second', 'test/data/timings/first'], function () {
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