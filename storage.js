import { textboxinput, radioAndCheckboxUpdate, survey } from "./questionnaire.js";

export async function restore(results) {

	Object.keys(results).forEach((qid) => {
		let question = survey.find(qid);
		question.restoreAnswer(results[qid]);
	});
}

export async function store(questName, question, action) {
	
	let responses = await localforage.getItem(questName);

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