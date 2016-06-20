# microboot

[![Build Status](https://api.travis-ci.org/jpwilliams/microboot.svg)](https://travis-ci.org/jpwilliams/microboot) [![Coverage Status](https://coveralls.io/repos/github/jpwilliams/microboot/badge.svg?branch=master)](https://coveralls.io/github/jpwilliams/microboot?branch=master) [![Dependencies](https://img.shields.io/david/jpwilliams/microboot.svg)]()

Boot up your app in wee little modules with the help of [glob](https://github.com/isaacs/node-glob).

``` js
microboot([
  'boot/databases',
  'boot/logging',
  'api/**',
  'listeners'
], function () {
  console.log('App booted!')
})
```

## Contents

* [Introduction](#introduction)
* [How it works](#how-it-works)
* [Examples](#examples)
* [Debugging](#debugging)

## Introduction

_microboot_ is a small helper designed to facilitate booting up complex applications that we all have. Database connections need to be made, logging services initialised and it all ends up happening nastily at the top of the file.

Using _microboot_ helps you organise your start-up by initialising your app step-by-step, reading file structures to grab everything you need.

## How it works

In your main file, use _microboot_ as it's used above, specifying the paths of files you want to run in the order you want them to run in. Each element in the given array is a different "phase" and files within each are sorted alphabetically to run. Here's our example:

``` js
var microboot = require('microboot')

microboot([
  'boot/databases',
  'utils/logging.js',
  'lib/endpoints/**'
], function () {
  console.log('Ready!')
})
```

In the files you choose to run, ensure they export a function that will be triggered when _microboot_ iterates through. You can optionally map the `done` argument make the step asynchronous. Here are two examples:

``` js
// boot/databases/mongodb.js
module.exports = function mongodb (callback) {
  connectToMongoDb(function () {
    callback()
  })
}
```

``` js
// lib/endpoints/post/login.js
module.exports = function post_login () {
  newAppEndpoint('post', '/login')
}
```

You're set! _microboot_ will now first run all JS files found in the `boot/databases` folder (recursively) including our `mongodb.js`, then specifically `utils/logging.js`, then all JS files found in the `lib/endpoints` folder (recursively) including our `login.js`.

If you want to know more about the syntax used for specifying recursiveness and the like, take a look at [glob](https://github.com/isaacs/node-glob); it's what's behind _microboot_'s loader.

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
microboot(['boot'])
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

## Debugging

If _microboot_ doesn't seem to be behaving properly, set the `DEBUG=microboot*` environment variable, run your app and [create a new issue with those logs](https://github.com/jpwilliams/microboot/issues/new).
