const fs = require('fs');
const path = require('path');

const NEWLINE_REGEX = /\r?\n/;

/**
 * @param {number} a
 * @param {number} b
 * @returns {number} greatest common divisor of a and b
 */
function gcd(a, b) {
    if (b == 0) {
        return a;
    } else {
        return gcd(b, a % b);
    }
}

/**
 * @param {...number} numbers
 * @returns {number} least common multiple of numbers
 */
function lcm(...numbers) {
     return numbers.reduce((res, val, i) => val * res / gcd(val, res), 1);
}

/**
 * Parses string position representation
 * @param {string} pos positon representation
 */
function parsePos(pos) {
    const split = pos.split(',').map(n => parseInt(n));
    return {x: split[0], y: split[1] }
}

/**
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 * @returns {string} position representation
 */
function pos(x, y) {
    return x + ',' + y;
}

/**
 * @param {number|BigInt} a
 * @param {number|BigInt} b
 * @param {number|BigInt} n
 * @returns {number|BigInt} a ^ b mod m
 */
function powMod(a, b, n) {
    a = a % n;
    let result = typeof a === 'bigint' ? 1n : 1;
    let x = a;

    while (b > 0) {
        const leastSignificantBit = b % (typeof b === 'bigint' ? 2n : 2)
        b = typeof b === 'bigint' ? b / 2n : Math.floor(b / 2);

        if (leastSignificantBit == 1) {
            result = result * x;
            result = result % n;
        }

        x = x * x;
        x = x % n;
    }
    return result;
};

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/**
 * Generate all permutations
 * @param {any[]} arr array to permutate
 * @returns {any[][]} array of possible permurations
 */
function permutate(arr) {
    let result = [];

    for (let i = 0; i < arr.length; i = i + 1) {
        let rest = permutate(arr.slice(0, i).concat(arr.slice(i + 1)));

        if (rest.length == 0) {
            result.push([arr[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                result.push([arr[i]].concat(rest[j]))
            }
        }
    }
    return result;
}

/**
 * @param {*} dir
 * @param {*} file
 * @param {string | RegExp} separator
 * @returns {string[]} input file split by lines
 */
function readInput(dir, file, separator = NEWLINE_REGEX) {
    return fs.readFileSync(path.resolve(dir, file)).toString().split(separator);
}

/**
 * @param {*} dir
 * @param {*} file
 * @returns {number[]} input file split by lines
 */
function readNumberInput(dir, file) {
    return readInput(dir, file).map(n => parseInt(n))
}

/**
 * @param {string} s
 * @returns {string} reversed string
 */
function reverseStr(s) {
    return s.split('').reverse().join('');
}

function termClear() {
    process.stdout.write("\u001b[2J\u001b[H");
}

function termWrite(line, col, text) {
    process.stdout.write(`\u001b[${line + 1};${col + 1}H${text}\u001b[H`);
}

module.exports = {
    NEWLINE_REGEX,
    gcd,
    lcm,
    manhattanDistance,
    parsePos,
    pos,
    powMod,
    permutate,
    readInput,
    readNumberInput,
    reverseStr,
    termClear,
    termWrite
}
