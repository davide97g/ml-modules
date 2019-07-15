# ml-modules

## Usage

```javascript
//import the modules
const modules = require("ml-modules");
//select the machine learning module you want, for example
const SVM = modules.SVM; // support vector machine
```

## modules

Can choose from these machine learning modules:

- SVM
- KNN
- RBF
- RANDF
- LOGREG
- NN
---
---
## Drawer

Draws the results of machine learning predictions to 2d canvas.

### Usage

#### Import

```javascript
const Drawer = modules.Drawer;
```

#### Variables

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
let algorithm = new Algorithm(); //SVM || NN || RANDF || LOGREG || KNN || RBF
let canvas = document.getElementById("myCanvas");
let options = {
  ss: 20,
  density: 3,
  margin: {
    soft: true
  }
};
```

#### Initialize

```javascript
let drawer = new Drawer(algorithm, canvas, options);
```

#### Draw

```javascript
drawer.draw(data, labels);
```

#### Test

```javascript
let test = [[1, 2], [2, 4], [5, 2], [-1, -1], [-4, 2], [0, -2]];
let test_labels = [1, 1, 1, -1, -1, -1];
drawer.drawTestPoints(test, test_labels);
```

#### Options

```javascript
options = {
  ss: 20, //scale factor
  density: 3, //grid drawing density
  margin: {
    soft: true // true|false Smooth or hard margin on drawing the colors
  }
};
```
