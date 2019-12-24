const assert = require('assert').strict;
const utils = require('../common/utils');

const SIZE = 5;
const MID = (SIZE - 1) / 2;

class Bugs {
    constructor(filename, recursive = false) {
        this.data = [parseInt(utils.readInput(__dirname, filename).join('').split('').map(c => c === '.' ? 0 : 1).reverse().join(''), 2)];
        this.recursive = recursive;
        this.minLevel = 0;
        this.maxLevel = 0;
    }

    isBug(row, col, level) {
        if (level < this.minLevel || level > this.maxLevel || row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
            return 0;
        } else {
            return (this.data[level] >> (row * SIZE + col)) & 1;
        }
    }

    getAdjacent(row, col, lvl) {
        let adjacent = [];
        if (this.recursive) {
            // up
            if (row === 0) {
                adjacent.push([MID - 1, MID, lvl - 1]);
            } else if (row === MID + 1 && col === MID) {
                for (let i = 0; i < SIZE; i++) {
                    adjacent.push([SIZE - 1, i, lvl + 1]);
                }
            } else {
                adjacent.push([row - 1, col, lvl]);
            }
            // left
            if (col === 0) {
                adjacent.push([MID, MID - 1, lvl - 1])
            } else if (row === MID && col === MID + 1) {
                for (let i = 0; i < SIZE; i++) {
                    adjacent.push([i, SIZE - 1, lvl + 1]);
                }
            } else {
                adjacent.push([row, col - 1, lvl]);
            }
            // right
            if (col === SIZE - 1) {
                adjacent.push([MID, MID + 1, lvl - 1])
            } else if (row === MID && col === MID - 1) {
                for (let i = 0; i < SIZE; i++) {
                    adjacent.push([i, 0, lvl + 1]);
                }
            } else {
                adjacent.push([row, col + 1, lvl]);
            }
            // down
            if (row === SIZE - 1) {
                adjacent.push([MID + 1, MID, lvl - 1])
            } else if (row === MID - 1 && col === MID) {
                for (let i = 0; i < SIZE; i++) {
                    adjacent.push([0, i, lvl + 1]);
                }
            } else {
                adjacent.push([row + 1, col, lvl]);
            }
        } else {
            adjacent.push([row - 1, col, lvl], [row, col - 1, lvl], [row, col + 1, lvl], [row + 1, col, lvl]);
        }
        return adjacent.map(([row, col, level]) => this.isBug(row, col, level)).reduce((a, b) => a + b, 0);
    }

    step() {
        const newData = []
        let newMinLevel = this.recursive ? this.minLevel - 1 : this.minLevel;
        let newMaxLevel = this.recursive ? this.maxLevel + 1 : this.maxLevel;
        for (let l = newMinLevel; l <= newMaxLevel + 1; l++) {
            let newLevel = 0;
            for (let row = SIZE - 1; row >= 0; row--) {
                for (let col = SIZE - 1; col >= 0; col--) {
                    newLevel = newLevel << 1;
                    if (this.recursive && row === MID && col === MID) {
                        continue;
                    }
                    const adjacent = this.getAdjacent(row, col, l);
                    if (this.isBug(row, col, l)) {
                        newLevel += (adjacent === 1 ? 1 : 0);
                    } else {
                        newLevel += (adjacent === 1 || adjacent === 2) ? 1 : 0;
                    }
                }
            }
            newData[l] = newLevel;
        }
        // trim empty levels from the sides
        while (newMinLevel < 0 && newData[newMinLevel] === 0) {
            newMinLevel++;
        }
        while (newMaxLevel > 0 && newData[newMaxLevel] === 0) {
            newMaxLevel--;
        }
        this.data = [];
        for (let l = newMinLevel; l <= newMaxLevel; l++) {
            this.data[l] = newData[l];
        }
        this.minLevel = newMinLevel;
        this.maxLevel = newMaxLevel;
    }

    count() {
        let result = 0;
        for (let l = this.minLevel; l <= this.maxLevel; l++) {
            let level = this.data[l];
            while (level > 0) {
                result++;
                level = level & (level - 1);
            }
        }
        return result;
    }

    print() {
        for (let l = this.minLevel; l <= this.maxLevel; l++) {
            console.log(`Level: ${l}`);
            for (let row = 0; row < SIZE; row++) {
                for (let col = 0; col < SIZE; col++) {
                    process.stdout.write(this.isBug(row, col, l) ? '#' : '.');
                }
                process.stdout.write('\n');
            }
        }
    }
}

function getFirstRepeatingBioRating(filename) {
    const cache = new Set();
    const bugs = new Bugs(filename);
    while (!cache.has(bugs.data[0])) {
        cache.add(bugs.data[0]);
        bugs.step();
    }
    return bugs.data[0];
}

assert.strictEqual(getFirstRepeatingBioRating('24-sample1.txt'), 2129920);
console.log(getFirstRepeatingBioRating('24.txt'));

const testBugs = new Bugs('24-sample1.txt', true);
for (let i = 0; i < 10; i++) {
    testBugs.step();
}
assert.strictEqual(testBugs.count(), 99);

const bugs = new Bugs('24.txt', true);
for (let i = 0; i < 200; i++) {
    bugs.step();
}
console.log(bugs.count());
