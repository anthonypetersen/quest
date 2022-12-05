import { moduleParams, queue } from "./quest.js";

export let localResults = {};
export let localTree = {};

export async function initialize() {
    
    localResults = localforage.createInstance({
        'name': "QuestResults",
        'storeName': moduleParams.name
    });
    
    localTree = localforage.createInstance({
        'name': "QuestTree",
        'storeName': moduleParams.name + "_tree"
    });
}

export async function store(question, action) {
    //let responses = await localforage.getItem(questName);

	if(action === "save") {

		if(!responses) {
			responses = {};
		}

		if(question.answer.length > 0) {
			responses[question.id] = question.answer;
			localforage.setItem(questName, responses);
		}
	}
	else if(action === "remove") {
		let responses = await localforage.getItem(questName);

		if(responses && responses[question.id]) {
			delete responses[question.id];
			localforage.setItem(questName, responses);
		}
	}
	else {
		console.log("COMPLETE SURVEY STORE");
	}
}

export function restore(results) {
    
    Object.keys(results).forEach((qid) => {
		let question = survey.find(qid);
		question.restoreAnswer(results[qid]);
	});
}

export async function updateTree() {
	await localforage.setItem(moduleParams.questName + ".treeJSON", questionQueue.toVanillaObject());
    // await localTree.set(queue.toVanillaObject);
}