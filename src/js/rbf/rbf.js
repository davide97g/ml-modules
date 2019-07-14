const RBF = function() {};
RBF.prototype = {
  train: function(data, labels) {
    this.data = data;
    this.labels = labels;
    this.options = this.options || {};
    this.epsilon = this.options.epsilon || 0.1;
    this.rbfSigma = this.options.rbfSigma || 0.5;
  },
  predict: function(point) {
    return (Math.tanh(this.rbf(point) / Math.pow(this.epsilon, 2)) + 1) / 2;
  },
  predictClass: function(point) {
    return this.rbf(point) > 0 ? 1 : -1;
  },
  rbf: function(point) {
    let value = 0;
    for (let i = 0; i < this.data.length; i++) {
      let s = 0;
      for (let j = 0; j < point.length; j++)
        s += Math.pow(point[j] - this.data[i][j], 2);
      value +=
        this.labels[i] * Math.exp(-s / (2.0 * Math.pow(this.rbfSigma, 2)));
    }
    return value;
  },
  getOptions: function() {
    let options = {
      group: "rbf",
      epsilon: {
        id: "epsilon",
        type: "range",
        min: 0,
        step: 0.1,
        max: 2,
        value: this.epsilon
      },
      rbfSigma: {
        id: "rbfSigma",
        type: "range",
        min: 0,
        step: 0.1,
        max: 1,
        value: this.rbfSigma
      }
    };
    return options;
  },
  setOptions: function(options) {
    this.options = options;
  }
};
module.exports = RBF;
