var microboot = require('..')

describe('microboot', function () {
    it('should export up function', function () {
        expect(microboot.up).to.be.a('function')
    })
})