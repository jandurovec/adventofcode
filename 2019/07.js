const assert = require('assert').strict;
const utils = require('../common/utils');
const BlockingQueue = require('../common/blocking-queue');
const IntcodeComputer = require('./intcode-computer');

const AMP_COUNT = 5;

function getMemContent(filename) {
    return utils.readInput(__dirname, filename)[0].split(',').map(n => parseInt(n));
}

(async function () {

    async function getThrusterSignal(memory, phaseSequence) {
        const ampInputs = [];
        const ampPromises = [];
        for (let i = 0; i < AMP_COUNT; i++) {
            ampInputs[i] = new BlockingQueue([phaseSequence[i]]);
        }
        ampInputs[0].enqueue(0);
        for (let i = 0; i < AMP_COUNT; i++) {
            ampPromises[i] = new IntcodeComputer([...memory], ampInputs[i], ampInputs[(i + 1) % AMP_COUNT]).run();
        }

        await Promise.all(ampPromises);
        return ampInputs[0].dequeue();
    }

    assert.deepStrictEqual(await getThrusterSignal(getMemContent('07-sample1.txt'), [4, 3, 2, 1, 0]), 43210);
    assert.deepStrictEqual(await getThrusterSignal(getMemContent('07-sample2.txt'), [0, 1, 2, 3, 4]), 54321);
    assert.deepStrictEqual(await getThrusterSignal(getMemContent('07-sample3.txt'), [1, 0, 4, 3, 2]), 65210);

    async function getMaxThrusterSignal(phases) {
        let maxSignal = 0;
        const memory = getMemContent('07.txt');
        const perms = utils.permutate(phases);
        for (let i = 0; i < perms.length; i++) {
            let signal = await getThrusterSignal(memory, perms[i]);
            maxSignal = Math.max(signal, maxSignal);
        }
        return maxSignal;
    }

    console.log(await getMaxThrusterSignal([0,1,2,3,4]));
    console.log(await getMaxThrusterSignal([5,6,7,8,9]));

})();