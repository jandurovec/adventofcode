const assert = require('assert').strict;
const utils = require('../common/utils');

function getPosition(deckSize, shuffling, needle) {
    let result = needle;
    shuffling.forEach(technique => {
        if (technique === 'deal into new stack') {
            result = deckSize - 1 - result;
        } else if (technique.startsWith('deal with increment')) {
            let [_, incr] = technique.match(/deal with increment (.*)/);
            result = (result * parseInt(incr)) % deckSize;
        } else if (technique.startsWith('cut ')) {
            let [_, cut] = technique.match(/cut (.*)/);
            result = (result + deckSize - parseInt(cut)) % deckSize;
        } else {
            throw new Error(`Unknown technique: ${technique}`);
        }
    });
    return result;
}

/*
A key observation to make is that every possible deck can be encoded as a pair
of (first number of the deck, or offset AND difference between two adjacent
numbers, or increment). ALL numbers here are modulo (cards in deck), or MOD.

Then, getting the nth number in the sequence can be done by calcuating
offset + increment * n.

Starting off with (offset, increment) = (0, 1), we can process techniques like
this:

    deal into new stack: "reverses the list". If we go left to right, the
    numbers increase by increment every time. If we reverse the list, we instead
    go from right to left - so numbers should decrease by increment! Therefore,
    negate increment. However, we also need to change the first number, taking
    the new second number as the first number - so we increment offset by the
    new increment. In code, this would be:

      increment *= -1
      offset += increment

    cut n cards: "shifts the list". We need to move the nth card to the front,
    and the nth card is gotten by offset + increment * n. Therefore, this is
    equivalent to incrementing offset by increment * n. In code, this would be:

      offset += increment * n

    deal with increment n: The first card - or offset - doesn't change... but
    how does increment change? We already know the first number in the new list
    (it's offset), but what is the second number in the new list? If we have
    both of them, we can calculate offset.
    The 0th card in our old list goes to the 0th card in our new list, 1st card
    in old goes to the nth card in new list (mod MOD), 2nd card in old goes to
    the 2*nth card in new list, and so on. So, the ith card in our old list
    goes to the i*nth card in the new list. When is i*n = 1? If we "divide"
    both sides by n, we get i = n^(-1)... so we calculate the modular inverse of
    n mod MOD. As all MODs we're using (10007 and 119315717514047) are prime, we
    can calculate this by doing n^(MOD - 2) as n^(MOD - 1) = 1 due to Fermat's
    little theorem.
    Okay, so we know that the second card in the new list is n^(-1) in our old
    list. Therefore, the difference between that and the first card in the old
    list (and the new list) is
    offset + increment * n^(-1) - offset = increment * n^(-1).
    Therefore, we should multiply increment by n^(-1). In code, this would be:

      increment *= inv(n)

    where inv(n) = pow(n, MOD-2, MOD).

Okay, so we know how to do one pass of the shuffle. How do we repeat it a huge
number of times?

If we take a closer look at how the variables change, we can make two important
observations:

    increment is always multiplied by some constant number (i.e. not increment
    or offset).

    offset is always incremented by some constant multiple of increment at that
    point in the process.

With the first observation, we know that doing a shuffle pass always multiplies
increment by some constant. However, what about offset? It's incremented by a
multiple of increment... but that increment can change during the process!
Thankfully, we can use our first observation and notice that:

    all increments during the process are some constant multiple of increment
    before the process, so offset is always incremented by some constant
    multiple of increment before the process.

Let (offset_diff, increment_mul) be the values of offset and increment after one
shuffle pass starting from (0, 1). Then, for any (offset, increment), applying a
single shuffle pass is equivalent to:

offset += increment * offset_diff
increment *= increment_mul

That's not enough - we need to apply the shuffle pass a huge number of times.
Using the above, how do we get the nth (offset, increment) starting at (0, 1)
with n=0?

As increment only multiplies by increment_mul every time, we can calculate the
nth increment by repeatedly multiplying it n times... also known as
exponentiation. Therefore:

increment = pow(increment_mul, n, MOD)

What about offset though? It depends on increment, which changes on each shuffle
pass. If we manually write out the formula for offset for a couple values of n:

n=0, offset = 0
n=1, offset = 0 + 1*offset_diff
n=2, offset = 0 + 1*offset_diff + increment_mul*offset_diff
n=3, offset = 0 + 1*offset_diff + increment_mul*offset_diff + (increment_mul^2)*offset_diff

we quickly see that

offset = offset_diff * (1 + increment_mul + increment_mul^2 + ... + increment_mul^(n-1))

Hey, that thing in the parentheses looks familiar - it's a geometric series! We
can rewrite it as

offset = offset_diff * (1 - pow(increment_mul, iterations, MOD)) * inv(1 - increment_mul)
*/
function getCardAt(deckSize, shuffling, shuffleCount, cardPos) {
    // works only for prime deckSize
    deckSize = BigInt(deckSize);
    shuffleCount = BigInt(shuffleCount);
    cardPos = BigInt(cardPos);

    let offset = 0n;
    let increment = 1n;

    shuffling.forEach(technique => {
        if (technique === 'deal into new stack') {
            increment = (deckSize - increment) % deckSize;
            offset = (offset + increment) % deckSize;
        } else if (technique.startsWith('deal with increment')) {
            let [_, incr] = technique.match(/deal with increment (.*)/)
            incr = BigInt(parseInt(incr));
            increment = (increment * utils.powMod(incr, deckSize - 2n, deckSize)) % deckSize;
        } else if (technique.startsWith('cut ')) {
            let [_, cut] = technique.match(/cut (.*)/);
            cut = BigInt(parseInt(cut))
            offset = (offset + increment * cut) % deckSize;
        } else {
            throw new Error(`Unknown technique: ${technique}`);
        }
    });

    incrementX = utils.powMod(increment, shuffleCount, deckSize);
    offsetX = offset * (1n - incrementX) * utils.powMod(1n - increment, deckSize - 2n, deckSize);
    offsetX %= deckSize;

    let result = (offsetX + cardPos * incrementX) % deckSize;
    return result >= 0 ? result : result + deckSize;
}


assert.deepEqual(getPosition(10, utils.readInput(__dirname, '22-sample1.txt'), 2), 4);
assert.deepEqual(getPosition(10, utils.readInput(__dirname, '22-sample2.txt'), 2), 7);

const shuffling = utils.readInput(__dirname, '22.txt');
const part1 = getPosition(10007, shuffling, 2019);
console.log(part1);

assert.deepEqual(getCardAt(10007, shuffling, 1, part1), 2019n);

console.log(getCardAt(119315717514047n, shuffling, 101741582076661n, 2020n));
