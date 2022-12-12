import { moduleParams, questions } from "./quest.js";
import { initialize } from "./storage.js";
import regex from "./regex.js";

export async function parseMarkdown(text) {

    console.log("Parsing markdown...");
    extractModuleName(text);
    
    await initialize();

    text = prepareMarkdown(text);

    let markdownSplit = splitQuestions(text);

    markdownSplit.forEach(question => {
        
        let results;

        //if grid
        //else if loop
        //else
        results = validateQuestion(question);
        if(results) {
            questions.add(results);
        }
        else {
            // throw error
        }
    });
}

function extractModuleName(text) {

    let match = text.match(regex.moduleName);
    moduleParams.name = match ? match[1] : "Module";

    console.log("Setting module name: " + moduleParams.name);
}

function splitQuestions(text) {
    
    let postLoop = [];
    let postGrid = [];
    let postQuestion = [];

    postLoop = text.split(regex.loopGeneric);

    postLoop.forEach(index => {
        let temp = index.split(regex.gridGeneric);

        temp.forEach(tempIndex => {
            postGrid.push(tempIndex);
        });
    });

    postGrid.forEach(index => {
        if(index.startsWith("<loop") || index.startsWith("|grid")) {
            postQuestion.push(index);
        }
        else {
            let temp = index.split(regex.questionGeneric);

            temp.forEach(tempIndex => {
                if(tempIndex) postQuestion.push(tempIndex);
            });
        }
    });

    return postQuestion;
}

function prepareMarkdown(text) {
    text = text.replace(/[\r\n]/gm, '');

    return text;
}

function validateQuestion(text) {

    let match = text.match(regex.questionSpecific);

    if(match) {
        let params = {};

        params.id = match[1];

        if(match[2]) {
            params.edit = match[2] == "!" ? "hard" : "soft";
        }

        params.args = match[3];
        params.text = match[4];
        params.type = "question";

        return params;
    }

    return false;
}

function validateLoop(text) {
    
}

function validateGrid(text) {

}