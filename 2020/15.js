const assert = require('assert').strict;

const INPUT = [12, 1, 16, 3, 11, 0];

function findNth(prefix, n) {
    const previous = new Map();
    prefix.forEach((element, index) => {
        previous.set(element, index + 1);
    });
    let turn = prefix.length;
    let next = 0; // assuming the numbers don't repeat in the prefix
    while (turn < n - 1) {
        turn++;
        const cur = next;
        next = previous.has(cur) ? turn - previous.get(cur) : 0;
        previous.set(cur, turn);
    }
    return next;
}

assert.strictEqual(findNth([0, 3, 6], 10), 0);
assert.strictEqual(findNth([1, 3, 2], 2020), 1);
assert.strictEqual(findNth([2, 1, 3], 2020), 10);
assert.strictEqual(findNth([1, 2, 3], 2020), 27);
assert.strictEqual(findNth([2, 3, 1], 2020), 78);
assert.strictEqual(findNth([3, 2, 1], 2020), 438);
assert.strictEqual(findNth([3, 1, 2], 2020), 1836);

console.log(findNth(INPUT, 2020));
console.log(findNth(INPUT, 30000000));
