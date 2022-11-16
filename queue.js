export class Queue {
    constructor() {
        this.queue = [];  
    };

    add(item) {
        console.log("ENTERING add() w/ parameter " + item);

        this.queue.push(item);
    }
}
  