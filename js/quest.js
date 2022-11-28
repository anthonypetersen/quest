import { modals } from "./constants.js";
import { parseMarkdown } from "./parse.js";
import { startModule } from "./render.js";
import { store, restore, updateTree } from "./storage.js";
import { Questionnaire } from "./questionnaire.js";
import { Tree } from "./tree.js";


export const questions = new Questionnaire();
export const queue = new Tree();
export const moduleParams = {};

export async function generate(text, div, params) {

    console.log("Starting Quest...");

    moduleParams.store = params.store ? params.store : store;
    moduleParams.updateTree = params.updateTree ? params.updateTree : updateTree;
    moduleParams.previousResults = params.previousResults ? params.previousResults : {};

    await parseMarkdown(text);


    // would we want to retrieve and tree before or after parsing?
    
    if(params.retrieve) {

        // define outside retrieve() rules
    }
    else {
        let results = await localforage.getItem(moduleParams.name);
        if(results) await restore(results);
    }


    if (params.treeJSON) {
        queue.loadFromJSON(params.treeJSON);
    } 
    else {
        await localforage.getItem(moduleParams.name + ".treeJSON").then((tree) => {
            if (tree) {
                queue.loadFromVanillaObject(tree);
            } 
            else {
                queue.clear();
            }
        });
    }


    document.getElementById(div).innerHTML = modals();

    startModule();
}


window.questions = questions;
window.queue = queue;
window.moduleParams = moduleParams;