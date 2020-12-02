const assert = require('assert').strict;
const utils = require('../common/utils');

function countValidPasswords(entries, policy) {
    let entryRegex = /^([0-9]+)-([0-9]+) ([a-z]): ([a-z]+)$/;
    return entries.filter(e => {
        const match = e.match(entryRegex);
        const n1 = parseInt(match[1]);
        const n2 = parseInt(match[2]);
        const c = match[3];
        const pass = match[4];
        return policy(n1, n2, c, pass);
    }).length;
}

function countValidPasswordsPart1(entries) {
    return countValidPasswords(entries, (low, high, c, pass) => {
        let count = 0;
        for (let i = 0; i < pass.length; i++) {
            if (pass.charAt(i) === c) {
                count++;
            }
        }
        return low <= count && count <= high;
    });
}

function countValidPasswordsPart2(entries) {
    return countValidPasswords(entries, (pos1, pos2, c, pass) => {
        return (pass.charAt(pos1 - 1) === c || pass.charAt(pos2 - 1) === c)
            && !(pass.charAt(pos1 - 1) === c && pass.charAt(pos2 - 1) === c);
    });
}

let testEntries = utils.readInput(__dirname, '02-sample.txt');
assert.strictEqual(countValidPasswordsPart1(testEntries), 2);
assert.strictEqual(countValidPasswordsPart2(testEntries), 1);

let entries = utils.readInput(__dirname, '02.txt');
console.log(countValidPasswordsPart1(entries));
console.log(countValidPasswordsPart2(entries));
