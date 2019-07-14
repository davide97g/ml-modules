const kernels = require("./kernels.js");
const linearKernel = kernels.linearKernel;
const makePolyKernel = kernels.makePolyKernel;
const makeRbfKernel = kernels.makeRbfKernel;
const makeSigmoidKernel = kernels.makeSigmoidKernel;
const utils = require('../utils.js');

let svm_id=1;
const SVM = function() {
    this.svm_id = svm_id++;
};

SVM.prototype = {

    setOptions: function(options) {
        this.options = options;
    },

    getOptions: function(){
        let options = {
            group:"svm "+this.svm_id,
            C: {
                id:"C",
                type: "range",
                min: 0,
                max: 2,
                step: 0.1,
                value: this.C
            },
            karpathy:{
                id:"karpathy",
                type:"checkbox",
                checked: true
            },
            memoize:{
                id:"memoize",
                type:"checkbox",
                checked: true
            },
            kernel:{
                group:"kernel",
                linear:{
                    id:"linear",
                    type:"radio",
                    value:"linear",
                    name:"kernel"+this.svm_id,
                    checked: this.kernelType === "linear",
                    disabled: true
                },
                poly: {
                    id:"poly",
                    type:"radio",
                    value:"poly",
                    name:"kernel"+this.svm_id,
                    checked: this.kernelType === "poly",
                    disabled: true
                },
                rbf:{
                    id:"rbf",
                    type:"radio",
                    value:"rbf",
                    name:"kernel"+this.svm_id,
                    checked: this.kernelType === "rbf",
                    disabled: true
                }
            }
        };
        if(this.kernelType === "linear"){
            options.group = "svm linear "+this.svm_id;
        }
        else if(this.kernelType === "poly"){
            options.group = "svm poly "+this.svm_id;
            options.degree = {
                id:"degree",
                type: "range",
                min: 2,
                max: 5,
                step: 1,
                value: this.degree
            };
        }
        else if(this.kernelType === "rbf"){
            options.group = "svm rbf "+this.svm_id;
            options.rbfSigma = {
                id:"rbfSigma",
                type: "range",
                min: 0,
                max: 1,
                step: 0.1,
                value: this.rbfSigma
            };
        }
        return options;
    },

    train: function(data, labels) {

        this.data = data;
        this.labels = labels;

        // parameters
        // options = options || {};
        this.options = this.options || {};
        let options = this.options;
        let C = options.C || 1.0; // C value. Decrease for more regularization
        let tol = options.tol || 1e-4; // numerical tolerance. Don't touch unless you're pro
        let alphatol = options.alphatol || 0; // non-support vectors for space and time efficiency are truncated. To guarantee correct result set this to 0 to do no truncating. If you want to increase efficiency, experiment with setting this little higher, up to maybe 1e-4 or so.
        let maxiter = options.maxiter || 10000; // max number of iterations
        let numpasses = options.numpasses || 10; // how many passes over data with no change before we halt? Increase for more precision.
        let SSCA = options.SSCA || false; // smoothed separable case approximation algorithm
        let UB = options.UB || 0.5;

        this.C = C;
        this.tol = tol;
        this.alphatol = alphatol;
        this.maxiter = maxiter;
        this.numpasses = numpasses;
        this.eps = 1e-3; // for the full implemented SMO algorithm

        // instantiate kernel according to options. kernel can be given as string or as a custom function
        let kernel = linearKernel;
        this.kernelType = "linear";
        let kernelType = "linear";
        for (let d in this.options.kernel) {
            if (this.options.kernel[d]) kernelType = d;
            }
        if("kernel" in options) {
            if(typeof kernelType === "string") {
                // kernel was specified as a string. Handle these special cases appropriately
                if(kernelType === "linear") {
                    this.kernelType = "linear";
                    kernel = linearKernel;
                }
                if(kernelType === "rbf") {
                    let rbfSigma = options.rbfsigma || 0.5;
                    this.rbfSigma = rbfSigma; // back this up
                    this.kernelType = "rbf";
                    kernel = makeRbfKernel(rbfSigma);
                }
                if(kernelType === "poly"){
                    let degree = options.degree || 2;
                    this.degree = degree;
                    let influence = options.influence || 1;
                    if(influence<0) //cannot be negative
                        influence = 0; //setting to zero
                    this.influence = influence;
                    this.kernelType = "poly";
                    kernel = makePolyKernel(degree, influence);
                }
                if(kernelType === "sigm"){
                    let influence = options.influence || 1;
                    if(influence<0) //cannot be negative
                        influence = 0; //setting to zero
                    this.influence = influence;
                    this.kernelType = "sigm";
                    kernel = makeSigmoidKernel(influence);
                }
            }
            else {
                // assume kernel was specified as a function. Let's just use it
                this.kernelType = "custom";
                kernel = options.kernel;
            }
        }

        //kernel choice
        this.kernel = kernel;
        //initializations
        this.N = this.data.length;
        this.D = this.data[0].length;
        this.alpha = utils.zeros(this.N);
        this.b = 0.0;
        this.usew_ = false; // internal efficiency flag

        this.use_timer = options.timer;

        if(this.use_timer) {
            this.ctx = options.timer.ctx || null;
            this.updateFrequency = options.timer.updateFrequency || null;
            this.stepsFrequency = options.timer.stepsFrequency || null;
        }

        // Cache kernel computations to avoid expensive recomputation.
        // This could use too much memory if N is large.
        if (options.memoize) {
            this.kernelResults = new Array(this.N);
            for (let i=0;i<this.N;i++) {
                this.kernelResults[i] = new Array(this.N);
                for (let j=0;j<this.N;j++) {
                    this.kernelResults[i][j] = this.kernel(data[i],data[j]);
                }
            }
        }

        this.karpathy = options.karpathy || false;
        if(this.karpathy){
            // run SMO algorithm
            this.iter = 0;
            this.passes = 0;

            if(options.timer){
                this.timerKarpathySMO();
            }
            else{
                this.karpathySMO();
                this.store();
            }
        }
        else {
            //FULL Sequential Minimal Optimization (J.Platt)
            //find non-pruned solution for SVM
            this.SMO();

            //Smoothed Separable Case Approximation
            if(SSCA){
                this.SSCA(UB,options);
                this.SMO();
            }
            this.store();
        }

    },

    karpathySMO: function(){
        while(this.passes < this.numpasses && this.iter < this.maxiter) {
            this.karpathySMOtime();
        }
    },

    timerKarpathySMO: function(){
        let weights = [];
        let updateFrequency = this.updateFrequency;
        let stepsFrequency = this.stepsFrequency;
        this.timerVar = setInterval(()=>{
            if(this.passes < this.numpasses && this.iter < this.maxiter){
                let times = 0;
                while(this.passes < this.numpasses && this.iter < this.maxiter && times < stepsFrequency) {
                    this.karpathySMOtime();
                    times++;
                }
                let w = this.getWeights();
                weights.push(w);
                draw();
                if(!this.input_transformation) {
                    for (let i = 0; i < weights.length; i++)
                        drawIntermidiate(this.ctx, weights[i]);
                }
            }
            else{
                clearInterval(this.timerVar);
                this.store();
                draw();
                if(!this.input_transformation) {
                    for (let i = 0; i < weights.length; i++)
                        drawIntermidiate(this.ctx, weights[i]);
                }
            }
        }, updateFrequency);
    },

    karpathySMOtime: function(){
        let data = this.data;
        let labels = this.labels;
        let C = this.C;
        let alphaChanged = 0;
        for (let i = 0; i < this.N; i++) {

            let Ei = this.marginOne(data[i]) - labels[i];
            if ((labels[i] * Ei < -this.tol && this.alpha[i] < C)
                || (labels[i] * Ei > this.tol && this.alpha[i] > 0)) {

                // alpha_i needs updating! Pick a j to update it with
                let j = i;
                while (j === i) j = utils.randi(0, this.N);
                let Ej = this.marginOne(data[j]) - labels[j];

                // calculate L and H bounds for j to ensure we're in [0 C]x[0 C] box
                let ai = this.alpha[i];
                let aj = this.alpha[j];
                let L = 0;
                let H = C;
                if (labels[i] === labels[j]) {
                    L = Math.max(0, ai + aj - C);
                    H = Math.min(C, ai + aj);
                } else {
                    L = Math.max(0, aj - ai);
                    H = Math.min(C, C + aj - ai);
                }

                if (Math.abs(L - H) < 1e-4) continue;

                let eta = 2 * this.kernelResult(i, j) - this.kernelResult(i, i) - this.kernelResult(j, j);
                if (eta >= 0) continue;

                // compute new alpha_j and clip it inside [0 C]x[0 C] box
                // then compute alpha_i based on it.
                let newaj = aj - labels[j] * (Ei - Ej) / eta;
                if (newaj > H) newaj = H;
                if (newaj < L) newaj = L;
                if (Math.abs(aj - newaj) < 1e-4) continue;
                this.alpha[j] = newaj;
                let newai = ai + labels[i] * labels[j] * (aj - newaj);
                this.alpha[i] = newai;

                // update the bias term
                let b1 = this.b - Ei - labels[i] * (newai - ai) * this.kernelResult(i, i)
                    - labels[j] * (newaj - aj) * this.kernelResult(i, j);
                let b2 = this.b - Ej - labels[i] * (newai - ai) * this.kernelResult(i, j)
                    - labels[j] * (newaj - aj) * this.kernelResult(j, j);
                this.b = 0.5 * (b1 + b2);
                if (newai > 0 && newai < C) this.b = b1;
                if (newaj > 0 && newaj < C) this.b = b2;

                alphaChanged++;

            } // end alpha_i needed updating
        } // end for i=1..N
        if(this.use_timer)
            this.store();

        if (alphaChanged === 0) this.passes++;
        else this.passes = 0;

        this.iter++;
    },

    store: function(){
        // if the user was using a linear kernel, lets also compute and store the
        // weights. This will speed up evaluations during testing time
        if(this.kernelType === "linear" || (this.kernelType === "poly" &&  this.degree === 1)) {

            // compute weights and store them
            this.w = new Array(this.D);
            let s;
            for(let j=0;j<this.D;j++) {
                s=0;
                for(let i=0;i<this.data.length;i++) {
                    s += this.alpha[i] * this.labels[i] * this.data[i][j];
                }
                this.w[j] = s;
                this.usew_ = true;
            }

        }
        else {
            // okay, we need to retain all the support vectors in the training data,
            // we can't just get away with computing the weights and throwing it out

            // But! We only need to store the support vectors for evaluation of testing
            // instances. So filter here based on this.alpha[i]. The training data
            // for which this.alpha[i] = 0 is irrelevant for future.
            let newdata = [];
            let newlabels = [];
            let newalpha = [];
            for(let i=0;i<this.N;i++) {
                if(this.alpha[i] > this.alphatol) { //only if they are useful
                    newdata.push(this.data[i]);
                    newlabels.push(this.labels[i]);
                    newalpha.push(this.alpha[i]);
                }
            }

            // store data and labels
            this.data = newdata;
            this.labels = newlabels;
            this.alpha = newalpha;
            this.N = this.data.length;
        }
    },

    update: function(){
        // update value
        this.N = this.data.length;
        this.D = this.data[0].length;

    },

    getMaxMargin(data){
        let margins = this.margins(data);
        let max = 0;
        for(let i=0;i<margins.length;i++){
            if(margins[i]>max){
                max = Math.abs(margins[i]);
            }
        }
        return max;
    },

    getMinMargin(data){
        let margins = this.margins(data);
        let min = 0;
        for(let i=0;i<margins.length;i++){
            if(margins[i]<min){
                min = margins[i];
            }
        }
        return min;
    },

    getFormulaLinear: function(wb){
        let formula = "";
        let value = 0;
        let text = "";
        let equation = "";
        let res = {
        html: "",
        text: "",
        equation: ""
        };
        let intro = "f(";
        for(let i=0;i<wb.w.length;i++){
            intro +="x"+"<sub>"+i+"</sub>";
            if(i<wb.w.length-1)
                intro+=",";
        }
        intro +="): ";
        for(let i=0;i<wb.w.length;i++){
        value = wb.w[i].toPrecision(6);
        if(value > 0) {
            formula += "+" + value;
            text += "+" + value;
            equation += "+" +value;
        }
        else {
            formula += value;
            text += value;
            equation += +value;
        }
        formula += "*<strong>x"+"<sub>"+i+"</sub>"+"</strong>";
        text += "*x"+i;
        equation += "*x"+i;
    }

    if(wb.b > 0) {
        formula += "+" + wb.b.toPrecision(6);
        text += "+" + wb.b.toPrecision(6);
        equation += "+" + wb.b.toPrecision(6);
    }
    else {
        formula += "" + wb.b.toPrecision(6);
        text += "" + wb.b.toPrecision(6);
        equation += "" + wb.b.toPrecision(6)+"=0";
    }
    res.html = "<strong>"+intro+"</strong>"+formula;
    res.text = text;
    res.equation = equation;
    return res;
    },

    // inst is an array of length D. Returns margin of given example
    // this is the core prediction function. All others are for convenience mostly
    // and end up calling this one somehow.
    marginOne: function(inst) {
        //console.info("marginOne");
        let f = 0;
        if(this.karpathy)
            f = this.b;
        else f = -this.b;
        // if the linear kernel was used and w was computed and stored,
        // (i.e. the svm has fully finished training)
        // the internal class variable usew_ will be set to true.
        if(this.usew_) { //only with linear kernel
            // we can speed this up a lot by using the computed weights
            // we computed these during train(). This is significantly faster
            // than the version below
            for(let j=0;j<this.D;j++) {
                f += inst[j] * this.w[j];
            }
        }
        else { // others kernel or not already finished computing the weights
            for(let i=0;i<this.data.length;i++) { //for every data entry (N times)
                f += this.alpha[i] * this.labels[i] * this.kernel(inst, this.data[i]); //sum of all these product, including kernel evaluation with
            }
        }

        return f;
    },

    predictClass: function(inst) {
        return this.marginOne(inst) >= 0 ? 1:-1;
    },

    predict:  function(inst){
        return ((Math.tanh(this.marginOne(inst)))+1)/2;
    },

    // data is an NxD array. Returns array of margins.
    margins: function(data) {

        // go over support vectors and accumulate the prediction.
        const N = data.length;
        let margins = new Array(N);
        for(let i=0;i<N;i++) {
            margins[i] = this.marginOne(data[i]);
        }
        return margins;

    },

    //used just for memoize the values calculated from the kernel
    kernelResult: function(i, j) {
        if (this.kernelResults) {
            return this.kernelResults[i][j];
        }
        return this.kernel(this.data[i], this.data[j]);
    },

    // THIS FUNCTION IS NOW DEPRECATED. WORKS FINE BUT NO NEED TO USE ANYMORE.
    // LEAVING IT HERE JUST FOR BACKWARDS COMPATIBILITY FOR A WHILE.
    // if we trained a linear svm, it is possible to calculate just the weights and the offset
    // prediction is then yhat = sign(X * w + b)
    getWeights: function() {
        //if(this.usew_) return {w: this.w, b:this.b};
        // DEPRECATED
        let D = this.data[0].length;
        let w = new Array(D);
        for(let j=0;j<D;j++) {
            let s= 0.0;
            for(let i=0;i<N;i++) {
                s+= this.alpha[i] * this.labels[i] * this.data[i][j];
            }
            w[j]= s;
        }
        return {w: w, b: this.b};
    },

    toJSON: function() {

        if(this.kernelType === "custom") {
            console.log("Can't save this SVM because it's using custom, unsupported kernel...");
            return {};
        }

        let json = {};
        json.N = this.N;
        json.D = this.D;
        json.b = this.b;

        json.kernelType = this.kernelType;
        if(this.kernelType === "linear") {
            // just back up the weights
            json.w = this.w;
        }
        if(this.kernelType === "rbf") {
            // we need to store the support vectors and the sigma
            json.rbfSigma = this.rbfSigma;
            json.data = this.data;
            json.labels = this.labels;
            json.alpha = this.alpha;
        }
        if(this.kernelType === "poly"){
            //we need to store the support vectors, the influence and the degree
            json.influence = this.influence;
            json.degree = this.degree;
            json.data = this.data;
            json.labels = this.labels;
            json.alpha = this.alpha;
        }
        return json;
    },

    fromJSON: function(json) {

        this.N = json.N;
        this.D = json.D;
        this.b = json.b;

        this.kernelType = json.kernelType;
        if(this.kernelType === "linear") {

            // load the weights!
            this.w = json.w;
            this.usew_ = true;
            this.kernel = linearKernel; // this shouldn't be necessary
        }
        else if(this.kernelType === "rbf") {

            // initialize the kernel
            this.rbfSigma = json.rbfSigma;
            this.kernel = makeRbfKernel(this.rbfSigma);

            // load the support vectors
            this.data = json.data;
            this.labels = json.labels;
            this.alpha = json.alpha;
        }
        else if(this.kernelType === "poly") {

            // initialize the kernel
            this.degree = json.degree;
            this.influence = json.influence;
            this.kernel = makePolyKernel(this.degree, this.influence);

            // load the support vectors
            this.data = json.data;
            this.labels = json.labels;
            this.alpha = json.alpha;
        }
        else {
            console.log("ERROR! unrecognized kernel type." + this.kernelType);
        }
    },

    //********** FULL SMO ALGORITHM

    takeStep: function(i1,i2,i,j){
        //console.info("trying taking step with "+i+","+j);
        if(i === j) return 0; //basta controllare l'indice
        //console.info("not equal, go on");
        let alph1 = this.alpha[i];
        let alph2 = this.alpha[j];
        let y1 = this.labels[i];
        let y2 = this.labels[j];
        let E1 = this.getE(i);
        let E2 = this.getE(j);
        let s = y1*y2;
        //Compute L, H via equations (13) and (14)
        let C = this.C; //utiliy variable
        let L,H;
        if(y1 === y2) {
            L = Math.max(0, alph2+alph1-C);
            H = Math.min(C, alph2+alph1);
        }
        else {
            L = Math.max(0, alph2-alph1);
            H = Math.min(C, C+alph2-alph1);
        }
        //console.info("L-H = "+Math.abs(L-H)+" < "+1e-4+" ?");
        if(L===H) return 0;
        //console.info("no, go on");
        let k11 =this.kernelResult(i,i);
        let k12 =this.kernelResult(i,j);
        let k22 =this.kernelResult(j,j);
        let eta = k11 + k22 - 2*k12;

        let a1;
        let a2;
        if(eta > 0){
            a2 = alph2 + y2*(E1-E2)/eta;
            if(a2<L) a2 = L;
            else if(a2>H) a2 = H;
        }
        else{
            //console.info("eta <0");
            let f1 = y1*(E1+this.b)-alph1*this.kernelResult(i,i)-s*alph2*this.kernelResult(i,j);
            let f2 = y2*(E2+this.b)-s*alph1*this.kernelResult(i,j)-alph2*this.kernelResult(j,j);
            let L1 = alph1+s*(alph2-L);
            let H1 = alph1+s*(alph2-H);
            let Lobj = L1*f1-L*f2+0.5*L1*L1*this.kernelResult(i,i)+0.5*L*L*this.kernelResult(j,j)+s*L*L1*this.kernelResult(i,j);
            let Hobj = H1*f1+H*f2+0.5*H1*H1*this.kernelResult(i,i)+0.5*H*H*this.kernelResult(j,j)+s*H*H1*this.kernelResult(i,j);

            if(Lobj < Hobj-this.eps)
                a2 = L;
            else if( Lobj > Hobj+this.eps)
                a2 = H;
            else
                a2 = alph2;
            //this.alpha[i] = value; //risetto il valore a quello di prima
        }
        //console.info("a2-alph2 = "+Math.abs(a2-alph2)+" < "+this.eps*(a2+alph2+this.eps)+" ?");
        if(Math.abs(a2-alph2)<this.eps*(a2+alph2+this.eps))
            return 0;
        //console.info("No,you're done");
        a1 = alph1+s*(alph2-a2);

        //console.info("updating");
        //Update threshold to reflect change in Lagrange multipliers
        let b1 = this.b + E1 + y1*(a1-alph1)*this.kernelResult(i,i) + y2*(a2-alph2)*this.kernelResult(i,j);
        let b2 = this.b + E2 + y1*(a1-alph1)*this.kernelResult(i,j) + y2*(a2-alph2)*this.kernelResult(j,j);
        this.b = 0.5*(b1+b2);
        if(a1 > 0 && a1 < C) this.b = b1;
        if(a2 > 0 && a2 < C) this.b = b2;

        if(this.kernelType === "linear") {
            //console.info("store weights");
            // compute weights and store them
            let D = this.data[0].length;
            this.w = new Array(D);
            for(let j=0;j<D;j++) {
                let s=0.0;
                for(let i=0;i<this.data.length;i++) {
                    s += this.alpha[i] * this.labels[i] * this.data[i][j];
                }
                this.w[j] = s;
                this.usew_ = true;
            }
        }
        //Update error cache using new Lagrande multipliers
        //************not implemented caching

        //Store a1 in the alpha array
        this.alpha[i] = a1;
        //Store a2 in the alpha array
        this.alpha[j] = a2;
        //console.info("step taken");
        return 1;

    },

    notAtBoundsAlpha: function(){
        let indexes = [];
        for(let i=0;i<this.alpha.length;i++){
            if(!this.isAtBounds(this.alpha[i]))
                indexes.push(i);
        }
        return indexes;
    },

    isAtBounds: function(value){
        return value === 0 || value === this.C;
    },

    getE: function(i){
        return this.marginOne(this.data[i]) - this.labels[i];
    },

    getMaxStepAlpha: function(i){
        let index = 0;
        let E1 = this.getE(i);
        //let E = new Array(this.data.length);
        let E = [];
        for(let j=0;j<this.data.length;j++){ //fill E vector
            E.push(this.getE(i));
        }
        if(E1 > 0){ //if positive, find the min
            let min = E[0];
            for(let j=0;j<E.length;j++){ //sort the best
                if(j!==i){
                    if(min>E[j]) {
                        index = j; // save the index
                        min = E[j]; //new min
                    }
                }
            }
        }
        else{ //non-positive, find the max
            let max = E[0];
            for(let j=0;j<E.length;j++){ //sort the best
                if(j!==i){
                    if(max<E[j]){
                        index = j; //save the index
                        max = E[j]; //new max
                    }
                }
            }
        }

        return index;
    },

    examineExample: function(i2, i){
        //console.info("examineExample");
        //let labels = this.labels;
        //let C = this.C;
        //let tol = this.tol;
        //let limit = this.data.length;
        //***************
        let y2 = this.labels[i];
        let alph2 = this.alpha[i];
        let E2 = this.getE(i);
        let r2 = E2*y2;
        let i1;
        if( (r2 < -this.tol && alph2 < this.C) || (r2 > this.tol && alph2 > 0) ) {
            let indexes = this.notAtBoundsAlpha();
            if(indexes.length > 1){ //number of non-zero & non-C alpha > 1
                let index = this.getMaxStepAlpha(i);
                i1 = this.data[index];//result of second choice heuristic
                if(this.takeStep(i1,i2,index,i)){
                    return 1;
                }
            }

            let counter=0;
            let rand = utils.randi(0,indexes.length);
            for(let j=rand;counter<indexes.length;j++){ //loop over all non-zero and non-C alpha, starting at a random point
                if(j === indexes.length){
                    j=-1;
                    continue; //skip this cycle
                }
                i1 = this.data[indexes[j]];
                if(this.takeStep(i1,i2,j,i))
                    return 1;

                counter++;
            }

            counter = 0;
            rand = utils.randi(0,this.data.length);
            for(let j=rand;counter<this.data.length;j++){ //loop over all possibile i1, starting at a random point
                if(j === this.data.length){
                    j=-1;
                    continue; //skip this cycle
                }
                i1 = this.data[j];
                //console.info("trying with index: "+j);
                if(this.takeStep(i1,i2,j,i))
                    return 1;
                counter++;
            }
        }
        return 0;
    },

    SMO: function () {
        console.info("🐻 SMO (Platt): "+this.data.length);
        this.update();
        //let statistics = {};
        if(this.N === 0) return 0; // statistics;
        let numChanged  = 0;
        let examineAll = 1;
        this.iter = 0;
        this.N = this.data.length; //length of training examples

        while(numChanged > 0 || examineAll){ //outer loop
            numChanged = 0;
            if(examineAll){
                for (let i=0;i<this.N;i++){ //loop over all training examples
                    numChanged += this.examineExample(this.data[i],i);
                }
            }
            else {
                for (let i=0;i<this.N;i++){ //loop over examples
                    if(!this.isAtBounds(this.alpha[i])){//where alpha is not 0 & not C
                        numChanged += this.examineExample(this.data[i],i);
                    }
                }
            }
            if(examineAll === 1)
                examineAll = 0;
            else if( numChanged === 0)
                examineAll = 1;
            this.iter++;
        }

        /*
        //run statistics evaluation
        statistics = statisticEval(this.labels,this.predict(this.data));
        statistics.data = this.data;
        statistics.labels = this.labels;
        statistics.iters = iter;
        */

        // this.ROC();

        //this.check();

        console.info("🐻 SMO end");

        //return statistics;
    },

    findMaxDistance: function(){
        let max = this.marginOne(this.data[0]);
        let value=0;
        for(let i=0;i<this.data.length;i++){
            value = Math.abs(this.marginOne(this.data[i]));
            if(value > max){
                max = value;
            }
        }
        return max;
    },

    //********** SSCA
    //********* Smoothed Separable Case Approximation

    ruleA: function(i,labels){
        console.info("ruleA");
        labels[i] = -labels[i];
    },

    ruleB: function(i,data,alpha,labels){
        console.info("ruleB element: "+i);
        data.splice(i,1);
        alpha.splice(i,1);
        labels.splice(i,1);
    },

    marginSSCA: function(inst,data,alpha,labels){
        let f = -this.b;
        for(let i=0;i<data.length;i++) { //for every data entry (N times)
            f += alpha[i] * labels[i] * this.kernel(inst, data[i]); //sum of all these product, including kernel evaluation with
        }
        return f;
    },

    SSCA: function (D,options) {
        console.info("🍀 SSCA: "+this.data.length);
        let value;

        let alpha = utils.copyArray(this.alpha);
        let labels = utils.copyArray(this.labels);
        let data = utils.copyArray(this.data);
        let left = this.data.length;

        //check conditions for rules A,B
        for (let i = 0; i < left; i++) { //per N volte

            value = this.marginSSCA(data[i],data,alpha,labels) * labels[i];
            //SCA
            if (value < 0) { //misclassified
                this.ruleA(i,labels); //flip label
                value = this.marginSSCA(data[i],data,alpha,labels) * labels[i];

                if (value < 0) { //misclassified
                    console.info("i:" + i);
                    this.ruleB(i,data,alpha,labels);
                    i--;
                    left--;
                    continue; //vado avanti
                }
            }
            //SSCA
            if (value < D) { //misclassified if it's under a threshold D
                console.info("under " + D);
                this.ruleB(i,data,alpha,labels);
                i--;
                left--;
            }
        }

        this.data = data;
        this.alpha = alpha;
        this.labels = labels;

        this.check();

        options.SSCA = false; //not SSCA again after training
        console.info("🍀 SSCA end");
    },

    check: function () {
        console.info("\t🔍 CHECK");
        let value = 0;
        let noOne = true;
        for (let i = 0; i < this.data.length; i++) { //per tutti quelli che devo eliminare
            value = this.marginOne(this.data[i]) * this.labels[i];
            if (value < 0){ //still misclassified with this configuration
                noOne = false;
                console.info("\t💀 "+i+":" + value);
            }
        }
        if(noOne) console.info("\t✔️");
    }
};

module.exports = SVM;