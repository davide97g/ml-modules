[![Build Status](https://travis-ci.com/davide97g/ml-modules.svg?branch=master)](https://travis-ci.com/davide97g/ml-modules)
![GitHub](https://img.shields.io/github/license/davide97g/ml-modules.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/davide97g/ml-modules.svg)
![GitHub package.json version](https://img.shields.io/github/package-json/v/davide97g/ml-modules.svg)

# ml-modules

## Machine learning as modules

Browser-ready machine learning algorithms as modules.

## Demo

A live demo is available [here](https://davide97g.github.io/ml-modules/).

# Documentation

Documentation can be found [here](https://davide97g.github.io/ml-modules/docs/index.html).

## Algorithms

- Support Vector Machine with different kernels:
  - linear
  - polynomial
  - radial-basis-function (gaussian)
- KNN
- Radial-basis function
- Random Forests
- Logistic Regression
- Neural Net
  - multiple layers with costum definition

All algorithms are es6 module. The files needed for the algorithm to work are located in his directory, except for the utility functions.

All algorithms share the basic structure.

Example

```javascript
const algorithm = function() {}; // expose this function
algorithm.prototype = {
  // define the function
  train: function(data, labels) {
    //set up the environment
    //train
    //stored results
  },
  predict: function(point) {
    //returns the value predicted
  },
  predictClass: function(point) {
    //returns the class predicted
  },
  getOptions: function() {
    //returns an object to be used by the "ui" class
  },
  setOptions: function(options) {
    //set the options
  }
};
// helper functions if needed
module.exports = algorithm;
```

# Webpack

A bundler for javascript code: you can use nodejs modules in the brower. All js files will be merged and transpiled into one bundle (index.bundle.js), generated into the `./dist` folder.

To build the source code run in the command line, inside the `package.json` directory:

```
npm install
```

Now you have installed webpack and the project dependecies. Now you can build with:

```
npm run build
```

To be able to watch the files and automatically build on changes, just run the command:

```
npm run watch
```

## Support on Beerpay

Hey dude! Help me out for a couple of :beers:!

[![Beerpay](https://beerpay.io/davide97g/ml-es6-modules/badge.svg?style=beer-square)](https://beerpay.io/davide97g/ml-modules) [![Beerpay](https://beerpay.io/davide97g/ml-es6-modules/make-wish.svg?style=flat-square)](https://beerpay.io/davide97g/ml-modules?focus=wish)
