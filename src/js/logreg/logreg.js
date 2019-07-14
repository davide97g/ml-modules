const LinearRegression = function(config) {
  config = config || {};

  if (!config.iterations) {
    config.iterations = 1000;
  }
  if (!config.alpha) {
    config.alpha = 0.001;
  }
  if (!config.lambda) {
    config.lambda = 0.0;
  }
  if (!config.trace) {
    config.trace = false;
  }

  this.iterations = config.iterations;
  this.alpha = config.alpha;
  this.lambda = config.lambda;
  this.trace = config.trace;
};

LinearRegression.prototype.fit = function(data) {
  let N = data.length,
    X = [],
    Y = [];
  this.dim = data[0].length;

  for (let i = 0; i < N; ++i) {
    let row = data[i];
    let x_i = [];
    let y_i = row[row.length - 1];
    x_i.push(1.0);
    for (let j = 0; j < row.length - 1; ++j) {
      x_i.push(row[j]);
    }
    Y.push(y_i);
    X.push(x_i);
  }

  this.theta = [];

  for (let d = 0; d < this.dim; ++d) {
    this.theta.push(0.0);
  }

  for (let k = 0; k < this.iterations; ++k) {
    let Vx = this.grad(X, Y, this.theta);

    for (let d = 0; d < this.dim; ++d) {
      this.theta[d] = this.theta[d] - this.alpha * Vx[d];
    }

    if (this.trace) {
      console.log(
        "cost at iteration " + k + ": " + this.cost(X, Y, this.theta)
      );
    }
  }

  return {
    theta: this.theta,
    dim: this.dim,
    cost: this.cost(X, Y, this.theta),
    config: {
      alpha: this.alpha,
      lambda: this.lambda,
      iterations: this.iterations
    }
  };
};

LinearRegression.prototype.grad = function(X, Y, theta) {
  let N = X.length;

  let Vtheta = [];

  for (let d = 0; d < this.dim; ++d) {
    let g = 0;
    for (let i = 0; i < N; ++i) {
      let x_i = X[i];
      let y_i = Y[i];

      let predicted = this.h(x_i, theta);

      g += (predicted - y_i) * x_i[d];
    }

    g = (g + this.lambda * theta[d]) / N;

    Vtheta.push(g);
  }

  return Vtheta;
};

LinearRegression.prototype.h = function(x_i, theta) {
  let predicted = 0.0;
  for (let d = 0; d < this.dim; ++d) {
    predicted += x_i[d] * theta[d];
  }
  return predicted;
};

LinearRegression.prototype.cost = function(X, Y, theta) {
  let N = X.length;
  let cost = 0;
  for (let i = 0; i < N; ++i) {
    let x_i = X[i];
    let predicted = this.h(x_i, theta);
    cost += (predicted - Y[i]) * (predicted - Y[i]);
  }

  for (let d = 0; d < this.dim; ++d) {
    cost += this.lambda * theta[d] * theta[d];
  }

  return cost / (2.0 * N);
};

LinearRegression.prototype.transform = function(x) {
  if (x[0].length) {
    // x is a matrix
    let predicted_array = [];
    for (let i = 0; i < x.length; ++i) {
      let predicted = this.transform(x[i]);
      predicted_array.push(predicted);
    }
    return predicted_array;
  }

  // x is a row vector
  let x_i = [];
  x_i.push(1.0);
  for (let j = 0; j < x.length; ++j) {
    x_i.push(x[j]);
  }
  return this.h(x_i, this.theta);
};

//_________________Logistic Regression__________________

const LogisticRegression = function() {};

LogisticRegression.prototype.getOptions = function() {
  let options = {
    group: "logistic regression",
    alpha: {
      id: "alpha",
      type: "range",
      min: 0,
      max: 0.01,
      step: 0.001,
      value: this.alpha
    },
    iteration: {
      id: "iterations",
      type: "range",
      min: 10,
      max: 1000,
      step: 10,
      value: this.iterations
    },
    lamda: {
      id: "lamda",
      type: "range",
      min: 0,
      max: 1,
      step: 0.1,
      value: this.lambda
    }
  };
  return options;
};

LogisticRegression.prototype.setOptions = function(options) {
  this.options = options;
};

LogisticRegression.prototype.train = function(data, labels) {
  let config = this.options || {};
  if (!config.alpha) {
    config.alpha = 0.001;
  }
  if (!config.iterations) {
    config.iterations = 100;
  }
  if (!config.lambda) {
    config.lambda = 0;
  }
  this.alpha = config.alpha;
  this.lambda = config.lambda;
  this.iterations = config.iterations;

  let data_labels = [];
  for (let i = 0; i < data.length; i++) {
    data_labels.push(data[i].concat(labels[i]));
  }
  this.fit(data_labels);
};

LogisticRegression.prototype.fit = function(data) {
  this.dim = data[0].length;
  let N = data.length;

  let X = [];
  let Y = [];
  for (let i = 0; i < N; ++i) {
    let row = data[i];
    let x_i = [];
    let y_i = row[row.length - 1];
    x_i.push(1.0);
    for (let j = 0; j < row.length - 1; ++j) {
      x_i.push(row[j]);
    }
    X.push(x_i);
    Y.push(y_i);
  }

  this.theta = [];
  for (let d = 0; d < this.dim; ++d) {
    this.theta.push(0.0);
  }

  for (let iter = 0; iter < this.iterations; ++iter) {
    let theta_delta = this.grad(X, Y, this.theta);
    for (let d = 0; d < this.dim; ++d) {
      this.theta[d] = this.theta[d] - this.alpha * theta_delta[d];
    }
  }

  this.threshold = this.computeThreshold(X, Y);

  return {
    theta: this.theta,
    threshold: this.threshold,
    cost: this.cost(X, Y, this.theta),
    config: {
      alpha: this.alpha,
      lambda: this.lambda,
      iterations: this.iterations
    }
  };
};

