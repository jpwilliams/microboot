/* global describe, it, expect */
var loader = require('../../lib/loader')
var resolve = require('path').resolve

describe('microboot/lib/loader', function () {
  it('should expose the "load" function', function () {
    expect(loader).to.be.a('function')
  })

  it('should throw if not given an array or string for "paths"', function () {
    var err = 'invalid "paths" argument'

    expect(loader.bind(loader, {})).to.throw(err)
    expect(loader.bind(loader, null)).to.throw(err)
    expect(loader.bind(loader, 123)).to.throw(err)
    expect(loader.bind(loader)).to.throw(err)
  })

  it('should order results by paths then callbacks', function () {
    var first = require(resolve('test/data/timings/first/1'))
    var second = require(resolve('test/data/timings/first/2'))
    var sidejob = require(resolve('test/data/timings/first/3/sidejob'))
    var third = require(resolve('test/data/timings/second/3'))
    var fourth = require(resolve('test/data/timings/second/4'))

    var callbacks = loader([
      'test/data/timings/second',
      'test/data/timings/first'
    ])

    expect(callbacks).to.be.an('array')
    expect(callbacks).to.have.lengthOf(5)

    expect(callbacks[0].func).to.equal(third)
    expect(callbacks[0].path).to.equal('test/data/timings/second/3.js')

    expect(callbacks[1].func).to.equal(fourth)
    expect(callbacks[1].path).to.equal('test/data/timings/second/4.js')

    expect(callbacks[2].func).to.equal(first)
    expect(callbacks[2].path).to.equal('test/data/timings/first/1.js')

    expect(callbacks[3].func).to.equal(second)
    expect(callbacks[3].path).to.equal('test/data/timings/first/2.js')

    expect(callbacks[4].func).to.equal(sidejob)
    expect(callbacks[4].path).to.equal('test/data/timings/first/3/sidejob.js')
  })

  it('should load all, but only add functions to run later', function () {
    var callbacks = loader(['test/data/errors'])

    expect(global.testObj).to.be.an('object')
    expect(global.testObj.foo).to.equal('bar')

    expect(callbacks).to.be.an('array')
    expect(callbacks).to.have.lengthOf(2)

    expect(callbacks[0].func).to.be.a('function')
    expect(callbacks[1].func).to.be.a('function')
  })

  it('should return an empty array if no paths are given', function () {
    var callbacks = loader([])

    expect(callbacks).to.be.an('array')
    expect(callbacks).to.be.empty
  })

  it('should return an array of callbacks if successful', function () {
    var callbacks = loader(['test/data/timings'])

    expect(callbacks).to.be.an('array')
    expect(callbacks).to.have.lengthOf(5)

    expect(callbacks[0].func).to.be.a('function')
    expect(callbacks[1].func).to.be.a('function')
    expect(callbacks[2].func).to.be.a('function')
    expect(callbacks[3].func).to.be.a('function')
    expect(callbacks[4].func).to.be.a('function')
  })
})
