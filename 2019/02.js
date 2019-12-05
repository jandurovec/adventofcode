const assert = require('assert').strict;
const utils = require('../utils');
const IntcodeComputer = require('./intcode-computer');

const memory = utils.readInput(__dirname, '02.txt')[0].split(',').map(n => parseInt(n));

function compute(memory, noun = null, verb = null) {
    if (noun != null) {
        memory[1] = noun;
    }
    if (verb != null) {
        memory[2] = verb;
    }
    
    let comp = new IntcodeComputer(memory);
    comp.run();
    return memory;
}

assert.deepStrictEqual(compute([1,0,0,0,99]), [2,0,0,0,99]);
assert.deepStrictEqual(compute([2,3,0,3,99]), [2,3,0,6,99]);
assert.deepStrictEqual(compute([2,4,4,5,99,0]), [2,4,4,5,99,9801]);
assert.deepStrictEqual(compute([1,1,1,4,99,5,6,0,99]), [30,1,1,4,2,5,6,0,99]);

console.log(compute([...memory], 12, 2)[0]);

loop:
for(let noun = 0; noun <= 99; noun++) {
    for(let verb = 0; verb <= 99; verb++) {
        let result = compute([...memory], noun, verb)[0];
        if (result == 19690720) {
            console.log(100 * noun + verb);
            break loop;
        }
    }
}
