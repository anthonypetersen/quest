import { modals } from "./constants.js";
import { parseMarkdown } from "./parse.js";
import { startModule } from "./render.js";
import { store, updateTree, retrieve, setTree } from "./storage.js";
import { Questionnaire } from "./questionnaire.js";
import { Tree } from "./tree.js";


export const questions = new Questionnaire();
export const queue = new Tree();
export const moduleParams = {};

export async function generate(text, div, params) {

    moduleParams.element = div;
    moduleParams.store = params.store ? params.store : store;
    moduleParams.updateTree = params.updateTree ? params.updateTree : updateTree;
    moduleParams.previousResults = params.previousResults ? params.previousResults : {};
    moduleParams.retrieve = params.retrieve ? params.retrieve : retrieve; 

    document.getElementById(div).innerHTML = modals();

    await parseMarkdown(text);

    if (params.treeJSON) {
        queue.loadFromJSON(params.treeJSON);
    } 
    else {
        await setTree();
    }

    startModule();
}


window.questions = questions;
window.queue = queue;
window.moduleParams = moduleParams;