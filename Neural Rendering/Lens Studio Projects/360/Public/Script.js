//@input Component.MLComponent mlComponent
//@input Component.MLComponent mlSinCos
//@input Component.MLComponent mlSampler
//@input bool updateEachFrame

/* -------- Macros --------  */
// ML model constants
const H = 100;
const W = 100;
const NSAMPLE = 8;
const RADIUS = 4;

const NEAR = 2;
const FAR = 6;
const CAM_ANGLE = 0.6911112070083618;
const focal = .5 * W / Math.tan(.5 * CAM_ANGLE);
const MAT_CONST = new Float32Array(
        [-1, 0, 0, 0,
         0, 0, 1, 0,
         0, 1, 0, 0,
         0, 0, 0, 1]
);

// load meshgrid only once
var xCoords = new Float32Array(W * H);
var yCoords = new Float32Array(W * H);
meshGrid(W, H, xCoords, yCoords);

const DEBUG = false;  
var inputData;  
/* -------------------------- */

var PointSampler = function () {
       
    this.dirs = new Float32Array(W * H * 3);
    var meshGridSize = new vec3(W, H, 1);
    var oneArrShape = vec3.one();
    var oneArr = new Float32Array(1);

    //1 arr
    var first = new Float32Array(W * H);
    oneArr[0] = -W * 0.5;
    TensorMath.addTensors(
         xCoords,
         meshGridSize,
         oneArr, 
         oneArrShape, 
         first
    );
    
    TensorMath.mulScalar(first, 1 / focal, first)

    //2 
    var sec = new Float32Array(W * H);
    oneArr[0] = -H * 0.5;
    TensorMath.addTensors(
          yCoords, 
          meshGridSize,
          oneArr, 
          oneArrShape, 
          sec
    );
    
    oneArr[0] = -1 / focal;
    TensorMath.mulTensors(
         sec,
         meshGridSize,
         oneArr, 
         oneArrShape,
         sec
    );

    //3 arr
    var ones = new Float32Array(W * H);
    
    fill(ones, -1);
    var temp = new Float32Array(W * H * 2);
    TensorMath.concat(
         first,
         meshGridSize, 
         sec,
         meshGridSize,
         2,
         temp
    );
    
    TensorMath.concat(
         temp,
         new vec3(W, H, 2), 
         ones,
         meshGridSize,
         2,
         this.dirs
    );

    this.zVals = new Float32Array(NSAMPLE);
    this.zValsShape = new vec3(NSAMPLE, 1, 1);

    fillLinspace(this.zVals, 0, 1.0);
    TensorMath.mulScalar(this.zVals, FAR - NEAR, this.zVals);
    TensorMath.addScalar(this.zVals, NEAR, this.zVals);

    this.zValsTest = new Float32Array(NSAMPLE * H * W);
    this.zValsTestShape = new vec3(1, W * H, NSAMPLE);

    TensorMath.repeat(
          this.zVals,
          this.zValsShape,
          new vec3(1, W * H, 1), 
          this.zValsTest
    );
 
}

PointSampler.prototype.sample_test = function (c2w) {
    // c2w: 3x4

    /*
        c2w[:3, :3]
    */
//    const t0 = performance.now();
    var first = new Float32Array(c2w.buffer, 0 * 4, 3);
    var second = new Float32Array(c2w.buffer, 4 * 4, 3);
    var third = new Float32Array(c2w.buffer, 8 * 4, 3);

    var subArr = new Float32Array(2 * 3);
    var c2w_33 = new Float32Array(3 * 3);

    TensorMath.concat(
         first,
         new vec3(3, 1, 1),
         second,
         new vec3(3, 1, 1),
         1,
         subArr
    );
            
    TensorMath.concat(
         subArr,
         new vec3(3, 2, 1),
         third,
         new vec3(3, 1, 1),
         1,
         c2w_33
    );

    /*
        c2w[:3, -1]. shape [3, 1, 1]    
    */
    var first = new Float32Array(c2w.buffer, 3 * 4, 1);
    var second = new Float32Array(c2w.buffer, 7 * 4, 1);
    var third = new Float32Array(c2w.buffer, 11 * 4, 1);

    var subArr = new Float32Array(2);
    var c2w_3 = new Float32Array(3);

    TensorMath.concat(
         first,
         new vec3(1, 1, 1),
         second,
         new vec3(1, 1, 1),
         0,
         subArr
    );

    TensorMath.concat(
         subArr,
         new vec3(2, 1, 1),
         third,
         new vec3(1, 1, 1),
         0,
         c2w_3
    );
    
    return [c2w_33, c2w_3]

}



/*
    Generate the camera poses for given translation, phi and theta

*/

var GetPoses = function (TRANS_T, ROT_PHI, ROT_TH, MAT_CONST) {

    /*
        c2w = trans_t(self.RADIUS)
        c2w = rot_phi(phi / 180. * torch.pi) @ c2w
        
        c2w = rot_theta(theta / 180. * torch.pi) @ c2w
        c2w = torch.Tensor([
                    [-1,0,0,0],
                    [ 0,0,1,0],
                    [ 0,1,0,0],
                    [ 0,0,0,1]]) @ c2w
    */
    var c2w_t = new Float32Array(4 * 4);
    matMul(ROT_PHI, TRANS_T, c2w_t, 4, 4, 4);
    matMul(ROT_TH, c2w_t, TRANS_T, 4, 4, 4);
    matMul(MAT_CONST, TRANS_T, c2w_t, 4, 4, 4);
    
    var poses = new Float32Array(c2w_t.buffer, 0, 12);
    return poses;

}



