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

    moduleParams.element = div;
    moduleParams.store = params.store ? params.store : store;
    moduleParams.updateTree = params.updateTree ? params.updateTree : updateTree;
    moduleParams.previousResults = params.previousResults ? params.previousResults : {};

    document.getElementById(div).innerHTML = modals();

    await parseMarkdown(text);

    
    if(params.retrieve) {
        // define outside retrieve() rules
    }
    else {
        //should this go in storage?
        let results = await localforage.getItem(moduleParams.name);
        if(results) await restore(results);
    }


    if (params.treeJSON) {
        queue.loadFromJSON(params.treeJSON);
    } 
    else {
        // should this go in storage?
        await localforage.getItem(moduleParams.name + ".treeJSON").then((tree) => {
            if (tree) {
                queue.loadFromVanillaObject(tree);
            } 
            else {
                queue.clear();
            }
        });
    }

    startModule();
}


window.questions = questions;
window.queue = queue;
window.moduleParams = moduleParams;