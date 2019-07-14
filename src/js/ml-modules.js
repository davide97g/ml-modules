const LogisticRegression = require("./logreg/logreg.js").LogisticRegression;
const SVM = require("./svm/svm.js");
const KNN = require("./knn/knn.js");
const RBF = require("./rbf/rbf.js");
const RandomForest = require("./randf/randf.js");
const Drawer = require("./drawer.js");
const NeuralNet = require("./nn/nn.js");
const Manager = require("./manager.js");
const UI = require("./ui.js");
const dataset_generator = require("./dataset.js");

module.exports = {
  LogisticRegression: LogisticRegression,
  SVM: SVM,
  KNN: KNN,
  RBF: RBF,
  RandomForest: RandomForest,
  Drawer: Drawer,
  NeuralNet: NeuralNet,
  Manager: Manager,
  UI: UI,
  dataset_generator: dataset_generator
};
