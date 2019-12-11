const assert = require('assert').strict;
const utils = require('../common/utils');
const IntcodeComputer = require('./intcode-computer');

(async function () {
    const quine = [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99];
    assert.deepStrictEqual(await IntcodeComputer.run([...quine]), quine);
    assert.strictEqual((await IntcodeComputer.run([1102,34915192,34915192,7,4,7,99,0]))[0].toString().length, 16);
    assert.deepStrictEqual((await IntcodeComputer.run([104,1125899906842624,99])), [1125899906842624]);

    const prg = utils.readInput(__dirname, '09.txt')[0].split(',').map(n => parseInt(n));
    console.log(await IntcodeComputer.run([...prg], [1]));
    console.log(await IntcodeComputer.run([...prg], [2]));
})();