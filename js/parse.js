import { moduleParams } from "./quest.js";
import { initialize } from "./storage.js";
import regex from "./regex.js";

export async function parseMarkdown(text) {

    console.log("Parsing markdown...");
    extractModuleName(text);
    
    await initialize();

    let postLoop = [];
    let postGrid = [];
    let postQuestion = [];

    text = text.replace(/[\r\n]/gm, '')

    postLoop = text.split(regex.loop);

    postLoop.forEach(index => {
        let temp = index.split(regex.grid);

        temp.forEach(tempIndex => {
            postGrid.push(tempIndex);
        });
    });

    postGrid.forEach(index => {
        if(index.startsWith("<loop") || index.startsWith("|grid")) {
            postQuestion.push(index);
        }
        else {
            let temp = index.split(regex.question);

            temp.forEach(tempIndex => {
                if(tempIndex) postQuestion.push(tempIndex);
            });
        }
    });

    console.log();

}

function extractModuleName(text) {

    let match = text.match(regex.moduleName);
    moduleParams.name = match ? match[1] : "Module";

    console.log("Setting module name: " + moduleParams.name);
}