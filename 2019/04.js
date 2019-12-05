const assert = require('assert').strict;
const utils = require('../utils');

const PWDLENGTH = 6;

/**
 * @param {string} pwd 
 */
function passwordValid(pwd) {
    let lastDigitCode = '0'.charCodeAt(0) - 1;
    let adjacentFound = false;
    for (let i = 0; i < PWDLENGTH; i++) {
        let currentDigitCode = pwd.charCodeAt(i);
        if(currentDigitCode == lastDigitCode) {
            adjacentFound = true;
        }
        if(currentDigitCode < lastDigitCode) {
            return false;
        }
        lastDigitCode = currentDigitCode;
    }
    return adjacentFound;
}

/**
 * @param {string} pwd 
 */
function passwordValid2(pwd) {
    let lastDigitCode = '0'.charCodeAt(0) - 1;
    let adjacentFound = false;
    let runLength = 1;
    for (let i = 0; i < PWDLENGTH; i++) {
        let currentDigitCode = pwd.charCodeAt(i);
        if(currentDigitCode == lastDigitCode) {
            runLength++
        } else {
            if (runLength == 2) {
                adjacentFound = true;
            }
            runLength = 1;
        }
        if(currentDigitCode < lastDigitCode) {
            return false;
        }
        lastDigitCode = currentDigitCode;
    }
    return adjacentFound || runLength == 2;
}

function countValidPasswords(from, to, f) {
    let result = 0;
    while (from <= to) {
        if (f(from.toString())) {
            result++;
        }
        from++;
    }
    return result;
}

const input = utils.readInput(__dirname, '04.txt')[0].split('-');
const from = input[0];
const to = input[1];

assert.strictEqual(passwordValid('111111'), true);
assert.strictEqual(passwordValid('223450'), false);
assert.strictEqual(passwordValid('123789'), false);

console.log(countValidPasswords(from, to, passwordValid));

assert.strictEqual(passwordValid2('112233'), true);
assert.strictEqual(passwordValid2('123444'), false);
assert.strictEqual(passwordValid2('111122'), true);
console.log(countValidPasswords(from, to, passwordValid2));
