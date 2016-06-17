var loader = require('../../lib/loader')

describe('microboot/lib/loader', function () {
    it('should expose the "load" function')
    it('should expose the "lookup" function')

    describe('-> load', function () {
        it('should throw if not given an array for "paths"')
        it('should order results by paths then callbacks')
        it('should throw if a found file does not export a function')
        it('should return an empty array if no paths are given')
        it('should return an array of callbacks if successful')
    })

    describe('-> lookup', function () {
        it('should find nothing if given a non-existent path')
        it('should find a single JS file if given an extensionless path')
        it('should throw if ...50?')
        it('should not return hidden files')
        it('should not return files that don\'t have the ".js" extension')
        it('should remove hidden files when searching an extensionless path')
        it('should remove non-.js files when searching an extensionless path')
        it('should return files ordered')
        it('should find a single JS file if given a specific file')
        it('should recursively search directories if no options are provided')
        it('should recursively search directories if "no_recursive" is set to false')
        it('should not recursively search directories if "no_recursive" is set to true')
        it('should not throw if permission is denied to a path')
        it('should not throw if permission is denied to a file within a path')
        it('should not return hidden files when searching within a path')
        it('should not return non-.js files when searching within a path')
        it('should return files ordered recursively')
    })
})