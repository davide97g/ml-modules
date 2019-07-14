# Radial-Basis Function

Simple implementation of Radial-Basis Function evaluation for binary classification in javascript.

## Usage

### Import

```javascript
const RBF = require("./path/rbf");
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
  epsilon: 0.1,
  rbfSigma: 0.5
};
```

### Initialize

```javascript
let rbf = new RBF();
```

### Training

```javascript
rbf.train(data, labels, options);
```

#### Prediction

```javascript
let point = [2, 4];
rbf.predict(point); // 0 <= value <= 1
rbf.predictClass(point); // value = 1 || value = -1
```

### Options

```javascript
options = {
  epsilon: 0.1,
  rbfSigma: 0.5
};
```
