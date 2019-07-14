# Neural Networks

Simple implementation of Neural Networks for binary classification in javascript.
Each net can have multiple layers, with different activation function e neurons.

The core of the algorithm was made by Andrej Karpathy, you can find his code on [his github repository](https://github.com/karpathy/convnetjs).

My work was just to create an interface to the convnet library.

## Usage

### Import

```javascript
const NN = require("./path/nn");
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
  layer_defs: [
    { type: "input", out_sx: 1, out_sy: 1, out_depth: 2 },
    { type: "fc", num_neurons: 4, activation: "tanh" },
    { type: "fc", num_neurons: 6, activation: "relu" },
    { type: "softmax", num_classes: 2 }
  ],
  training: {
    iters: 1000
  }
};
```

### Initialize

```javascript
let nn = new NN();
```

### Training

```javascript
nn.train(data, labels, options);
```

#### Prediction

```javascript
let point = [2, 4];
nn.predict(point); // 0 <= value <= 1
nn.predictClass(point); // value = 1 || value = -1
```

### Options

```javascript
options = {
  layer_defs: [
    { type: "input", out_sx: 1, out_sy: 1, out_depth: 2 }, //input layer
    { type: "fc", num_neurons: 4, activation: "tanh" }, //hidden layer: type, neurons and activation function parameters. You can specify any number of these hidden layers
    { type: "softmax", num_classes: 2 } // output layer
  ],
  training: {
    learning_rate: 0.01,
    momentum: 0.1,
    batch_size: 10,
    l2_decay: 0.001,
    iters: 1000 //number of iterations for the training
  }
};
```
