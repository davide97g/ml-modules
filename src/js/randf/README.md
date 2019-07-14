# Random Forests

Simple implementation of Random Forests for binary classification in javascript.

## Usage

### Import

```javascript
const RandomForest = require("./path/randf").RandomForest;
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
let options = {};
```

### Initialize

```javascript
let randf = new RandomForest();
```

### Training

```javascript
randf.train(data, labels, options);
```

#### Prediction

```javascript
let point = [2, 4];
randf.predict(point); // 0 <= value <= 1
randf.predictClass(point); // value = 1 || value = -1
```

### Options

```javascript
options = {
  numTrees: 100, //can be used to customize number of trees to train
  maxDepth: 4, //is the maximum depth of each tree in the forest
  numTries: 10, //is the number of random hypotheses generated at each node during training
  type: 0, //weak type parameter
  trainFun: f(x), // is a function with signature "function myWeakTrain(data, labels, ix, options)". Here, ix is a list of indeces into data of the instances that should be payed attention to. Everything not in the list should be ignored. This is done for efficiency. The function should return a model where you store variables. (i.e. model = {}; model.myvar = 5;) This will be passed to testFun.
  testFun: f(x) // is a function with signature "funtion myWeakTest(inst, model)" where inst is 1D array specifying an example, and model will be the same model that you return in options.trainFun.
};
```
