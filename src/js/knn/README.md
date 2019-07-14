# KNN

Simple implementation of Nearest Neighbor algorithm for binary classification in javascript.

Choose between various distances types:

- minkowski
- chebyshev
- mahalanobis

## Usage

### Import

#### ES6 syntax

```javascript
import { KNN } from "./path/knn";
```

#### npm module

```javascript
const KNN = require("./path/knn");
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
  k: 3,
  distance: {
    minkowski: true
  }
};
```

### Initialize

```javascript
let knn = new KNN();
```

### Training

```javascript
knn.train(data, labels, options);
```

#### Prediction

```javascript
let point = [2, 4];
knn.predict(point); // 0 <= value <= 1
knn.predictClass(point); // value = 1 || value = -1
```

### Options

```javascript
options = {
  k: 3, // k >= 1
  distance: {
    // minkowski | chebyshev | mahalanobis
    minkowski: true
  },
  p: 2 // minkowski degree
};
```
