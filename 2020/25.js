const assert = require('assert').strict;

const SUBJECT_NUMBER = 7;
const DIV_VAL = 20201227;

function getLoopSize(publicKey) {
    let loopSize = 0;
    let key = 1;
    while (key !== publicKey) {
        loopSize++;
        key = (key * SUBJECT_NUMBER) % DIV_VAL;
    }
    return loopSize;
}

function transform(subjectNumber, loopSize) {
    let key = 1;
    for (let i = 0; i < loopSize; i++) {
        key = (key * subjectNumber) % DIV_VAL;
    }
    return key;
}

function getEncryptionKey(cardPublicKey, doorPublicKey) {
    const doorLoopSize = getLoopSize(doorPublicKey);
    return transform(cardPublicKey, doorLoopSize);
}

assert.strictEqual(getLoopSize(5764801), 8);
assert.strictEqual(getLoopSize(17807724), 11);
assert.strictEqual(getEncryptionKey(5764801, 17807724), 14897079)

console.log(getEncryptionKey(12320657,9659666));
