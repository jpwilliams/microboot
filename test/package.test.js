/* global describe, it, expect */
var microboot = require('..')

describe('microboot', function () {
  it('should export a function', function () {
    expect(microboot).to.be.a('function')
  })
})
