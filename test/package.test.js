var microboot = require('..')

describe('microboot', function () {
    it('should export a function', function () {
        expect(microboot).to.be.a('function')
    })

    it('should export "up" as a circular reference', function () {
        expect(microboot.up).to.equal(microboot)
    })
})