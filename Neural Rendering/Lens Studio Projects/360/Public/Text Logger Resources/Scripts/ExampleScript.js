// Disable logs appearing on screen
global.textLogger.setLoggingEnabled(true);

global.logToScreen("hello!") 
global.logToScreen("these are custom logs...")
global.logToScreen("just import the TextLogger object and call:")
global.logToScreen("global.logToScreen('text')");

// Change text color to red
global.textLogger.setTextColor(new vec4(0,1,0,1));

// Only one log entry will be shown at a time
global.textLogger.setLogLimit(1);
// Clear all existing log entries
//global.textLogger.clear();