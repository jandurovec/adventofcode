const assert = require('assert').strict;
const utils = require('../common/utils');
const IntcodeComputer = require('./intcode-computer');

const memory = utils.readInput(__dirname, '02.txt')[0].split(',').map(n => parseInt(n));

async function compute(memory, noun = null, verb = null) {
    if (noun != null) {
        memory[1] = noun;
    }
    if (verb != null) {
        memory[2] = verb;
    }

    let comp = new IntcodeComputer(memory);
    await comp.run();
    return memory;
}

(async function() {

assert.deepStrictEqual(await compute([1,0,0,0,99]), [2,0,0,0,99]);
assert.deepStrictEqual(await compute([2,3,0,3,99]), [2,3,0,6,99]);
assert.deepStrictEqual(await compute([2,4,4,5,99,0]), [2,4,4,5,99,9801]);
assert.deepStrictEqual(await compute([1,1,1,4,99,5,6,0,99]), [30,1,1,4,2,5,6,0,99]);

console.log((await compute([...memory], 12, 2))[0]);

loop:
for(let noun = 0; noun <= 99; noun++) {
    for(let verb = 0; verb <= 99; verb++) {
        let mem = [...memory];
        await compute(mem, noun, verb);
        if (mem[0] == 19690720) {
            console.log(100 * noun + verb);
            break loop;
        }
    }
}

})();