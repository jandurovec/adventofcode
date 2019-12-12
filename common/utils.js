const fs = require('fs');
const path = require('path');

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
 * @returns {string[]} input file split by lines
 */
function readInput(dir, file) {
    return fs.readFileSync(path.resolve(dir, file)).toString().split(/\r?\n/);
}

module.exports.gcd = gcd;
module.exports.lcm = lcm;
module.exports.manhattanDistance = manhattanDistance;
module.exports.permutate = permutate;
module.exports.readInput = readInput;
