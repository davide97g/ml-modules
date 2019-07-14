/** YOU DON'T NEED THIS FILE TO USE THE MACHINE LEARNING MODULES
 * @name manager.js
 * @description
 * Manager of the data flow between multiple algorithms.
 * This function was built with the "observer" pattern in mind:
 * all the drawers that subscribe to the manager receive themselves a manager instance.
 * Manager will notify all the subscribers (drawers) whenever a drawer call for an update.
 * @copyright Davide Ghiotto
 */
const copyArray = require("./utils.js").copyArray;
const boost = require("./input.js").boost;
const Manager = function() {
  this.data = [];
  this.labels = [];
  this.drawers = [];
};
Manager.prototype = {
  subscribe: function(drawer) {
    drawer.setManager(this);
    this.drawers.push(drawer);
  },
  notifyAll: function() {
    this.drawers.forEach(drawer => this.notify(drawer));
  },
  notify: function(drawer) {
    let input_boosting = drawer.getBoosting();
    if (input_boosting.length > 0) {
      let boosted = copyArray(this.data);
      for (let i = 0; i < boosted.length; i++)
        boosted[i] = boost(input_boosting, this.data[i]);
      drawer.getAlgorithm().train(boosted, this.labels);
      drawer.draw(boosted, this.labels);
    } else {
      drawer.getAlgorithm().train(this.data, this.labels);
      drawer.draw(this.data, this.labels);
    }
  },
  setDataSet: function(data, labels) {
    this.data = data;
    this.labels = labels;
  },
  addPoint: function(point, label) {
    this.data.push(point);
    this.labels.push(label);
  },
  removePoint: function(point) {
    let index = 0;
    let distanceFrom = ([x1, y1], [x2, y2]) =>
      Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    let min = distanceFrom(this.data[0], point);
    for (let i = 0; i < this.data.length; i++) {
      let d = distanceFrom(this.data[i], point);
      if (d < min) {
        min = d;
        index = i;
      }
    }
    this.data.splice(index, 1);
    this.labels.splice(index, 1);
  }
};

module.exports = Manager;
