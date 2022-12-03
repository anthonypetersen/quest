export default {

    moduleName:                 /\"?name\"?\s*:[\s\"]*(\w+)[\s"]*[,}]/,
    loopGeneric:                /(<loop[\s\S]*?<\/loop>)/g,
    gridGeneric:                /(\|grid\|[\s\S]*?\|[\s\S]*?\|[\s\S]*?\|[\s\S]*?\|)/g,
    questionGeneric:            /(\[[A-Z]+[A-Z0-9_]*\](?:(?!\[[A-Z])[\s\S])*)/g,
    questionSpecific:           /\[([A-Z_]\w*)([?!])?\s*(?:[|,]\s*([^\]]+?))?\]([\s\S]*)/
}