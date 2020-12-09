const assert = require('assert').strict;
const utils = require('../common/utils');

const MY_BAG = 'shiny gold';

function parseInput(filename) {
    const rules = utils.readInput(__dirname, filename);
    const containers = new Map();
    const content = new Map();
    const result = { containers, content };
    rules.forEach(r => {
        const [outer, contentRule] = r.split(' bags contain ');
        contentRule.split(/ bags?[,.] ?/).forEach(innerBags => {
            if (innerBags !== '') {
                const idx = innerBags.indexOf(' ');
                const count = parseInt(innerBags.substring(0, idx));
                const inner = innerBags.substring(idx + 1);
                if (!!count) {
                    // populate containers
                    if (!containers.has(inner)) {
                        containers.set(inner, [outer]);
                    } else {
                        containers.get(inner).push(outer);
                    }

                    // populate content
                    const val = { count, color: inner };
                    if (!content.has(outer)) {
                        content.set(outer, [val]);
                    } else {
                        content.get(outer).push(val);
                    }
                }
            }
        });
    });
    return result;
}

function countContainers(parsedBags, needle) {
    const containers = new Set();
    const toExplore = [needle];

    while (toExplore.length > 0) {
        const current = toExplore.shift();
        const next = parsedBags.containers.get(current);
        if (!!next) {
            next.forEach(n => {
                if (!containers.has(n)) {
                    containers.add(n);
                    toExplore.push(n);
                }
            })
        }
    }

    return containers.size;
}

function countInnerBags(parsedBags, needle, cache = new Map()) {
    if (cache.has(needle)) {
        return cache.get(needle);
    }

    let innerBags = 0;
    const content = parsedBags.content.get(needle);
    if (!!content) {
        innerBags = content.map(({ count, color }) => count * (1 + countInnerBags(parsedBags, color, cache))).reduce((a, b) => a + b);
    }
    cache.set(needle, innerBags);
    return innerBags;
}

const testBags = parseInput('07-sample1.txt');
assert.strictEqual(countContainers(testBags, MY_BAG), 4);
assert.strictEqual(countInnerBags(testBags, MY_BAG), 32);

assert.strictEqual(countInnerBags(parseInput('07-sample2.txt'), MY_BAG), 126);

const bags = parseInput('07.txt');
console.log(countContainers(bags, MY_BAG));
console.log(countInnerBags(bags, MY_BAG) - 1);
