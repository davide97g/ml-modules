/** YOU DON'T NEED THIS FILE TO USE THE MACHINE LEARNING MODULES
 * @name input.js
 * @description
 * A list of input transformation function, also called "boosting" functions.
 * They receive an array and then return a boosted version based on the function they use.
 * @copyright Davide Ghiotto
 */

const copyArray = require("./utils.js").copyArray;

function fx2(v) {
  let res = copyArray(v);
  res.push(Math.pow(v[0], 2));
  return res;
}
function fy2(v) {
  let res = copyArray(v);
  res.push(Math.pow(v[1], 2));
  return res;
}
function fx3(v) {
  let res = copyArray(v);
  res.push(Math.pow(v[0], 3));
  return res;
}
function fy3(v) {
  let res = copyArray(v);
  res.push(Math.pow(v[1], 3));
  return res;
}
function fx2y2(v) {
  let res = copyArray(v);
  res.push(Math.pow(v[0], 2) + Math.pow(v[1], 2));
  return res;
}
function fx2_y2(v) {
  let res = copyArray(v);
  res.push(Math.pow(v[0], 2) - Math.pow(v[1], 2));
  return res;
}
function fxy(v) {
  let res = copyArray(v);
  res.push(v[0] * v[1]);
  return res;
}
function fsinx(v) {
  let res = copyArray(v);
  res.push(Math.sin(v[0]));
  return res;
}
function fsiny(v) {
  let res = copyArray(v);
  res.push(Math.sin(v[1]));
  return res;
}
function fcosx(v) {
  let res = copyArray(v);
  res.push(Math.cos(v[0]));
  return res;
}
function fcosy(v) {
  let res = copyArray(v);
  res.push(Math.cos(v[1]));
  return res;
}
function fsinxcosy(v) {
  let res = copyArray(v);
  res.push(Math.sin(v[0]) + Math.cos(v[1]));
  return res;
}
function fsinycosx(v) {
  let res = copyArray(v);
  res.push(Math.sin(v[1]) + Math.cos(v[0]));
  return res;
}
function fsinxcosydot(v) {
  let res = copyArray(v);
  res.push(Math.sin(v[0]) * Math.cos(v[1]));
  return res;
}
function fsinycosxdot(v) {
  let res = copyArray(v);
  res.push(Math.sin(v[1]) * Math.cos(v[0]));
  return res;
}

function boost(input_boosting, point) {
  if (input_boosting.length > 0) {
    let boosted = copyArray(point);
    for (let i = 0; i < input_boosting.length; i++) {
      boosted = input_boosting[i](boosted);
    }
    return boosted;
  } else return point;
}

function getFunction(id) {
  if (id === "x2") return fx2;
  else if (id === "y2") return fy2;
  else if (id === "x3") return fx3;
  else if (id === "y3") return fy3;
  else if (id === "x2y2") return fx2y2;
  else if (id === "x2_y2") return fx2_y2;
  else if (id === "xy") return fxy;
  else if (id === "sinx") return fsinx;
  else if (id === "siny") return fsiny;
  else if (id === "cosx") return fcosx;
  else if (id === "cosy") return fcosy;
  else if (id === "sinxcosy") return fsinxcosy;
  else if (id === "sinycosx") return fsinycosx;
  else if (id === "sinxcosydot") return fsinxcosydot;
  else if (id === "sinycosxdot") return fsinycosxdot;
}

module.exports = {
  boost: boost,
  getFunction: getFunction
};
