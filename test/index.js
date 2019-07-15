/**
 * YOU DON'T NEED THIS FILE TO USE THE MACHINE LEARNING MODULES
 * @name index.js
 * @description
 * This file is just a presentation of the features inside this project.
 * You will find other components other than machine learning modules:
 * - UI : for the creation of the GUI options
 * - Manager: for the management of the data flow between algorithms
 * - Drawer: basically just controls the canvas and the graphic rappresentation of the algorithm results
 * @copyright Davide Ghiotto
 */
const modules = require("../src/js/index.js");
// machine learning modules
const SVM = modules.SVM;
const LOGREG = modules.LOGREG;
const KNN = modules.KNN;
const RBF = modules.RBF;
const RANDF = modules.RANDF;
const NeuralNet = modules.NN;
// ui modules
const Manager = modules.Manager;
const UI = modules.UI;
const Drawer = modules.Drawer;
const dataset_generator = modules.dataset_generator;

// controls the data between various algorithms
let manager = new Manager();
// generate datasets
let generator = new dataset_generator();

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

manager.setDataSet(data, labels);

let svm_linear = new SVM();
let svm_linear_options = {
  kernel: {
    linear: true
  },
  degree: 1,
  influence: 0,
  C: 1,
  SSCA: false,
  UB: 0.5,
  memoize: true,
  input_functions: {},
  karpathy: true,
  timer: null
};
svm_linear.setOptions(svm_linear_options);
svm_linear.train(data, labels);

let svm_poly = new SVM();
let svm_poly_options = {
  kernel: {
    poly: true
  },
  degree: 2,
  influence: 0,
  C: 1,
  SSCA: false,
  UB: 0.5,
  memoize: true,
  karpathy: true,
  timer: null
};
svm_poly.setOptions(svm_poly_options);
svm_poly.train(data, labels);

let svm_rbf = new SVM();
let svm_rbf_options = {
  kernel: {
    rbf: true
  },
  degree: 2,
  influence: 0,
  C: 1,
  SSCA: false,
  UB: 0.5,
  memoize: true,
  karpathy: true,
  timer: null
};
svm_rbf.setOptions(svm_rbf_options);
svm_rbf.train(data, labels);

let knn = new KNN();
let knn_options = {
  k: 3,
  distance: {
    minkowski: true
  },
  p: 1.5
};
knn.setOptions(knn_options);
knn.train(data, labels);

let rbf = new RBF();
let rbf_options = {
  epsilon: 0.1,
  rbfSigma: 0.5
};
rbf.setOptions(rbf_options);
rbf.train(data, labels);

let randf = new RANDF();
let randf_options = {
  numTrees: 100
};
randf.setOptions(randf_options);
randf.train(data, labels);

let logreg = new LOGREG();
let logreg_options = {};
logreg.setOptions(logreg_options);
logreg.train(data, labels);

let nn = new NeuralNet();
let nn_options = {};
nn.setOptions(nn_options);
nn.train(data, labels);

let drawers = [];
drawers.push(
  new Drawer(svm_linear, document.getElementById("svm-linear-canvas"), {
    margin: {
      soft: true
    },
    boosted: true
  })
);
drawers.push(
  new Drawer(svm_poly, document.getElementById("svm-poly-canvas"), {
    margin: {
      soft: true
    }
  })
);
drawers.push(
  new Drawer(svm_rbf, document.getElementById("svm-rbf-canvas"), {
    margin: {
      soft: true
    }
  })
);
drawers.push(
  new Drawer(knn, document.getElementById("knn-canvas"), {
    margin: {
      soft: true
    }
  })
);
drawers.push(
  new Drawer(rbf, document.getElementById("rbf-canvas"), {
    margin: {
      soft: true
    }
  })
);
drawers.push(
  new Drawer(randf, document.getElementById("randf-canvas"), {
    margin: {
      soft: true
    }
  })
);
drawers.push(
  new Drawer(logreg, document.getElementById("logreg-canvas"), {
    margin: {
      soft: true
    }
  })
);
drawers.push(
  new Drawer(nn, document.getElementById("nn-canvas"), {
    margin: {
      soft: true
    }
  })
);

document.getElementById("go").addEventListener("click", () => {
  ui.setAllOptions();
  manager.notifyAll();
});

let btns_exe = document.getElementsByClassName("execute");
for (let i = 0; i < btns_exe.length; i++) {
  btns_exe[i].addEventListener("click", () => {
    ui.setOptionsOfSet(drawers[i]);
    manager.notify(drawers[i]);
  });
}

let N = 50;
let label_slider = document.createElement("label");
label_slider.innerHTML = "N:" + N;
label_slider.for = "N";
let slider = document.createElement("input");
slider.id = "N";
slider.type = "range";
slider.value = 50;
slider.min = 10;
slider.max = 300;
slider.step = 10;
slider.addEventListener("change", () => {
  N = slider.value;
  label_slider.innerHTML = "N:" + N;
});
document.getElementById("datasets").appendChild(label_slider);
document.getElementById("datasets").appendChild(slider);
let ui = new UI(document, generator);

let dataset_btns = document.getElementsByClassName("datasets");
for (let i = 0; i < dataset_btns.length; i++) {
  dataset_btns[i].addEventListener("click", () => {
    let res = ui.generateDataSet(dataset_btns[i].id, N);
    manager.setDataSet(res.data, res.labels);
    manager.notifyAll();
  });
}

ui.createOptionsFrom(
  svm_linear,
  document.getElementById("svm-linear-options-algorithm")
);
ui.createOptionsFrom(
  drawers[0],
  document.getElementById("svm-linear-options-draw")
);
ui.createOptionsFrom(
  svm_poly,
  document.getElementById("svm-poly-options-algorithm")
);
ui.createOptionsFrom(
  drawers[1],
  document.getElementById("svm-poly-options-draw")
);
ui.createOptionsFrom(
  svm_rbf,
  document.getElementById("svm-rbf-options-algorithm")
);
ui.createOptionsFrom(
  drawers[2],
  document.getElementById("svm-rbf-options-draw")
);
ui.createOptionsFrom(knn, document.getElementById("knn-options-algorithm"));
ui.createOptionsFrom(drawers[3], document.getElementById("knn-options-draw"));
ui.createOptionsFrom(rbf, document.getElementById("rbf-options-algorithm"));
ui.createOptionsFrom(drawers[4], document.getElementById("rbf-options-draw"));
ui.createOptionsFrom(randf, document.getElementById("randf-options-algorithm"));
ui.createOptionsFrom(drawers[5], document.getElementById("randf-options-draw"));
ui.createOptionsFrom(
  logreg,
  document.getElementById("logreg-options-algorithm")
);
ui.createOptionsFrom(
  drawers[6],
  document.getElementById("logreg-options-draw")
);
ui.createOptionsFrom(nn, document.getElementById("nn-options-algorithm"));
ui.createOptionsFrom(drawers[7], document.getElementById("nn-options-draw"));

drawers.forEach(drawer => manager.subscribe(drawer));
manager.notifyAll();
