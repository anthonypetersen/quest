import { moduleParams } from "./quest.js";
import { initialize } from "./storage.js";
import regex from "./regex.js";

export async function parseMarkdown(text) {

    console.log("Parsing markdown...");
    extractModuleName(text);
    
    await initialize();

    let questionRegex = /(\[[A-Z_]|\|grid\||<(?:\/)?loop)/g;
    let questions = text.split(questionRegex);
    console.log();

}

function extractModuleName(text) {

    let match = text.match(regex.moduleName);
    moduleParams.name = match ? match[1] : "Module";

    console.log("Setting module name: " + moduleParams.name);
}