const debugMode = false;

export function debug(message) {
    if(debugMode) {
        console.log(new Date().toISOString() + " - " + message);
    }
}