//helper functions
function fillLinspace(arr, start, end) {
    var space = (end - start) / (arr.length - 1)
    for (var i = 0; i < arr.length; i++) {
        arr[i] = start + i * space;
    }
}

function meshGrid(w, h, xCoords, yCoords) {
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            xCoords[i * w + j] = j;
            yCoords[i * w + j] = i;
        }
    }
}

function fill(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = value;
    }
}

function printArray(arr, w, h, z) {
//    if (!script.debug) return;
    if (!DEBUG) return;
    for (var k = 0; k < z; k++) {
        var jsArr = new Array(w);
        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
                jsArr[j] = arr[k * h * w + i * w + j];
            }
            print(jsArr);
        }
        print("======")
    }
}


function sinNcos(a, b) {
    for (var i = 0; i < b.length; ++i) {
        b[i] = Math.cos(a[i]);
        a[i] = Math.sin(a[i]);
    }

}

function matMul(a, b, out, m, n, p) {
    /* A @ B
    Args:
    *   a: compact 2D array of size m x n
    *   b: comapct 2D array of size n x p
    *   out: compact 2D array of size m x p to write the output to
    *   m: rows of a / out
    *   n: columns of a / rows of b
    *   p: coolumns of b / out
     
    */
    for (var i = 0; i < m; ++i) {
        for (var j = 0; j < p; ++j) {
            var sum = 0;
            for (var k = 0; k < n; ++k) {
                sum += a[i * n + k] * b[k * p + j];
            }
            out[i * p + j] = sum;
        }
    }
}


// Lens 


var embbRays;
var outRays;
var pointSampler = new PointSampler();
var modelBuilt = 0;
 
var c2w33;
var c2w13
var pts;

script.mlSinCos.onLoadingFinished = onHelperModelLoadingFinished;
script.mlComponent.onLoadingFinished = onLoadingFinished;
script.mlSampler.onLoadingFinished = onSamplerLoadingFinished;

function onLoadingFinished() {
    print("Main model built")
    inputData = script.mlComponent.getInput("input").data;

    if(modelBuilt == 2){
        
        initalize();
    } else {
        modelBuilt++;
        print("Second model built")
    } 
}

function onHelperModelLoadingFinished(){
    embbRays = script.mlSinCos.getInput("rays").data;
    outRays =  script.mlSinCos.getOutput("embbrays").data;
    
    if(modelBuilt == 2){
        initalize();
    } else {
        modelBuilt++;
    } 
}


function onSamplerLoadingFinished(){
     c2w33 = script.mlSampler.getInput("c2w33").data;
     c2w13 =  script.mlSampler.getInput("c2w13").data;
     pts =  script.mlSampler.getOutput("pts").data;
    
     if(modelBuilt == 2){
        initalize();
    } else {
        modelBuilt++;
    } 
    
    
}


var THETA = 180;
var PHI = -47;
var originTheta = 10;
var originPhi = -15;
var startPos = null;
var needUpdate = false;

global.touchSystem.touchBlocking = true;


// set initial view angle and adjust the angle accordingly when rotating.
function initalize(){
    sampleAndRun();
    print("initialized");
//    var start =  performance.now();
    var touchStartEvent = script.createEvent("TouchStartEvent");
    touchStartEvent.bind(function(){
        startPos = touchStartEvent.getTouchPosition();
        originTheta = THETA;
        originPhi = PHI;
        needUpdate = true;
    });
    
    var touchMoveEvent = script.createEvent("TouchMoveEvent");
    touchMoveEvent.bind(function(){
        var pos = touchMoveEvent.getTouchPosition();
            if (startPos == null) {
                startPos = pos;
                return;
            }
        // update the view angle based on the TouchMoveEvent
        var dir = pos.sub(startPos);
        dir = dir.uniformScale(100);
        THETA = originTheta + dir.x;
        PHI = originPhi - dir.y;
        PHI = Math.max(-75, Math.min(PHI, -15));
        print("theta" + THETA)
        print("PHi" +PHI)
        needUpdate = true;
    });

    script.createEvent("UpdateEvent").bind(function(){
        if (needUpdate || script.updateEachFrame) {
            sampleAndRun();
        }
        needUpdate = false;
      
    })
   
}

function getSamplePoints(){

    const THETA_RAD = THETA / 180. * Math.PI
    const PHI_RAD = PHI / 180. * Math.PI
    const TRANS_T = new Float32Array(
            [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, RADIUS,
            0, 0., 0., 1.]
    );

    const ROT_TH = new Float32Array(
            [Math.cos(THETA_RAD), 0, -Math.sin(THETA_RAD), 0,
            0, 1, 0, 0,
            Math.sin(THETA_RAD), 0, Math.cos(THETA_RAD), 0,
            0, 0, 0, 1.]
    );

    const ROT_PHI = new Float32Array(
            [1, 0, 0, 0,
            0, Math.cos(PHI_RAD), -Math.sin(PHI_RAD), 0,
            0, Math.sin(PHI_RAD), Math.cos(PHI_RAD), 0,
            0, 0, 0, 1]
    );

    var poses = new GetPoses(TRANS_T, ROT_PHI, ROT_TH, MAT_CONST)
    var pts = pointSampler.sample_test(poses);
    return pts
}



/* Get the camera poses and render the image */
function sampleAndRun(){
    var poses = getSamplePoints()
    c2w33.set(poses[0]);
    c2w13.set(poses[1]);
       
    script.mlSampler.runImmediate(true);
    embbRays.set(pts);
    script.mlSinCos.runImmediate(true);
    inputData.set(outRays);
    script.mlComponent.runScheduled(
            false,
            MachineLearning.FrameTiming.LateUpdate,
            MachineLearning.FrameTiming.LateUpdate
    )
    
}








