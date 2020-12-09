const assert = require('assert').strict;
const { readNumberInput } = require('../common/utils');

function findTwo(a, from, to, sum) {
    const previous = new Set();
    for (let i = from; i < to; i++) {
        const current = a[i];
        if (previous.has(sum - current)) {
            return true;
        }
        previous.add(current);
    };
    return false;
}

function part1(numbers, preambleLength) {
    for (let i = preambleLength; i < numbers.length; i++) {
        if (!findTwo(numbers, i - preambleLength, i, numbers[i])) {
            return numbers[i];
        }
    }
}

function part2(numbers, sum) {
    /**
     * this doesn't work when sum === 0 or negative numbers are in the list,
     * but our inputs are nice enough
     */
    let from = 0;
    let to = -1;
    let s = 0;
    for (let i = 0; i < numbers.length; i++) {
        to = i;
        s += numbers[i];
        while (s > sum) {
            s -= numbers[from++];
        }
        if (s === sum) {
            let min = numbers[from];
            let max = numbers[from];
            for (let j = from + 1; j <= to; j++) {
                if (numbers[j] < min) {
                    min = numbers[j];
                }
                if (numbers[j] > max) {
                    max = numbers[j];
                }
            }
            return min + max;
        }
    }
}

const testInput = readNumberInput(__dirname, '09-sample.txt');
assert.strictEqual(part1(testInput, 5), 127);
assert.strictEqual(part2(testInput, 127), 62);

const input = readNumberInput(__dirname, '09.txt');
const p1result = part1(input, 25);
console.log(p1result);
console.log(part2(input, p1result));
