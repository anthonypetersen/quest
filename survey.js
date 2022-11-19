import { stopSubmit } from "./render.js";
import { rbAndCbClick } from "./questionnaire.js";

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
            buttonToRemove = element.querySelector(".next");
            if (buttonToRemove) {
            buttonToRemove.remove();
            }
        }

        let rbCb = [
            ...element.querySelectorAll(
            "input[type='radio'],input[type='checkbox'] "
            ),
        ];
        rbCb.forEach((rcElement) => {
            rcElement.onchange = rbAndCbClick;
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

        if(item.id.endsWith("?") || item.id.endsWith("!")) {
            this.suffix = this.id.slice(-1);
            this.id = this.id.slice(0, -1);
        }
    };
}