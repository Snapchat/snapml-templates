// ScreenLogger.js
// Version: 2.0.0
// Event: Awake
// Description: Prints the given message on the screen.

// ----- USAGE -----
// To log text to the screen, use: 
// 	global.logToScreen(text);
// or:
// 	global.textLogger.addLog(text);
//
// To clear the text log, use:
// 	global.textLogger.clear();
//
// To change the log limit, use:
// 	global.textLogger.setLogLimit(limit);
//
// To change the text color, use:
// 	global.textLogger.setTextColor(colorRGBA);
//
// To enable or disable logging, use:
// 	global.textLogger.setLoggingEnabled(limit);
// -----------------

//@input bool loggingEnabled = true
//@input int logLimit = 20
//@input Component.Text textComponent 

var textComponent = script.textComponent || script.getSceneObject().getComponent("Component.Text");

if (!textComponent) {
    print("Warning! Please set text component on " + script.getSceneObject().name);
}

var stringLength = 36;
var logger = null;
var queue = [];

global.logToScreen = function (message, printLog) {
    if (!script.loggingEnabled) {
        return;
    }

    if (queue.length >= script.logLimit) {
        queue.shift();
    }

    queue.push(message.toString());

    var combText = "> " + queue.join("\n> ");
    var croppedMessage = combText.substring(message.length - stringLength * script.logLimit);
    if (textComponent) {
        textComponent.text = croppedMessage;
    }

    if (!printLog) {
        print(message);
    }
};

global.textLogger = {
    setLoggingEnabled: function (state) {
        script.loggingEnabled = state;
    },

    setTextColor: function (color) {
        if (textComponent) {
            textComponent.textFill.color = color;
        }
    },

    setLogLimit: function (limit) {
        script.logLimit = limit;
    },

    clear: function () {
        if (textComponent) {
            textComponent.text = "";
        }
        queue = [];
    }
};
