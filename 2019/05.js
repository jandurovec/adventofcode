const assert = require('assert').strict;
const utils = require('../utils');
const IntcodeComputer = require('./intcode-computer');

/* Part 1 tests */
const out1 = [];
new IntcodeComputer([3,0,4,0,99], [1234], out1).run();
assert.deepStrictEqual(out1, [1234])

const mem2 = [1002,4,3,4,33];
new IntcodeComputer(mem2).run();
assert.deepStrictEqual(mem2, [1002,4,3,4,99]);

const mem3 = [1101,100,-1,4,0];
new IntcodeComputer(mem3).run();
assert.deepStrictEqual(mem3, [1101,100,-1,4,99]);
/* --- */

const memory = utils.readInput(__dirname, '05.txt')[0].split(',').map(n => parseInt(n));
const output = [];
new IntcodeComputer(memory, [1], output).run();
console.log(output);
