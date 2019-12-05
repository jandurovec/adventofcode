const fs = require('fs');
const path = require('path');

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
 * @param {*} dir 
 * @param {*} file
 * @returns {string[]} input file split by lines
 */
function readInput(dir, file) {
    return fs.readFileSync(path.resolve(dir, file)).toString().split(/\r?\n/);
}

module.exports.manhattanDistance = manhattanDistance;
module.exports.readInput = readInput;
