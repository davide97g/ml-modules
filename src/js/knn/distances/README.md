# distances

Function to calculate distances from two vectors with n features.

## types of distances

- minkowski
- chebyshev
- mahalanobis

## Usage

### Import

#### ES6 syntax

```javascript
import { Distances } from "./path/distances";
```

#### npm module

```javascript
const Distances = require("./path/distances");
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
```

### Initialize

```javascript
let distances = new Distances();
```

### Set up

```javascript
distances.setDataSet(data);
distances.setDefault("minkowski");
distances.setMinkowskiDegree(2);
```

### Calculate

```javascript
let point1 = [1, 2];
let point1 = [-3, 4];
distances.of(point1, point2);
```
