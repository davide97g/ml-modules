/**
 * YOU DON'T NEED THIS FILE TO USE THE MACHINE LEARNING MODULES
 * @name ui.js
 * @description
 * A User Interface function: automatically generates the GUI using the "getOptions" method of each algorithm
 * @param {document} document
 * @copyright Davide Ghiotto
 */
const UI = function(document, dataset_generator) {
  this.document = document;

  this.options_container = document.createElement("div");
  this.options_container.id = "options_container";
  this.options_container.classList.add("options_container");
  this.document.body.appendChild(this.options_container);

  this.configurations = {};
  this.sets = [];

  this.dataset_generator = dataset_generator;
};
UI.prototype = {
  /**
   * @returns returns the configurations
   */
  getAllConfigurations: function() {
    return this.configurations;
  },
  /**
   *
   * @param {*} set the algorithm or the drawer to where to get the options
   */
  getConfigFromSet: function(set) {
    let group = set.getOptions().group;
    return this.configurations[group][group];
  },
  setOptionsOfSet: function(set) {
    set.setOptions(this.getConfigFromSet(set));
  },
  setAllOptions: function() {
    this.sets.forEach(set => set.setOptions(this.getConfigFromSet(set)));
  },
  createOptionsFrom: function(set, container) {
    let set_options = set.getOptions();
    this.sets.push(set);
    let config = {};
    this.configurations[set_options.group] = config;
    container = container || this.options_container;
    this.recursive(set_options, container, config);
  },
  recursive: function(options, container, config) {
    if (options.type !== undefined) {
      let res = this.createProperty(options, config);
      for (let child in res) container.appendChild(res[child]);
    } else {
      let new_container = this.document.createElement("div");
      new_container.classList.add("container");
      let new_config = {};
      for (let option in options) {
        if (option === "group") {
          new_container.id = options.group;
        } else {
          this.recursive(options[option], new_container, new_config);
        }
      }
      config[new_container.id] = new_config;
      let title = this.document.createElement("p");
      title.classList.add("title");
      title.innerHTML = new_container.id + " options";
      container.appendChild(title);
      container.appendChild(new_container);
    }
  },
  createProperty: function(property, config) {
    let input = this.document.createElement("input");
    let label = this.document.createElement("label");

    for (let key in property) input[key] = property[key];

    label.innerHTML = input.id;
    label.for = input.id;

    if (input.type === "range") {
      config[input.id] = parseFloat(input.value);
      let value = this.document.createElement("div");
      value.innerHTML = parseFloat(input.value);
      input.addEventListener("change", () => {
        value.innerHTML = parseFloat(input.value);
        config[input.id] = parseFloat(input.value);
      });
      return {
        label: label,
        input: input,
        value: value
      };
    } else if (input.type === "radio") {
      config[input.id] = input.checked;
      input.addEventListener("change", () => {
        for (let c in config) config[c] = false;
        config[input.id] = input.checked;
      });
      return {
        label: label,
        input: input
      };
    } else {
      config[input.id] = input.checked;
      input.addEventListener("change", () => {
        config[input.id] = input.checked;
      });
      return {
        label: label,
        input: input
      };
    }
  },
  generateDataSet: function(dataset_id, N) {
    if (dataset_id === "circle") {
      return this.dataset_generator.circleData(N);
    } else if (dataset_id === "multi-circle") {
      return this.dataset_generator.circleMultipleData(N);
    } else if (dataset_id === "exclusive") {
      return this.dataset_generator.exclusiveOrData(N);
    } else if (dataset_id === "gaussian") {
      return this.dataset_generator.gaussianData(N);
    } else if (dataset_id === "spiral") {
      return this.dataset_generator.spiralData(N);
    } else if (dataset_id === "stripes-v") {
      return this.dataset_generator.stripesVData(N);
    } else if (dataset_id === "stripes-h") {
      return this.dataset_generator.stripesHData(N);
    } else if (dataset_id === "random") {
      return this.dataset_generator.randomData(N);
    }
  }
};

module.exports = UI;
