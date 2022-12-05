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

    getNext(previousQuestion) {
        let index = this.stack.indexOf(previousQuestion);
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

    }

    restoreAnswer(answer) {
        this.answer = answer;
    }

    setAnswer() {

    }
}