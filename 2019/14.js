const assert = require('assert').strict;
const utils = require('../common/utils');

const ORE = 'ORE';
const FUEL = 'FUEL';

function parseReactions(filename) {
    const reactions = {};
    utils.readInput(__dirname, filename).map(s => s.split(' => ')).forEach(
        eq => {
            const r = {
                req: {}
            };
            eq[0].split(', ').forEach(mat => {
                const m = mat.split(' ');
                r.req[m[1]] = parseInt(m[0]);
            }
            );
            const product = eq[1].split(' ');
            r.qty = parseInt(product[0]);
            reactions[product[1]] = r;
        }
    );
    return reactions;
}

function calculateOre(reactions, requiredFuel = 1) {
    const need = {};
    Object.keys(reactions).forEach(k => {
        need[k] = 0;
        Object.keys(reactions[k].req).forEach(k => {
            need[k] = 0;
        });
    });
    need[FUEL] = requiredFuel;

    let current;
    while (!!(current = Object.keys(need).find(x => x != ORE && need[x] > 0))) {
        const needQty = need[current];
        const r = reactions[current];
        const multiplier = Math.ceil(needQty / r.qty);
        need[current] -= r.qty * multiplier;
        Object.keys(r.req).forEach(k => {
            need[k] += r.req[k] * multiplier;
        });
    }
    return need[ORE];
}

function calcuateFuel(reactions, ore) {
    let totalFuel = 0;
    let increment = Math.floor(ore / calculateOre(reactions));
    while (increment > 0) {
        if (calculateOre(reactions, totalFuel + increment) < ore) {
            totalFuel += increment;
        } else {
            increment = Math.floor(increment / 2);
        }
    }
    return totalFuel;
}

assert.strictEqual(calculateOre(parseReactions('14-sample1.txt')), 165);
assert.strictEqual(calculateOre(parseReactions('14-sample2.txt')), 13312);
assert.strictEqual(calculateOre(parseReactions('14-sample3.txt')), 180697);
assert.strictEqual(calculateOre(parseReactions('14-sample4.txt')), 2210736);

const reactions = parseReactions('14.txt');
console.log(calculateOre(reactions));

const TOTAL_ORE = 1_000_000_000_000;
assert.strictEqual(calcuateFuel(parseReactions('14-sample2.txt'), TOTAL_ORE), 82892753);
assert.strictEqual(calcuateFuel(parseReactions('14-sample3.txt'), TOTAL_ORE), 5586022);
assert.strictEqual(calcuateFuel(parseReactions('14-sample4.txt'), TOTAL_ORE), 460664);

console.log(calcuateFuel(reactions, TOTAL_ORE));
