var microboot = require('..')

describe('microboot', function () {
    it('should export up function', function () {
        expect(microboot.up).to.be.a('function')
    })

    it('should export options function', function () {
        expect(microboot.options).to.be.a('function')
    })

    it('should export opts object', function () {
        expect(microboot.opts).to.be.an('object')
    })
})