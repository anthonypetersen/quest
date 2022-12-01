export default {

    moduleName:     /\"?name\"?\s*:[\s\"]*(\w+)[\s"]*[,}]/,
    loop:           /(<loop[\s\S]*?<\/loop>)/g,
    grid:           /(\|grid\|[\s\S]*?\|[\s\S]*?\|[\s\S]*?\|[\s\S]*?\|)/g,
    question:       /(\[[A-Z]+[A-Z0-9_]*\](?:(?!\[[A-Z])[\s\S])*)/g
}