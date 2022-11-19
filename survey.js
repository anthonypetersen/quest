import { stopSubmit } from "./render.js";

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
        this.survey.push(new Question(question, this.previousResults));
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

        let div = document.getElementById("question-holder");
        div.innerHTML = item.display();
        item.prepare(div.firstChild);
        return div.firstChild;
    }

    clear() {
        this.survey = [];
    }
}
  

class Question {
    constructor(item, previousResults) {
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

    display() {
        return this.render(this.id + this.suffix, this.options, this.args, this.text, this.previousResults);
    }

    prepare(element) {
        
        element.onsubmit = stopSubmit;
        
        element
            .querySelectorAll("input[type='submit']")
            .forEach((submitButton) => {
                submitButton.addEventListener("click", (event) => {
                event.target.form.clickType = event.target.value;
            });
        });

    }
}