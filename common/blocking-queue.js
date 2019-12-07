class BlockingQueue {
    constructor(data = []) {
        this.data = data;
        this.waiting = [];
    }

    enqueue(val) {
        if (this.waiting.length > 0) {
            this.waiting.shift()(val);
        } else {
            this.data.push(val);
        }
    }

    async dequeue() {
        if (this.data.length > 0) {
            return this.data.shift();
        } else {
            return new Promise(resolve => {
                this.waiting.push(resolve);
            });
        }
    }
}

module.exports = BlockingQueue;
