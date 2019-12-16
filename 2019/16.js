const assert = require('assert').strict;
const utils = require('../common/utils');

const DIGITS = 8;
const PHASES = 100;

function getInput() {
    return utils.readInput(__dirname, '16.txt')[0];
}

function* getSeq(seqId, items) {
    const BASE_SEQ = [0, 1, 0, -1];
    for (let i = 0; i < items; i++) {
        yield BASE_SEQ[Math.floor((i + 1) / (seqId + 1)) % BASE_SEQ.length];
    }
}

function fft(input, phases) {
    let result = input.split('').map(n => parseInt(n));
    for (let phase = 0; phase < phases; phase++) {
        const phaseResult = result.map(() => 0);
        for (let i = 0; i < input.length; i++) {
            const seq = getSeq(i, input.length);
            for (let j = 0; j < input.length; j++) {
                phaseResult[i] += result[j] * seq.next().value;
            }
        }
        result = phaseResult.map(n => Math.abs(n % 10));
    }
    return result.slice(0, DIGITS).join('');
}

function fft2(input, phases) {
    const REPEAT = 10_000;
    const offset = parseInt(input.substring(0, 7));
    if (offset < input.length * REPEAT / 2) {
        throw new Exception('Algorithm not suitable for output sequences in first input half');
    }
    const inArr = input.split('').map(n => parseInt(n));
    const requiredLength = REPEAT * input.length - offset;
    let result = [];
    while (result.length < requiredLength) {
        result.push(...inArr);
    }
    result.splice(0, result.length - requiredLength);

    for (let phase = 0; phase < phases; phase++) {
        var last = 0;
        for (let i = result.length - 1; i >= 0; i--) {
            last = (last + result[i]) % 10;
            result[i] = last;
        }
    }
    return result.slice(0, DIGITS).join('');
}

assert.deepStrictEqual(Array.from(getSeq(0, 10)), [1, 0, -1, 0, 1, 0, -1, 0, 1, 0]);
assert.deepStrictEqual(Array.from(getSeq(1, 15)), [0, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, 0, 0, -1, -1]);

assert.strictEqual(fft('12345678', 1), '48226158');
assert.strictEqual(fft('12345678', 2), '34040438');
assert.strictEqual(fft('12345678', 3), '03415518');
assert.strictEqual(fft('12345678', 4), '01029498');
assert.strictEqual(fft('80871224585914546619083218645595', PHASES), '24176176');
assert.strictEqual(fft('19617804207202209144916044189917', PHASES), '73745418');
assert.strictEqual(fft('69317163492948606335995924319873', PHASES), '52432133');

console.log(fft(getInput(), PHASES));

assert.strictEqual(fft2('03036732577212944063491565474664', PHASES), '84462026');
assert.strictEqual(fft2('02935109699940807407585447034323', PHASES), '78725270');
assert.strictEqual(fft2('03081770884921959731165446850517', PHASES), '53553731');

console.log(fft2(getInput(), PHASES));
