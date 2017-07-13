# microboot

[![Build Status](https://api.travis-ci.org/jpwilliams/microboot.svg)](https://travis-ci.org/jpwilliams/microboot) [![Coverage Status](https://coveralls.io/repos/github/jpwilliams/microboot/badge.svg?branch=master)](https://coveralls.io/github/jpwilliams/microboot?branch=master) [![Dependencies](https://david-dm.org/jpwilliams/microboot/status.svg)](https://david-dm.org/jpwilliams/microboot) [![npm version](https://badge.fury.io/js/microboot.svg)](https://www.npmjs.com/package/microboot)

Boot up your app in wee little modules with the help of [glob](https://github.com/isaacs/node-glob).

``` js
const system = await microboot([
  'boot/databases',
  'boot/logging',
  'api/**',
  'listeners'
])

console.log('Service booted!')
```

## Contents

* [Introduction](#introduction)
* [How it works](#how-it-works)
* [Examples](#examples)
* [API reference](#api-reference)
* [Debugging](#debugging)

## Introduction

_microboot_ is a small helper designed to facilitate booting up complex applications that we all have. Database connections need to be made, logging services initialised and it all ends up happening nastily at the top of the file.

Using _microboot_ helps you organise your start-up by initialising your app step-by-step, reading file structures to grab everything you need.

## Uses

I use this tool for booting APIs and microservices within our architecture. _microboot_ lends itself really well to this as each endpoint can be instantiated in a single, isolated file and the only configuration needed to hook these together is _microboot_.

``` js
// index.js
require('microboot')('endpoints')
```

``` js
// connections/api.js
const express = require('express')
const api = express()
api.listen(3000)
module.exports = api
```

``` js
// endpoints/get/list.js
const api = require('../../connections/api')

module.exports = () => {
  api.get('/list', handler)
}

function handler (req, res) => {...}
```

In that example:

* `index.js` (our entry point) triggers _microboot_ to grab everything in the `endpoints` folder
* `endpoints/get/list.js` is found and `require`d
* `connections/api.js` is `require`d which set ups a single Express API
* `endpoints/get/list.js` adds a GET endpoint
* :tada:

**While this is a very simple example and it could arguably be clearer having everything in a single file, the key here is _extensibility_. Having each endpoint separated into an individual file means adding or removing endpoints is as simple as adding or removing a file. No extra work needed.**

## How it works

In your main file, use _microboot_ as it's used above, specifying a single path or multiple paths of files you want to run in the order you want them to run in. Each element in the given array is a different "stage" and files within each are sorted alphabetically to run. Here's our example:

``` js
var microboot = require('microboot')

microboot([
  'boot/databases',
  'utils/logging.js',
  'lib/endpoints/**'
]).then((arg) => {
  console.log('Boot complete!')
}).catch((err) => {
  console.error('Something went wrong:', err)
  process.exit(1)
})
```

In the files you choose to run, ensure they export a function that will be triggered when _microboot_ iterates through.

You can optionally map two parameters: one that's passed through all functions, allowing you to build the object as it goes through and system and the `done` argument which makes the step asynchronous.

You can also return a promise to make your step asynchronous. Here are some examples:

``` js
// boot/databases/mongodb.js
// an asynchronous stage
module.exports = function mongodb (arg, done) {
  connectToMongoDb(function (connection) {
    arg.mongo = connection

    return done()
  })
}
```

``` js
// lib/endpoints/post/login.js
// a synchronous stage
module.exports = function post_login (arg) {
  arg.api.newAppEndpoint('post', '/login')
}
```

``` js
// lib/endpoints/goDb/setup.js
// a promise stage, assuming goDb.setup() returns a promise
module.exports = () => {
  return goDb.setup()
}
```

You're set! _microboot_ will now first run all JS files found in the `boot/databases` folder (recursively) including our `mongodb.js`, then specifically `utils/logging.js`, then all JS files found in the `lib/endpoints` folder (recursively) including our `login.js`.

If you want to know more about the syntax used for specifying recursiveness and the like, take a look at [glob](https://github.com/isaacs/node-glob); it's what's behind _microboot_'s loader, [_microloader_](https://github.com/jpwilliams/microloader).

## Failing to initialise

If something screws up, you _should_ want to stop your app starting. If that's the case, you can throw an error during a step to stop things in their tracks.

For a _synchronous_ step, just go ahead and throw:

``` js
module.exports = function my_broken_api () {
  throw new Error('Oh no! It\'s all gone wrong!')
}
```

For a _callback_ step, return your error as the first argument of the callback:

``` js
module.exports = function my_broken_api (arg, done) {
  startUpApi(function (err) {
    if (err) {
      return done(err)
    }

    return done()
  })
}
```

For a _promise_ step, either reject your promise or throw if you're running an _async_ function:

``` js
module.exports = () => {
  return new Promise((resolve, reject) => {
    reject(new Error('Oh no!'))
  })
}

// or

module.exports = async () => {
  throw new Error('Oh no!')
}
```

## Examples

Yay examples! These all assume the following directory tree, the root representing your project's current working directory.

```
.
├── bin
│   └── example
├── boot
│   ├── 01_logging
│   │   ├── bunyan.js
│   │   └── postal.js
│   ├── 02_amqp.js
│   └── 03_database.js
├── index.js
├── lib
│   ├── types
│   │   ├── adding.js
│   │   ├── dividing.js
│   │   ├── multiplying.js
│   │   └── subtracting.js
│   └── utils
│       ├── 404.png
│       ├── deleteFile.js
│       ├── doNothing.js
│       ├── getFile.js
│       └── hugFile.js
├── package.json
└── test
    └── test.js

7 directories, 17 files
```

### Running everything in `boot`
> Runs in order: `bunyan.js`, `postal.js`, `amqp.js`, `database.js`

``` js
microboot('boot')
```

### Running everything in `boot`, then all `utils`
> Runs in order: `bunyan.js`, `postal.js`, `amqp.js`, `database.js`, `deleteFile.js`, `doNothing.js`, `getFile.js`, `hugFile.js`

``` js
microboot(['boot', 'lib/utils'])
```

### Running `01_logging` after `02_amqp.js` and `03_database.js`
> Runs in order: `02_amqp.js`, `03_database.js`, `bunyan.js`, `postal.js`

``` js
microboot(['boot/*', 'boot/logging'])
```

## API reference

#### microboot(stages, [arg], [callback])

* **Arguments**
  * `stages` - A single file path or array of file paths (from the [CWD](https://en.wikipedia.org/wiki/Current_working_directory)) from which to load _Microboot_'s list of functions to run.
  * `arg` - _Optional, defaults to `undefined`_ A single argument that is passed through every function run, allowing you to mutate it to build up the service as it boots. If `arg` is a function and no `callback` has been provided, `arg` will instead be used as the callback.
  * `callback(arg)` - _Optional_ The function to run once all stages have been successfully run. Is passed the final, mutated `arg`.

* **Returns**
  * If `callback` defined, `undefined`.
  * If `callback` not defined, returns a `Promise` resolving with `arg` or rejecting with an `Error`.

#### stage([arg], [callback])

* `arg` - _Optional_ The arg that's being passed through each stage run. Can be specified in the `microboot` call or defaults to `undefined`.
* `callback(err)` - _Optional_ If this is mapped to your stage function the stage will be treated as asynchronous and will require that this callback is run before moving to the next one. If there's an error, pass it back as the first parameter. If you wish to return a `Promise`, return one and do not specify the `callback`.

## Debugging

If _microboot_ doesn't seem to be behaving properly, set the `DEBUG=microboot*` environment variable, run your app and [create a new issue with those logs](https://github.com/jpwilliams/microboot/issues/new).
