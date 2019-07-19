/**
 *
 * @description
 * Class used to handle distances functions
 * @example
 * //new instance
 * let distances = new Distances();
 * //define two points
 * let point1 = [1,3];
 * let point2 = [4,-2];
 * //minkowski distance from two points
 * let minkowski_distance = distances.minkowski(point1,point2);
 * //chebyshev distance from two points
 * let chebyshev_distance = distances.chebyshev(point1,point2);
 * //mahalanobis distance from two points
 * let mahalanobis_distance = distances.mahalanobis(point1,point2);
 * //setting the grade for minkowski
 * distances.setMinkowskiDegree(2);
 */

const utils = require("could-be-utils");

const Distances = function() {
  this.p = 1;
  this.data = [];
  this.variance = 0;
  this.default = function() {};
};

Distances.prototype = {
  /**
   * Sets the dataset and calculate the variance
   * @param data {data} dataset to be used for the distances calculations
   */
  setDataSet: function(data) {
    this.data = data;
    this.variance = utils.statistics.variance(data);
  },

  /**
   * Set the default function for the distance calculation
   * @param {String} algorithm
   */
  setDefault: function(algorithm) {
    if (algorithm === "minkowski") this.default = this.minkowski;
    else if (algorithm === "chebyshev") this.default = this.chebyshev;
    else if (algorithm === "mahalanobis") this.default = this.mahalanobis;
    else this.default = this.minkowski;
  },

  /**
   * Returns the distance between two points using the default algorithm
   * @param point1 {point} first point
   * @param point2 {point} second point
   * @returns {number} distance
   */
  of: function(point1, point2) {
    try {
      return this.default(point1, point2);
    } catch (e) {
      console.warn(e);
    }
  },

  /**
   * Sets the degree of the minkowski distance
   * @param p {Number} the degree for minkowski distance
   */
  setMinkowskiDegree: function(p) {
    this.p = p || this.p;
    if (this.p < 1) this.p = 1;
  },

  /**
   * Returns the minkowski distance between two points
   * @param point1 {point} first point
   * @param point2 {point} second point
   * @returns {number} minkowski distance
   */
  minkowski: function(point1, point2) {
    if (point1.length !== point2.length) {
      console.warn("point of different lengths");
      return;
    }
    let sum = 0;
    for (let i = 0; i < point1.length; i++)
      sum += Math.pow(Math.abs(point1[i] - point2[i]), this.p);
    return Math.pow(sum, 1 / this.p);
  },

  /**
   * Returns the chebyshev distance between two points
   * @param point1 {point} first point
   * @param point2 {point} second point
   * @returns {number} chebyshev distance between the two points
   */
  chebyshev: function(point1, point2) {
    let value;
    let max = 0;
    for (let i = 0; i < point1.length; i++) {
      value = Math.abs(point2[i] - point1[i]);
      if (value > max) max = value;
    }
    return max;
  },

  /**
   * Returns the mahalanobis distance between two points
   * @param point1 {point} first point
   * @param point2 {point} second point
   * @returns {number} mahalanobis distance between the two points
   */
  mahalanobis: function(point1, point2) {
    if (this.data.length === 0) throw "no data";
    let sum = 0;
    for (let i = 0; i < point1.length; i++)
      sum += Math.pow(point1[i] - point2[i], 2) / Math.pow(this.variance[i], 2);
    return Math.sqrt(sum);
  }
};

module.exports = Distances;
