export class Questionnaire {
    
    constructor() {
        this.stack = [];
    };

    add(params) {
        this.stack.push(new Question(params));
    }

    find(id) {
        let found = this.stack.filter(q => q.params.id === id);
        if(found) {
            return found[0];
        }
    }

    first() {
        return this.stack[0];
    }

    next(question) {
        let index = this.stack.indexOf(question);
        return this.stack[index + 1];
    }

    last() {
        return this.stack[this.stack.length - 1];
    }
}
  

class Question {
    
    constructor(params) {
        this.params = params;
        this.answer = [];
    };

    clearAnswer() {
        this.answer = [];
    }

    getAnswer() {
        if(this.answer.length > 0) {

            let element = document.getElementById("active-question");
            let inputs = element.querySelectorAll("input[type=radio], input[type=checkbox], input[type=text]");

            inputs.forEach(input => {
                if(input.type === "radio" || input.type === "checkbox") {
                    input.checked = this.answer.shift()["value"];
                }
                else {
                    input.value = this.answer.shift()["value"];
                }
            });
        }
    }

    restoreAnswer(answer) {
        this.answer = answer;
    }

    setAnswer() {
        let element = document.getElementById("active-question");
        let inputs = element.querySelectorAll("input[type=radio], input[type=checkbox], input[type=text]");

        inputs.forEach(input => {

            let elementInfo = {};

            elementInfo["id"] = input.id;
            elementInfo["type"] = input.type;

            if(input.type === "radio" || input.type === "checkbox") {
                elementInfo["value"] = input.checked;
            }
            else {
                elementInfo["value"] = input.value;
            }

            this.answer.push(elementInfo);
        });
    }
}