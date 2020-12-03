const assert = require('assert').strict;
const utils = require('../common/utils');

const TREE = '#';

function countTrees(forest, right, down) {
    const l = forest.length;
    let curRow = 0;
    let curCol = 0;
    let count = 0;
    while (curRow < l) {
        const line = forest[curRow];
        if (line.charAt(curCol) === TREE) {
            count++;
        }
        curRow += down;
        curCol = (curCol + right) % line.length;
    }
    return count;
}

function part1(forest) {
    return countTrees(forest, 3, 1);
}

function part2(forest) {
    return [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]]
        .map(([right, down]) => countTrees(forest, right, down))
        .reduce((a, b) => a * b, 1);
}

let testForest = utils.readInput(__dirname, '03-sample.txt');
assert.strictEqual(part1(testForest), 7);
assert.strictEqual(part2(testForest), 336);

let forest = utils.readInput(__dirname, '03.txt');
console.log(part1(forest));
console.log(part2(forest));
