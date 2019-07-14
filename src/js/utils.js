/**
 * YOU NEED THIS FILE TO USE THE MACHINE LEARNING MODULES
 * @name utils.js
 * @description
 * a list of utility functions shared between modules.
 * @copyright Davide Ghiotto
 */
function randf(a, b) {
  return Math.random() * (b - a) + a;
}

// generate random integer between a and b (b excluded)
function randi(a, b) {
  return Math.floor(Math.random() * (b - a) + a);
}

// create vector of zeros of length n
function zeros(n) {
  let arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = 0;
  }
  return arr;
}

//create a copy of the original array
function copyArray(v) {
  let array = new Array(v.length);
  for (let i = 0; i < v.length; i++) {
    array[i] = v[i];
  }
  return array;
}

//create an array based on copy of the value passed from input
function arrayWith(value, N) {
  let array = new Array(N);
  for (let i = 0; i < N; i++) {
    array[i] = value;
  }
  return array;
}

function objectToArray(array) {
  let result = [];
  array.forEach(data => result.push([data.x, data.y]));
  return result;
}

function arrayToObject(array) {
  let result = [];
  array.forEach(data => result.push({ x: data[0], y: data[1] }));
  return result;
}

module.exports = {
  arrayToObject: arrayToObject,
  objectToArray: objectToArray,
  arrayWith: arrayWith,
  copyArray: copyArray,
  zeros: zeros,
  randf: randf,
  randi: randi
};
