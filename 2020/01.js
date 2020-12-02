const assert = require('assert').strict;
const utils = require('../common/utils');

const N = 2020;

function findTwo(entries) {
    const existing = new Set();
    for (const element of entries) {
        if (existing.has(N - element)) {
            return element * (N - element);
        }
        existing.add(element)
    };
}

function findThree(entries) {
    const l = entries.length;
    const couples = new Map();
    for (let i = 0; i < l; i++) {
        const current = entries[i];
        if (couples.has(N - current)) {
            return couples.get(N - current) * current;
        }
        for (let j = 0; j < i; j++) {
            couples.set(entries[j] + current, entries[j] * current);
        }
    };
}

let testEntries = utils.readNumberInput(__dirname, '01-sample.txt');
assert.strictEqual(findTwo(testEntries), 514579);
assert.strictEqual(findThree(testEntries), 241861950);

let entries = utils.readNumberInput(__dirname, '01.txt');
console.log(findTwo(entries));
console.log(findThree(entries));
