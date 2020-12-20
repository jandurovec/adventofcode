const utils = require('./utils');

class Grid {
    constructor() {
        this.data = new Map();
    }

    delete(x, y) {
        this.data.delete(utils.pos(x, y));
    }

    has(x, y) {
        return this.data.has(utils.pos(x, y));
    }

    get(x, y) {
        const entry = this.data.get(utils.pos(x, y));
        return entry === undefined ? undefined : entry.value;
    }

    set(x, y, value) {
        this.data.set(utils.pos(x, y), { x, y, value });
        if (this.minX === undefined || x < this.minX) {
            this.minX = x;
        }
        if (this.maxX === undefined || x > this.maxX) {
            this.maxX = x;
        }
        if (this.minY === undefined || y < this.minY) {
            this.minY = y;
        }
        if (this.maxY === undefined || y > this.maxY) {
            this.maxY = y;
        }
    }

    get entries() {
        return [...this.data.values()];
    }

    print(valToString = val => val) {
        console.log(`Grid (${this.minX},${this.minY}) -> (${this.maxX},${this.maxY})`);
        for (let y = this.minY; y <= this.maxY; y++) {
            let row = [];
            for (let x = this.minX; x <= this.maxX; x++) {
                row.push(valToString(this.get(x, y)));
            }
            console.log(row.join(''));
        }
    }
}

module.exports = Grid;
