const assert = require('assert').strict;
const { readNumberInput } = require('../common/utils');

function getAdapters(filename) {
    return readNumberInput(__dirname, filename).sort((a, b) => a - b);
}

function part1(adapters) {
    const diff = new Map();
    for (let i = 0; i < adapters.length; i++) {
        const d = adapters[i] - (adapters[i - 1] || 0);
        diff.set(d, (diff.get(d) || 0) + 1);
    }
    return (diff.get(1) || 0) * (1 + (diff.get(3) || 0));
}

function part2(adapters) {
    const paths = new Map(); // number of paths indexed by joltage
    paths.set(0, 1); // there's 1 path to joltage 0, i.e. outlet itself
    adapters.forEach(joltage => {
        let pathsToCurrent = 0;
        for (let i = 1; i <= 3; i++) {
            pathsToCurrent += paths.get(joltage - i) || 0;
        }
        paths.set(joltage, pathsToCurrent);
    });
    return paths.get(adapters[adapters.length - 1]);
}

const testAdapters = getAdapters('10-sample1.txt');
assert.strictEqual(part1(testAdapters), 35);
assert.strictEqual(part2(testAdapters), 8);

const testAdapters2 = getAdapters('10-sample2.txt');
assert.strictEqual(part1(testAdapters2), 220);
assert.strictEqual(part2(testAdapters2), 19208);

const adapters = getAdapters('10.txt');
console.log(part1(adapters));
console.log(part2(adapters));
