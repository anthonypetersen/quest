import { rbAndCbClick, textBoxInput, handleXOR, parseSSN, parsePhoneNumber, moduleParams, nextClick, previousClicked } from "./questionnaire.js";
import { toggle_grid } from "./buildGrid.js";
import { clearValidationError } from "./validate.js";

export class Survey {
    constructor() {
        this.survey = [];  
        this.active = null;
    };

    first() {
        if(this.survey[0]) {
            return this.survey[0];
        }
    }

    next() {
        if(this.survey[this.active + 1]) {
            return this.survey[this.active + 1];
        }
    }

    previous() {
        if(this.survey[this.active - 1]) {
            return this.survey[this.active - 1];
        }
    }

    add(question) {
        this.survey.push(new Question(question));
    }

    get() {
        return this.survey;
    }

    setAnswer(question, answer) {
        question.setAnswer(answer);
    }

    find(item) {
        let found = this.survey.filter(x => x.id === item);
        if(found) {
            return found[0];
        }
        else{
            found = this.survey.filter(x => x.id === item + "!")
            if(found) {
                return found[0];
            }
        }
    }

    render(item) {

        this.active = this.survey.indexOf(item);
        console.log(this.active);

        let div = document.getElementById("active-question");
        div.innerHTML = item.render(item.id + item.suffix, item.options, item.args, item.text);
        
        if(item.getAnswer()) {
            if(item.type === "text") {
                div.firstChild.querySelector("input,textarea,select").value = item.getAnswer();
            }
        }

        this.prepare(item, div.firstChild);




        return div.firstChild;
    }

    prepare(item, element) {
        element.onsubmit = stopSubmit;
        
        element
            .querySelectorAll("input[type='submit']")
            .forEach((submitButton) => {
                submitButton.addEventListener("click", (event) => {
                event.target.form.clickType = event.target.value;
            });
        });

        if(this.isFirst(item)) {
            let buttonToRemove = element.querySelector(".previous");
            if (buttonToRemove) {
                buttonToRemove.remove();
            }
        }

        if(this.isLast(item)) {
            let buttonToRemove = element.querySelector(".next");
            if (buttonToRemove) {
            buttonToRemove.remove();
            }
        }

        element.querySelectorAll("input[type='text'],input[type='number'],input[type='email'],input[type='tel'],input[type='date'],input[type='month'],input[type='time'],textarea,select")
            .forEach((inputElement) => {
                inputElement.onblur = textBoxInput;
                inputElement.setAttribute("style", "size: 20 !important");
        });

        element.querySelectorAll("input[type='radio'],input[type='checkbox'] ")
            .forEach((rcElement) => {
                rcElement.onchange = rbAndCbClick;
        });

        element.querySelectorAll("input").forEach((inputElement) => {
            inputElement.addEventListener("keydown", (event) => {
                if (event.keyCode == 13) {
                    event.preventDefault();
                }
            });
        });

        //document?
        Array.from(document.querySelectorAll("[xor]")).forEach(xorElement => {
            xorElement.addEventListener("keydown", () => handleXOR(xorElement));
        })

        element.querySelectorAll(".SSN").forEach((inputElement) => {
            inputElement.addEventListener("keyup", parseSSN);

        });

        element.querySelectorAll("input[type='tel']").forEach((inputElement) => {
            inputElement.addEventListener("keyup", parsePhoneNumber)
        });

        element.querySelectorAll(".grid-input-element").forEach((x) => {
            x.addEventListener("change", toggle_grid);
        });

        element.querySelectorAll("[data-hidden]").forEach((x) => {
            x.style.display = "none";
        });

        $(".popover-dismiss").popover({
            trigger: "focus",
        });
    }

    isFirst(item) {
        return this.survey[0] === item;
    }

    isLast(item) {
        return this.survey[this.survey.length - 1] === item;
    }

    clear() {
        this.survey = [];
    }
}
  

class Question {
    constructor(item) {
        this.id =       item.id;
        this.options =  item.options;
        this.args =     item.args;
        this.text =     item.text;
        this.render =   item.render;
        this.suffix =   "";
        this.answer =   null;
        this.type =     item.type;

        if(item.id.endsWith("?") || item.id.endsWith("!")) {
            this.suffix = this.id.slice(-1);
            this.id = this.id.slice(0, -1);
        }
    };

    setAnswer(answer) {
        this.answer = answer;
    }

    getAnswer() {
        return this.answer;
    }

    clearAnswer() {
        if(this.type === "text") {
            this.answer = ""
        }
        //else
    }
}

function stopSubmit(event) {
    event.preventDefault();
  
    if (event.target.clickType == "BACK") {
        resetChildren(event.target.elements);
        event.target.value = undefined;
        let buttonClicked = event.target.getElementsByClassName("previous")[0];
        previousClicked(buttonClicked, moduleParams.renderObj.retrieve, moduleParams.renderObj.store);
    } 
    else if (event.target.clickType == "RESET ANSWER") {
        resetChildren(event.target.elements);
        event.target.value = undefined;
    } 
    else if (event.target.clickType == "Submit Survey") {
  
        $("#submitModal").modal("toggle");
  
    } 
    else {
        let buttonClicked = event.target.getElementsByClassName("next")[0];
        nextClick(buttonClicked, moduleParams.renderObj.retrieve, moduleParams.renderObj.store);
    }
}

function resetChildren(nodes) {
    if (nodes == null) {
        return;
    }
  
    for (let node of nodes) {
        if (node.type === "radio" || node.type === "checkbox") {
            node.checked = false;
        } 
        else if (node.type === "text" || node.type === "time" || node.type === "date" || node.type === "month" || node.type === "number") {
            node.value = "";
            clearValidationError(node);
        }
    }
}