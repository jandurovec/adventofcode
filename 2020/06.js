const assert = require('assert').strict;
const utils = require('../common/utils');

const GROUP_SEPARATOR = /\r?\n\r?\n/;
const SEPARATOR = /\r?\n/;

function sumGroups(groups, f) {
    return groups.map(f).reduce((a, b) => a + b);
}

function part1(groups) {
    return sumGroups(groups, g => {
        const answers = new Set();
        g.split(SEPARATOR).forEach(x => {
            for (let i = 0; i < x.length; i++) {
                answers.add(x.charAt(i));
            }
        });
        return answers.size;
    });
}

function part2(groups) {
    return sumGroups(groups, g => {
        const answers = new Map();
        const forms = g.split(SEPARATOR);
        const groupSize = forms.length;
        forms.forEach(x => {
            for (let i = 0; i < x.length; i++) {
                const c = x.charAt(i);
                answers.set(c, answers.has(c) ? answers.get(c) + 1 : 1);
            }
        });
        let result = 0;
        for (v of answers.values()) {
            if (v === groupSize) {
                result++;
            }
        }
        return result;
    });
}

const testGroups = utils.readInput(__dirname, '06-sample.txt', GROUP_SEPARATOR);
assert.strictEqual(part1(testGroups), 11);
assert.strictEqual(part2(testGroups), 6);

const groups = utils.readInput(__dirname, '06.txt', GROUP_SEPARATOR);
console.log(part1(groups));
console.log(part2(groups));