LogisticRegression.prototype.computeThreshold = function(X, Y) {
  let threshold = 1.0,
    N = X.length;

  for (let i = 0; i < N; ++i) {
    let prob = this.transform(X[i]);
    if (Y[i] === 1 && threshold > prob) {
      threshold = prob;
    }
  }

  return threshold;
};

LogisticRegression.prototype.grad = function(X, Y, theta) {
  let N = X.length;
  let Vx = [];
  for (let d = 0; d < this.dim; ++d) {
    let sum = 0.0;
    for (let i = 0; i < N; ++i) {
      let x_i = X[i];
      let predicted = this.h(x_i, theta);
      sum += ((predicted - Y[i]) * x_i[d] + this.lambda * theta[d]) / N;
    }
    Vx.push(sum);
  }

  return Vx;
};

LogisticRegression.prototype.h = function(x_i, theta) {
  let gx = 0.0;
  for (let d = 0; d < this.dim; ++d) {
    gx += theta[d] * x_i[d];
  }
  return 1.0 / (1.0 + Math.exp(-gx));
};

LogisticRegression.prototype.transform = function(x) {
  if (x[0].length) {
    // x is a matrix
    let predicted_array = [];
    for (let i = 0; i < x.length; ++i) {
      let predicted = this.transform(x[i]);
      predicted_array.push(predicted);
    }
    return predicted_array;
  }

  let x_i = [];
  x_i.push(1.0);
  for (let j = 0; j < x.length; ++j) {
    x_i.push(x[j]);
  }
  return this.h(x_i, this.theta);
};

LogisticRegression.prototype.predict = function(x) {
  let gx = this.theta[0];
  for (let d = 0; d < x.length; ++d) {
    gx += this.theta[d + 1] * x[d];
  }
  return 1 / (1.0 + Math.exp(-gx));
};

LogisticRegression.prototype.predictClass = function(x) {
  return this.predict(x) > 0.5 ? 1 : -1;
};

// LogisticRegression.prototype.setOptions = function(configurations) {
//   let config_update = configurations || {};
//   if (!config_update.alpha) {
//     config_update.alpha = 0.001;
//   }
//   if (!config_update.iterations) {
//     config_update.iterations = 100;
//   }
//   if (!config_update.lambda) {
//     config_update.lambda = 0;
//   }
//   this.alpha = config_update.alpha;
//   this.lambda = config_update.lambda;
//   this.iterations = config_update.iterations;
// };

LogisticRegression.prototype.cost = function(X, Y, theta) {
  let N = X.length;
  let sum = 0;
  for (let i = 0; i < N; ++i) {
    let y_i = Y[i];
    let x_i = X[i];
    sum +=
      -(
        y_i * Math.log(this.h(x_i, theta)) +
        (1 - y_i) * Math.log(1 - this.h(x_i, theta))
      ) / N;
  }

  for (let d = 0; d < this.dim; ++d) {
    sum += (this.lambda * theta[d] * theta[d]) / (2.0 * N);
  }
  return sum;
};

//_______________MultiClassLogistic______________-

const MultiClassLogistic = function(import_config) {
  let config = import_config || {};
  if (!config.alpha) {
    config.alpha = 0.001;
  }
  if (!config.iterations) {
    config.iterations = 100;
  }
  if (!config.lambda) {
    config.lambda = 0;
  }
  this.alpha = config.alpha;
  this.lambda = config.lambda;
  this.iterations = config.iterations;
};

MultiClassLogistic.prototype.fit = function(data, classes) {
  this.dim = data[0].length;
  let N = data.length;

  if (!classes) {
    classes = [];
    for (let i = 0; i < N; ++i) {
      let found = false;
      let label = data[i][this.dim - 1];
      for (let j = 0; j < classes.length; ++j) {
        if (label === classes[j]) {
          found = true;
          break;
        }
      }
      if (!found) {
        classes.push(label);
      }
    }
  }

  this.classes = classes;

  this.logistics = {};
  let result = {};
  for (let k = 0; k < this.classes.length; ++k) {
    let c = this.classes[k];
    this.logistics[c] = new jsr.LogisticRegression({
      alpha: this.alpha,
      lambda: this.lambda,
      iterations: this.iterations
    });
    let data_c = [];
    for (let i = 0; i < N; ++i) {
      let row = [];
      for (let j = 0; j < this.dim - 1; ++j) {
        row.push(data[i][j]);
      }
      row.push(data[i][this.dim - 1] === c ? 1 : 0);
      data_c.push(row);
    }
    result[c] = this.logistics[c].fit(data_c);
  }
  return result;
};

MultiClassLogistic.prototype.transform = function(x) {
  if (x[0].length) {
    // x is a matrix
    let predicted_array = [];
    for (let i = 0; i < x.length; ++i) {
      let predicted = this.transform(x[i]);
      predicted_array.push(predicted);
    }
    return predicted_array;
  }

  let max_prob = 0.0;
  let best_c = "";
  for (let k = 0; k < this.classes.length; ++k) {
    let c = this.classes[k];
    let prob_c = this.logistics[c].transform(x);
    if (max_prob < prob_c) {
      max_prob = prob_c;
      best_c = c;
    }
  }

  return best_c;
};

module.exports = {
  LinearRegression: LinearRegression,
  LogisticRegression: LogisticRegression
};
