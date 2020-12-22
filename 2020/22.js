const assert = require('assert').strict;
const { NEWLINE_REGEX, readInput } = require('../common/utils');

function parseInput(filename) {
    const parts = readInput(__dirname, filename, /\r?\n\r?\n/);
    return parts.map(p => p.split(NEWLINE_REGEX).slice(1).map(n => parseInt(n)));
}

function getScore(deck1, deck2) {
    const deck = deck1.length === 0 ? deck2 : deck1;
    let result = 0;
    for (let i = deck.length - 1; i >= 0; i--) {
        result += (deck.length - i) * deck[i];
    }
    return result;
}

function part1(filename) {
    const [deck1, deck2] = parseInput(filename);

    while (deck1.length > 0 && deck2.length > 0) {
        const c1 = deck1.shift();
        const c2 = deck2.shift();
        if (c1 > c2) {
            deck1.push(c1, c2);
        } else {
            deck2.push(c2, c1);
        }
    }

    return getScore(deck1, deck2)
}

function part2(filename) {
    function play(deck1, deck2) {
        const played = new Set();
        while (deck1.length > 0 && deck2.length > 0) {
            const gameState = deck1.join() + '|' + deck2.join();
            if (played.has(gameState)) {
                return {
                    winner: 1,
                    decks: [deck1, deck2]
                }
            } else {
                played.add(gameState);
            }
            const c1 = deck1.shift();
            const c2 = deck2.shift();
            let roundWinner;
            if (deck1.length >= c1 && deck2.length >= c2) {
                roundWinner = play(deck1.slice(0, c1), deck2.slice(0, c2)).winner;
            } else {
                roundWinner = c1 > c2 ? 1 : 2;
            }

            if (roundWinner === 1) {
                deck1.push(c1, c2)
            } else {
                deck2.push(c2, c1);
            }

        }

        return {
            winner: deck1.length === 0 ? 2 : 1,
            decks: [deck1, deck2]
        }

    }

    const gameResult = play(...parseInput(filename));
    return getScore(...gameResult.decks);
}

assert.strictEqual(part1('22-sample.txt'), 306);
assert.strictEqual(part2('22-sample.txt'), 291);

console.log(part1('22.txt'));
console.log(part2('22.txt'));
