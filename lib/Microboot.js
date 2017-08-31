const debug = require('debug')
const debugLoad = debug('microboot:load')
const debugRun = debug('microboot:run')
const microloader = require('microloader')

class Microboot {
  constructor (stages, arg) {
    this.stages = Array.isArray(stages) ? stages : [stages]
    this.arg = arg
  }

  boot () {
    const fns = this.load(this.stages)

    return this.runPhases(fns, this.arg)
  }

  load (paths) {
    // filter paths so we filter out falsey strings
    paths = paths.filter(Boolean)

    return microloader(paths, {
      absolute: true
    }).reduce((fns, file) => {
      debugLoad(`- loading "${file}"...`)

      const ret = require(file)

      if (typeof ret !== 'function') {
        debugLoad(`- loaded "${ret}"`)

        return fns
      }

      debugLoad(`- loaded "${file}" and added ${ret.name ? ('"' + ret.name + '"') : ''} to list`)

      fns.push({
        func: ret,
        path: file
      })

      return fns
    }, [])
  }

  async runPhases (items, arg) {
    while (items.length) {
      const item = items.shift()
      await this.runPhase(item.func, item.path, arg)
    }

    debugRun('Boot completed')

    return arg
  }

  runPhase (fn, path, arg) {
    debugRun(`- running ${fn.name ? ('"' + fn.name + '" (') : ''}${path}${fn.name ? ')' : ''}`)

    const hasCallback = fn.length > 1

    return new Promise(async (resolve, reject) => {
      const callback = hasCallback ? (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      } : undefined

      try {
        await fn(arg, callback)
      } catch (e) {
        reject(e)
      }

      if (!hasCallback) {
        resolve()
      }
    })
  }
}

module.exports = Microboot
