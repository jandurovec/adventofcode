const assert = require('assert').strict;
const { NEWLINE_REGEX, readInput } = require('../common/utils');

function parseInput(filename) {
    const [_, fieldDef, my, nearby] =
        readInput(__dirname, filename, /(.*)\r?\n\r?\nyour ticket:\r?\n([0-9,]+)\r?\n\r?\nnearby tickets:\r?\n(.+)/s);

    const ranges = [];
    fieldDef.split(NEWLINE_REGEX).forEach(f => {
        const [_, name, from1, to1, from2, to2] = f.match(/(.*): ([0-9]+)-([0-9]+) or ([0-9]+)-([0-9]+)/)
            .map((v, i) => i < 2 ? v : parseInt(v));

        [[from1, to1], [from2, to2]].forEach(([from, to]) => {
            ranges.push({
                name, from, to,
                contains: i => from <= i && i <= to
            })
        });
    })

    return {
        ranges: ranges,
        my: my.split(',').map(n => parseInt(n)),
        nearby: nearby.split(NEWLINE_REGEX).map(t => t.split(',').map(n => parseInt(n)))
    }
}

function part1(input) {
    const sum = (a, b) => a + b;
    return input.nearby
        .map(t => t.map(v => !input.ranges.find(r => r.contains(v)) ? v : 0).reduce(sum))
        .reduce(sum);
}

function getMapping({ ranges, my, nearby }) {
    const validTickets = [my, ...nearby]
        .filter(t => t.map(v => !!ranges.find(r => r.contains(v))).reduce((a, b) => a && b, true));

    // collect candidates for each field
    const candidates = new Map();
    const fieldCount = my.length;
    for (let i = 0; i < fieldCount; i++) {
        const itemCandidates = validTickets.map(t => t[i])
            .map(v => new Set(ranges.filter(r => r.contains(v)).map(r => r.name)))
            .reduce((prev, cur) => {
                for (x of prev) {
                    if (!cur.has(x)) {
                        prev.delete(x);
                    }
                }
                return prev;
            });
        candidates.set(i, itemCandidates);
    }

    const mapping = [];
    // keep eliminating unique candidates
    while (candidates.size > 0) {
        let uniqueVal;
        for ([k, v] of candidates) {
            if (v.size === 1) {
                uniqueVal = v.values().next().value;
                mapping[k] = uniqueVal;
                candidates.delete(k);
                for ([_, v2] of candidates) {
                    v2.delete(uniqueVal);
                }
                break;
            }
        }
        if (!uniqueVal) {
            throw "Mapping is not unique";
        }
    }

    return mapping;
}

function part2(input) {
    return getMapping(input).reduce((prev, cur, i) => prev * (cur.startsWith('departure') ? input.my[i] : 1), 1);
}

const testInput = parseInput('16-sample.txt');
assert.strictEqual(part1(testInput), 71);
assert.deepStrictEqual(getMapping(testInput), ['row', 'class', 'seat']);

const input = parseInput('16.txt');
console.log(part1(input));
console.log(part2(input));
