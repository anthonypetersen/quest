export class QuestionContainer {
    constructor() {
        this.container = [];  
        this.active = null;
    };

    first() {
        if(this.container[0]) {
            return this.container[0];
        }
    }

    next() {
        if(this.container[this.active + 1]) {
            return this.container[this.active + 1];
        }
    }

    previous() {
        if(this.container[this.active - 1]) {
            return this.container[this.active - 1];
        }
    }

    add(item) {
        this.container.push(item);
    }

    get() {
        return this.container;
    }

    find(item) {
        let test = this.container.filter(x => x.id === item);
        if(test) {
            return test[0];
        }
    }

    render(item, div) {

        this.active = this.container.indexOf(item);
        console.log(this.active);

        let element = document.createElement("form");
        element.classList.add("question");
        element.id = item.id;
        element.innerHTML = item.text + `<div>
        <div class="container">
          <div class="row">
            <div class="col-md-3 col-sm-12">
              ${item.previous}
            </div>
            <div class="col-md-6 col-sm-12">
              ${item.reset}
            </div>
            <div class=" col-md-3 col-sm-12">
              ${item.next}
            </div>
          </div>
        </div>
        </div><div class="spacePadding"></div>`;

        div.prepend(element);
        return element;
    }

    clear() {
        this.container = [];
    }
}
  