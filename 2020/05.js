const assert = require('assert').strict;
const utils = require('../common/utils');

function getSeatId(boardingPass) {
    return parseInt(boardingPass.replaceAll(/[FL]/g, '0').replaceAll(/[BR]/g, '1'), 2);
}

function part1(boardingPasses) {
    return boardingPasses.map(b => getSeatId(b)).reduce((a, b) => Math.max(a, b));
}

function part2(boardingPasses) {
    const seats = new Set();
    let min = Infinity;
    let max = -Infinity;
    boardingPasses.map(pass => getSeatId(pass)).forEach(seatId => {
        if (seatId < min) {
            min = seatId;
        }
        if (seatId > max) {
            max = seatId;
        }
        seats.add(seatId);
    })

    for (let i = min + 1; i <= max - 1; i++) {
        if (!seats.has(i) && seats.has(i - 1) && seats.has(i + 1)) {
            return i;
        }
    }
}

assert.strictEqual(getSeatId('FBFBBFFRLR'), 357);
assert.strictEqual(getSeatId('BFFFBBFRRR'), 567);
assert.strictEqual(getSeatId('FFFBBBFRRR'), 119);
assert.strictEqual(getSeatId('BBFFBBFRLL'), 820);
assert.strictEqual(part1(['FBFBBFFRLR', 'BFFFBBFRRR', 'FFFBBBFRRR']), 567);

let boardingPasses = utils.readInput(__dirname, '05.txt');
console.log(part1(boardingPasses));
console.log(part2(boardingPasses));
