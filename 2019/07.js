const assert = require('assert').strict;
const utils = require('../utils');
const IntcodeComputer = require('./intcode-computer');

const AMP_COUNT = 5;

function getMemContent(filename) {
    return utils.readInput(__dirname, filename)[0].split(',').map(n => parseInt(n));
}

function getThrusterSignal(memory, phaseSequence) {
    let outputSignal = 0;
    for (let i = 0; i < AMP_COUNT; i++) {
        const input = [phaseSequence[i], outputSignal];
        const output = new IntcodeComputer([...memory], input).run();
        outputSignal = output[0];

    }
    return outputSignal;
}

assert.deepStrictEqual(getThrusterSignal(getMemContent('07-sample1.txt'), [4, 3, 2, 1, 0]), 43210);
assert.deepStrictEqual(getThrusterSignal(getMemContent('07-sample2.txt'), [0, 1, 2, 3, 4]), 54321);
assert.deepStrictEqual(getThrusterSignal(getMemContent('07-sample3.txt'), [1, 0, 4, 3, 2]), 65210);

let maxSignal = 0;
const memory = getMemContent('07.txt');
utils.permutate([0, 1, 2, 3, 4]).forEach(phaseSequence => {
    let signal = getThrusterSignal(memory, phaseSequence);
    maxSignal = Math.max(signal, maxSignal);
});

console.log(maxSignal);
