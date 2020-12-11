const assert = require('assert').strict;
const { readInput } = require('../common/utils');

const EMPTY = 'L';
const OCCUPIED = '#';
const SPACE = '.';

function parseSeats(filename) {
    return readInput(__dirname, filename).map(l => l.split(''));
}

function getSeat(seats, i, j) {
    return (seats[i] || [])[j];
}

function countIfOccupied(seat) {
    return seat === OCCUPIED ? 1 : 0;
}

function calculate(seats, checkSeat, threshold) {
    const h = seats.length;
    const w = seats[0].length;
    let curSeats = seats;
    changed = true;
    while (changed) {
        changed = false;
        const newSeats = [];
        for(let i = 0; i < h; i++) {
            newSeats[i] = [];
            for(let j = 0; j < w; j++) {
                if (curSeats[i][j] === SPACE) {
                    newSeats[i][j] = SPACE;
                } else {
                    const occupied = [[-1, -1], [-1, 0], [-1, 1],
                                      [ 0, -1],          [ 0, 1],
                                      [ 1, -1], [ 1, 0], [ 1, 1]]
                    .map(([dh, dw]) => checkSeat(curSeats, i, j, dh, dw))
                    .reduce((a,b) => a + b);
                    if (curSeats[i][j] === EMPTY && occupied === 0) {
                        newSeats[i][j] = OCCUPIED;
                        changed = true;
                    } else if (curSeats[i][j] === OCCUPIED && occupied >= threshold) {
                        newSeats[i][j] = EMPTY;
                        changed = true;
                    } else {
                        newSeats[i][j] = curSeats[i][j];
                    }
                }
            }
        }
        curSeats = newSeats;
    }
    return curSeats.reduce((cnt, row) => cnt + row.map(countIfOccupied).reduce((a,b) => a + b, 0), 0);
}

function part1(seats) {
    return calculate(seats, (curSeats, i, j, dh, dw) => countIfOccupied(getSeat(curSeats, i + dh, j + dw)), 4);
}

function part2(seats) {
    return calculate(seats, (curSeats, i, j, dh, dw) => {
        let n = 1;
        let seat;
        while ((seat = getSeat(curSeats, i + n * dh, j + n * dw)) === SPACE) {
            n++;
        }
        return countIfOccupied(seat);
    }, 5);
}

const testSeats = parseSeats('11-sample.txt');
assert.strictEqual(part1(testSeats), 37);
assert.strictEqual(part2(testSeats), 26);

const seats = parseSeats('11.txt');
console.log(part1(seats));
console.log(part2(seats));
