/** YOU DON'T NEED THIS FILE TO USE THE MACHINE LEARNING MODULES
 * @name dataset.js
 * @description
 * function that generates new datasets that shared a common structure based on the function they use.
 * @copyright Davide Ghiotto
 */
const utils = require("./utils.js");
const dataset_generator = function() {};
dataset_generator.prototype = {
  randomData: function(N) {
    let data = new Array(N);
    let labels = new Array(N);
    for (let i = 0; i < N; i++) {
      data[i] = [utils.randf(-3, 3), utils.randf(-3, 3)];
      if (utils.randi(0, 2)) labels[i] = 1;
      else labels[i] = -1;
    }
    return { data: data, labels: labels };
  },
  circleMultipleData: function(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let radius;
    for (let i = 0; i < N; i++) {
      if (i < N / 3) {
        radius = utils.randf(0.1, 2.5);
        let angle = Math.random() * Math.PI * 2;
        let x = Math.cos(angle) * radius;
        let y = Math.sin(angle) * radius;
        data[i] = [x, y];
        labels[i] = 1;
      } else if (i < (N * 2) / 3) {
        radius = utils.randf(2.5, 3);
        let angle = Math.random() * Math.PI * 2;
        let x = Math.cos(angle) * radius;
        let y = Math.sin(angle) * radius;
        data[i] = [x, y];
        labels[i] = -1;
      } else {
        radius = utils.randf(3, 4);
        let angle = Math.random() * Math.PI * 2;
        let x = Math.cos(angle) * radius;
        let y = Math.sin(angle) * radius;
        data[i] = [x, y];
        labels[i] = 1;
      }
    }
    return { data: data, labels: labels };
  },
  circleData: function(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let radius;
    let offsetX = 0;
    let offsetY = 0;
    for (let i = 0; i < N; i++) {
      if (i < N / 2) {
        radius = utils.randf(0.1, 2.5);
        let angle = Math.random() * Math.PI * 2;
        let x = Math.cos(angle) * radius + offsetX;
        let y = Math.sin(angle) * radius + offsetY;
        data[i] = [x, y];
        labels[i] = 1;
      } else {
        radius = utils.randf(2.25, 4);
        let angle = Math.random() * Math.PI * 2;
        let x = Math.cos(angle) * radius + offsetX;
        let y = Math.sin(angle) * radius + offsetY;
        data[i] = [x, y];
        labels[i] = -1;
      }
    }
    return { data: data, labels: labels };
  },
  exclusiveOrData: function(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let l = 3;
    let offsetX = 0;
    let offsetY = 0;
    for (let i = 0; i < N; i++) {
      if (i < N * 0.25) {
        data[i] = [utils.randf(0, l) + offsetX, utils.randf(0, l) + offsetY];
        labels[i] = 1;
      } else if (i < N * 0.5) {
        data[i] = [utils.randf(0, l) + offsetX, utils.randf(-l, 0) + offsetY];
        labels[i] = -1;
      } else if (i < N * 0.75) {
        data[i] = [utils.randf(-l, 0) + offsetX, utils.randf(-l, 0) + offsetY];
        labels[i] = 1;
      } else {
        data[i] = [utils.randf(-l, 0) + offsetX, utils.randf(0, l) + offsetY];
        labels[i] = -1;
      }
    }
    return { data: data, labels: labels };
  },
  gaussianData: function(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let radius;
    let l = 3;
    let offsetX = 0;
    let offsetY = 0;
    for (let i = 0; i < N; i++) {
      if (i < N * 0.5) {
        radius = utils.randf(0, l - 1);
        let angle = Math.random() * Math.PI * 2;
        let x = Math.cos(angle) * radius + offsetX;
        let y = Math.sin(angle) * radius + offsetY;
        data[i] = [x + l / 4, y + l / 4];
        labels[i] = 1;
      } else {
        radius = utils.randf(0, l - 1);
        let angle = Math.random() * Math.PI * 2;
        let x = Math.cos(angle) * radius + offsetX;
        let y = Math.sin(angle) * radius + offsetY;
        data[i] = [x - l / 4, y - l / 4];
        labels[i] = -1;
      }
    }
    return { data: data, labels: labels };
  },
  spiralData: function(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let a = 0.1;
    let b = 0.5;
    let theta;
    let perturbation = 0.2;
    for (let i = 0; i < N / 2; i++) {
      theta = Math.random() * Math.PI * 2;
      let x = (a + b * theta) * Math.cos(theta);
      x = x + utils.randf(-perturbation, perturbation);
      let y = (a + b * theta) * Math.sin(theta);
      y = y + utils.randf(-perturbation, perturbation);
      data[i] = [x, y];
      labels[i] = 1;
    }
    a = -a;
    b = -b;
    for (let i = N / 2; i < N; i++) {
      theta = Math.random() * Math.PI * 2;
      let x = (a + b * theta) * Math.cos(theta);
      x = x + utils.randf(-perturbation, perturbation);
      let y = (a + b * theta) * Math.sin(theta);
      y = y + utils.randf(-perturbation, perturbation);
      data[i] = [x, y];
      labels[i] = -1;
    }
    return { data: data, labels: labels };
  },
  stripesVData: function(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let x, y;
    for (let i = 0; i < N; i++) {
      y = utils.randf(-4, 4);
      /*
              if(i<N/6){
                  x=randf(-3,-2);
                  labels[i] = 1;
              }
              else if(i<N/3){
                  x=randf(-2,-1);
                  labels[i] = -1;
              }
              else if(i<N/2){
                  x=randf(-1,0);
                  labels[i] = 1;
              }
              else if(i<N*2/3){
                  x=randf(0,1);
                  labels[i] = -1;
              }
              else if(i<N*5/6){
                  x=randf(1,2);
                  labels[i] = 1;
              }
              else{
                  x = randf(2,3);
                  labels[i] = -1;
              }*/
      if (i < N / 4) {
        x = utils.randf(-3, -1.75);
        labels[i] = 1;
      } else if (i < N / 2) {
        x = utils.randf(-1.5, -0.25);
        labels[i] = -1;
      } else if (i < (N * 3) / 4) {
        x = utils.randf(0.25, 1.5);
        labels[i] = 1;
      } else {
        x = utils.randf(1.75, 3);
        labels[i] = -1;
      }
      data[i] = [x, y];
    }
    return { data: data, labels: labels };
  },
  stripesHData: function(N) {
    let data = new Array(N);
    let labels = new Array(N);
    let x, y;
    for (let i = 0; i < N; i++) {
      x = utils.randf(-4, 4);
      /*
              if(i<N/6){
                  x=randf(-3,-2);
                  labels[i] = 1;
              }
              else if(i<N/3){
                  x=randf(-2,-1);
                  labels[i] = -1;
              }
              else if(i<N/2){
                  x=randf(-1,0);
                  labels[i] = 1;
              }
              else if(i<N*2/3){
                  x=randf(0,1);
                  labels[i] = -1;
              }
              else if(i<N*5/6){
                  x=randf(1,2);
                  labels[i] = 1;
              }
              else{
                  x = randf(2,3);
                  labels[i] = -1;
              }*/
      if (i < N / 4) {
        y = utils.randf(-3, -1.75);
        labels[i] = 1;
      } else if (i < N / 2) {
        y = utils.randf(-1.5, -0.25);
        labels[i] = -1;
      } else if (i < (N * 3) / 4) {
        y = utils.randf(0.25, 1.5);
        labels[i] = 1;
      } else {
        y = utils.randf(1.75, 3);
        labels[i] = -1;
      }
      data[i] = [x, y];
    }
    return { data: data, labels: labels };
  }
};

module.exports = dataset_generator;
