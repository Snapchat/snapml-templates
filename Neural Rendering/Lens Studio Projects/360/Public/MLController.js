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

var inputData;
var PointSampler = function () { }
PointSampler.prototype.sample_test = function (c2w) {
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
    var c2w_t = new Float32Array(4 * 4);
    matMul(ROT_PHI, TRANS_T, c2w_t, 4, 4, 4);
    matMul(ROT_TH, c2w_t, TRANS_T, 4, 4, 4);
    matMul(MAT_CONST, TRANS_T, c2w_t, 4, 4, 4);

    var poses = new Float32Array(c2w_t.buffer, 0, 12);
    return poses;

}

//helper functions
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
    inputData = script.mlComponent.getInput("input").data;
    if (modelBuilt == 2) {
        initalize();
    } else {
        modelBuilt++;
    }
}

function onHelperModelLoadingFinished() {
    embbRays = script.mlSinCos.getInput("rays").data;
    outRays = script.mlSinCos.getOutput("embbrays").data;
    if (modelBuilt == 2) {
        initalize();
    } else {
        modelBuilt++;
    }
}

function onSamplerLoadingFinished() {
    c2w33 = script.mlSampler.getInput("c2w33").data;
    c2w13 = script.mlSampler.getInput("c2w13").data;
    pts = script.mlSampler.getOutput("pts").data;

    if (modelBuilt == 2) {
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
function initalize() {
    sampleAndRun();
    var touchStartEvent = script.createEvent("TouchStartEvent");
    touchStartEvent.bind(function () {
        startPos = touchStartEvent.getTouchPosition();
        originTheta = THETA;
        originPhi = PHI;
        needUpdate = true;
    });

    var touchMoveEvent = script.createEvent("TouchMoveEvent");
    touchMoveEvent.bind(function () {
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
        needUpdate = true;
    });

    script.createEvent("UpdateEvent").bind(function () {
        if (needUpdate || script.updateEachFrame) {
            sampleAndRun();
        }
        needUpdate = false;

    })

}

function getSamplePoints() {

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
function sampleAndRun() {
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