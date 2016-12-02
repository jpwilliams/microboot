var loader = require('../../lib/loader')
var resolve = require('path').resolve

describe('microboot/lib/loader', function () {
    it('should expose the "load" function', function () {
        expect(loader.load).to.be.a('function')
    })

    it('should expose the "lookup" function', function () {
        expect(loader.lookup).to.be.a('function')
    })

    describe('-> load', function () {
        it('should throw if not given an array for "paths"', function () {
            var err = 'invalid "paths" argument'

            expect(loader.load.bind(loader.load, 'test')).to.throw(err)
            expect(loader.load.bind(loader.load, {})).to.throw(err)
            expect(loader.load.bind(loader.load, null)).to.throw(err)
            expect(loader.load.bind(loader.load, 123)).to.throw(err)
            expect(loader.load.bind(loader.load)).to.throw(err)
        })

        it('should order results by paths then callbacks', function () {
            var first = require(resolve('test/data/timings/first/1'))
            var second = require(resolve('test/data/timings/first/2'))
            var sidejob = require(resolve('test/data/timings/first/3/sidejob'))
            var third = require(resolve('test/data/timings/second/3'))
            var fourth = require(resolve('test/data/timings/second/4'))

            var callbacks = loader.load([
                'test/data/timings/second',
                'test/data/timings/first'
            ])

            expect(callbacks).to.be.an('array')
            expect(callbacks).to.have.lengthOf(5)

            expect(callbacks[0]).to.equal(third)
            expect(callbacks[1]).to.equal(fourth)
            expect(callbacks[2]).to.equal(first)
            expect(callbacks[3]).to.equal(second)
            expect(callbacks[4]).to.equal(sidejob)
        })

        it('should load all, but only add functions to run later', function () {
            var callbacks = loader.load(['test/data/errors'])

            expect(global.testObj).to.be.an('object')
            expect(global.testObj.foo).to.equal('bar')

            expect(callbacks).to.be.an('array')
            expect(callbacks).to.have.lengthOf(2)

            expect(callbacks[0]).to.be.a('function')
            expect(callbacks[1]).to.be.a('function')
        })

        it('should return an empty array if no paths are given', function () {
            var callbacks = loader.load([])

            expect(callbacks).to.be.an('array')
            expect(callbacks).to.be.empty
        })

        it('should return an array of callbacks if successful', function () {
            var callbacks = loader.load(['test/data/timings'])

            expect(callbacks).to.be.an('array')
            expect(callbacks).to.have.lengthOf(5)

            expect(callbacks[0]).to.be.a('function')
            expect(callbacks[1]).to.be.a('function')
            expect(callbacks[2]).to.be.a('function')
            expect(callbacks[3]).to.be.a('function')
            expect(callbacks[4]).to.be.a('function')
        })
    })

    describe('-> lookup', function () {
        it('should throw if given a non-existent path', function () {
            expect(loader.lookup.bind(loader.lookup, '/test/data/does/not/exist')).to.throw('Cannot resolve path')
        })

        it('should find a single JS file if given an extensionless path', function () {
            var files = loader.lookup('test/data/fake/database')

            expect(files).to.be.an('array')
            expect(files).to.have.lengthOf(1)
            expect(files[0]).to.equal('test/data/fake/database.js')
        })

        it('should not return hidden files', function () {
            var files = loader.lookup('test/data/fake')

            expect(files).to.be.an('array')
            expect(files).to.have.lengthOf(2)
            expect(files).to.not.contain('test/data/fake/.hidden.js')
        })

        it('should not return files that don\'t have the ".js" extension', function () {
            var files = loader.lookup('test/data/fake')

            expect(files).to.be.an('array')
            expect(files).to.have.lengthOf(2)
            expect(files).to.not.contain('test/data/fake/test.jpg')
        })

        it('should remove hidden files when searching an extensionless path', function () {
            var files = loader.lookup('test/data/fake/**')

            expect(files).to.be.an('array')
            expect(files).to.have.lengthOf(2)
            expect(files).to.not.contain('test/data/fake/.hidden.js')
        })

        it('should remove non-.js files when searching an extensionless path', function () {
            var files = loader.lookup('test/data/fake/**')

            expect(files).to.be.an('array')
            expect(files).to.have.lengthOf(2)
            expect(files).to.not.contain('test/data/fake/test.jpg')
        })

        it('should return files ordered', function () {
            var files = loader.lookup('test/data/timings')

            expect(files).to.be.an('array')
            expect(files).to.have.lengthOf(5)

            expect(files[0]).to.equal('test/data/timings/first/1.js')
            expect(files[1]).to.equal('test/data/timings/first/2.js')
            expect(files[2]).to.equal('test/data/timings/first/3/sidejob.js')
            expect(files[3]).to.equal('test/data/timings/second/3.js')
            expect(files[4]).to.equal('test/data/timings/second/4.js')
        })

        it('should find a single JS file if given a specific file', function () {
            var files = loader.lookup('test/data/timings/second/3.js')

            expect(files).to.be.an('array')
            expect(files).to.have.lengthOf(1)
            expect(files[0]).to.equal('test/data/timings/second/3.js')
        })

        it('should recursively search directories if just a path name given', function () {
            var files = loader.lookup('test/data/timings')

            expect(files).to.be.an('array')
            expect(files).to.have.lengthOf(5)

            expect(files[0]).to.equal('test/data/timings/first/1.js')
            expect(files[1]).to.equal('test/data/timings/first/2.js')
            expect(files[2]).to.equal('test/data/timings/first/3/sidejob.js')
            expect(files[3]).to.equal('test/data/timings/second/3.js')
            expect(files[4]).to.equal('test/data/timings/second/4.js')
        })

        it('should recursively search directories if path name and "**" given', function () {
            var files = loader.lookup('test/data/timings/**')

            expect(files).to.be.an('array')
            expect(files).to.have.lengthOf(5)

            expect(files[0]).to.equal('test/data/timings/first/1.js')
            expect(files[1]).to.equal('test/data/timings/first/2.js')
            expect(files[2]).to.equal('test/data/timings/first/3/sidejob.js')
            expect(files[3]).to.equal('test/data/timings/second/3.js')
            expect(files[4]).to.equal('test/data/timings/second/4.js')
        })

        it('should not recursively search directories if "*" given after path', function () {
            var files = loader.lookup('test/data/timings/first/*')

            expect(files).to.be.an('array')
            expect(files).to.have.lengthOf(2)

            expect(files[0]).to.equal('test/data/timings/first/1.js')
            expect(files[1]).to.equal('test/data/timings/first/2.js')
        })
    })
})
