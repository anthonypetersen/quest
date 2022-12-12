import { moduleParams, queue, questions } from "./quest.js";

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
    let responses = await localResults.getItem(localResults.config().storeName);

	if(action === "save") {

		if(!responses) {
			responses = {};
		}

		if(question.answer.length > 0) {
			responses[question.params.id] = question.answer;
			localResults.setItem(localResults.config().storeName, responses);
		}
	}
	else if(action === "remove") {

		if(responses && responses[question.params.id]) {
			delete responses[question.params.id];
			localResults.setItem(localResults.config().storeName, responses);
		}
	}
	else {
		console.log("COMPLETE SURVEY STORE");
	}
}

export function restore(results) {
    
    Object.keys(results).forEach((qid) => {
		let question = questions.find(qid);
		question.restoreAnswer(results[qid]);
	});
}

export async function retrieve() {
	let results = await localResults.getItem(localResults.config().storeName);
    if(results) await restore(results);
}

export async function setTree() {
	await localTree.getItem(localTree.config().storeName).then((tree) => {
		if (tree) {
			queue.loadFromVanillaObject(tree);
		} 
		else {
			queue.clear();
		}
	});
}

export async function updateTree() {
	await localTree.setItem(localTree.config().storeName, queue.toVanillaObject());
}