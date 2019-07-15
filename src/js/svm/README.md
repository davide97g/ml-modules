# SVM

Simple implementation of Support Vector Machine algorithm for binary classification in javascript.

The core of the algorithm was made by Andrej Karpathy, you can find his code on [his github repository](https://github.com/karpathy/svmjs).

I added something more to his work like polynomial kernel and the full SMO algorithm (J. Platt).

## Usage

### Import

```javascript
const modules = require("ml-modules");
const SVM = modules.SVM;
```

### Import single module

```javascript
const SVM = require("./path/to/svm.js");
```

### Variables

```javascript
let data = [
  [1, 0],
  [2, 3],
  [5, 4],
  [2, 7],
  [0, 3],
  [-1, 0],
  [-3, -4],
  [-2, -2],
  [-1, -1],
  [-5, -2]
];

let labels = [1, 1, 1, 1, 1, -1, -1, -1, -1, -1];

let options = {
  kernel: "linear"
};
```

### Initialize

```javascript
let svm = new SVM();
```

### Training

```javascript
svm.train(data, labels, options);
```

#### Prediction

```javascript
let point = [2, 4];
svm.predict(point); // 0 <= value <= 1
svm.predictClass(point); // value = 1 || value = -1
```

### Options

```javascript
options = {
  kernel:{ // you just need to specify the one you want. The last kernel set to true will be used
    linear: true|false,
    poly: true|false,
    rbf: true|false,
    sigm: true|false
  },
  karpathy: true|false, // karpathy partial SMO | Full SMO (J.Platt)
  C: 1, // number > 0
  tol: 1e-4, // numerical tolerance
  alphatol: 0, // non-support vector tolerance
  maxiter: 10000, // max # of iterations in partial SMO
  numpasses: 10, // # of passes over data with no change
  SSCA: false, // smoothed separable case approximation algorithm
  .
  .
  .
};
```
