const assert = require('assert').strict;
const utils = require('../common/utils');
const IntcodeComputer = require('./intcode-computer');

(async function() {

/* Part 1 tests */
assert.deepStrictEqual(await new IntcodeComputer([3,0,4,0,99], [1234]).run(), [1234])

const mem2 = [1002,4,3,4,33];
await new IntcodeComputer(mem2).run();
assert.deepStrictEqual(mem2, [1002,4,3,4,99]);

const mem3 = [1101,100,-1,4,0];
await new IntcodeComputer(mem3).run();
assert.deepStrictEqual(mem3, [1101,100,-1,4,99]);
/* --- */

const memory = utils.readInput(__dirname, '05.txt')[0].split(',').map(n => parseInt(n));
console.log(await new IntcodeComputer([...memory], [1]).run());

/* Part 2 tests */
assert.deepStrictEqual(await new IntcodeComputer([3,9,8,9,10,9,4,9,99,-1,8], [8]).run(), [1]);
assert.deepStrictEqual(await new IntcodeComputer([3,9,8,9,10,9,4,9,99,-1,8], [9]).run(), [0]);
assert.deepStrictEqual(await new IntcodeComputer([3,9,7,9,10,9,4,9,99,-1,8], [7]).run(), [1]);
assert.deepStrictEqual(await new IntcodeComputer([3,9,7,9,10,9,4,9,99,-1,8], [9]).run(), [0]);
assert.deepStrictEqual(await new IntcodeComputer([3,3,1108,-1,8,3,4,3,99], [8]).run(), [1]);
assert.deepStrictEqual(await new IntcodeComputer([3,3,1108,-1,8,3,4,3,99], [9]).run(), [0]);
assert.deepStrictEqual(await new IntcodeComputer([3,3,1107,-1,8,3,4,3,99], [7]).run(), [1]);
assert.deepStrictEqual(await new IntcodeComputer([3,3,1107,-1,8,3,4,3,99], [9]).run(), [0]);
assert.deepStrictEqual(await new IntcodeComputer([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9], [0]).run(), [0]);
assert.deepStrictEqual(await new IntcodeComputer([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9], [1]).run(), [1]);
assert.deepStrictEqual(await new IntcodeComputer([3,3,1105,-1,9,1101,0,0,12,4,12,99,1], [0]).run(), [0]);
assert.deepStrictEqual(await new IntcodeComputer([3,3,1105,-1,9,1101,0,0,12,4,12,99,1], [1]).run(), [1]);

const check_8_mem = [3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99];
assert.deepStrictEqual(await new IntcodeComputer([...check_8_mem], [7]).run(), [999]);
assert.deepStrictEqual(await new IntcodeComputer([...check_8_mem], [8]).run(), [1000]);
assert.deepStrictEqual(await new IntcodeComputer([...check_8_mem], [9]).run(), [1001]);
/* --- */

console.log(await new IntcodeComputer([...memory], [5]).run());

})();