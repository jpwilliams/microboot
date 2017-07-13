/* global describe, before, it, expect */
var microboot = require('../../')

describe('microboot', function () {
  before(function () {
    global.fileLoaded = false
  })

  it('should export microboot function', function () {
    expect(microboot).to.be.a('function')
  })

  it('should ignore first argument being undefined', function (done) {
    microboot()
      .then(() => done())
      .catch(done)
  })

  it('should ignore first argument being an empty string', function (done) {
    microboot('')
      .then(() => done())
      .catch(done)
  })

  it('should handle first argument being a string', function (done) {
    microboot('test/data/fake')
      .then((arg) => {
        expect(arg.database).to.equal(true)
        expect(arg.endpoints).to.equal(true)
        done()
      })
      .catch(done)
  })

  it('should handle first argument being an empty array', function (done) {
    microboot([])
      .then(() => done())
      .catch(done)
  })

  it('should handle first argument being an array with an empty string', function (done) {
    microboot([''])
      .then(() => done())
      .catch(done)
  })

  it('should handle first argument being an array with a string', function (done) {
    microboot(['test/data/fake'])
      .then((arg) => {
        expect(arg.database).to.equal(true)
        expect(arg.endpoints).to.equal(true)
        done()
      })
      .catch(done)
  })

  it('should return callback if given callback', function (done) {
    microboot('', null, (err) => done(err))
  })

  it('should handle callback if given in arg position', function (done) {
    microboot('', (err) => done(err))
  })

  it('should return promise if not given callback', function () {
    const r = microboot()
    expect(r).to.be.a('promise')
    expect(r.then).to.be.a('function')
  })

  it('should return undefined if callback given', function () {
    const r = microboot('', null, () => {})
    expect(r).to.equal(undefined)
  })

  it('should return undefined if callback given in arg position', function () {
    const r = microboot('', () => {})
    expect(r).to.equal(undefined)
  })

  it('should run items in order via promises', function (done) {
    microboot(['test/data/timings/first'])
      .then((arg) => {
        expect(arg.end1).to.be.below(arg.end2)
        done()
      }).catch(done)
  })

  it('should run items in order via callbacks', function (done) {
    microboot(['test/data/timings/first'], (err, arg) => {
      expect(err).to.equal(null)
      expect(arg.end1).to.be.below(arg.end2)
      done()
    })
  })

  it('should run phases in order via promises', function (done) {
    microboot([
      'test/data/timings/second',
      'test/data/timings/first'
    ]).then((arg) => {
      expect(arg.end3).to.be.below(arg.end4)
      expect(arg.end4).to.be.below(arg.end1)
      expect(arg.end1).to.be.below(arg.end2)
      done()
    }).catch(done)
  })

  it('should run phases in order via callbacks', function (done) {
    microboot([
      'test/data/timings/second',
      'test/data/timings/first'
    ], (err, arg) => {
      expect(err).to.equal(null)
      expect(arg.end3).to.be.below(arg.end4)
      expect(arg.end4).to.be.below(arg.end1)
      expect(arg.end1).to.be.below(arg.end2)
      done()
    })
  })

  it('should not catch hidden files or folders', function (done) {
    microboot('test/data/fake')
      .then((arg) => {
        expect(arg.mark).to.not.equal(true)
        done()
      }).catch(done)
  })

  it('should fail if a non-function callback is given', function () {
    expect(microboot.bind(null, null, {}, {})).to.throw('Callback passed but not a function')
  })

  it('should wait for promise completion if no callback provided', function (done) {
    this.slow(4000)

    microboot('test/data/promise')
      .then((arg) => {
        expect(arg.awaitRun).to.equal(true)
        expect(arg.promiseRun).to.equal(true)
        expect(arg.syncRun).to.equal(true)
        done()
      }).catch(done)
  })

  it('should throw if an async/await function throws with no callback', function (done) {
    microboot('test/data/throws/awaitThrow')
      .then(() => done(new Error('Should have thrown')))
      .catch((err) => {
        expect(err).to.be.an('error')
        done()
      })
  })

  it('should load and discard files which do not export functions', function (done) {
    microboot('test/data/notAFunc')
      .then(() => {
        expect(global.fileLoaded).to.equal(true)
        done()
      }).catch(done)
  })

  it('should pass callback err if given in callback', function (done) {
    microboot('test/data/throws/callbackThrow', (err, arg) => {
      expect(err).to.be.an('error')
      expect(arg).to.equal(undefined)
      done()
    })
  })
})
