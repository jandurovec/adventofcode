const assert = require('assert').strict;
const { parsePos, pos, readInput } = require('../common/utils');

function findTile(path) {
    let x = 0;
    let y = 0;
    let i = 0
    while (i < path.length) {
        if (path.charAt(i) === 'n' || path.charAt(i) === 's') {
            y += path.charAt(i) === 'n' ? - 1 : 1;
            x += path.charAt(i + 1) === 'e' ? 1 : -1;
            i = i + 2;
        } else {
            x += path.charAt(i) === 'e' ? 2 : -2;
            i = i + 1;
        }
    }
    return pos(x, y);
}

function getAdjacent(tile) {
    const { x, y } = parsePos(tile);
    return [pos(x - 2, y), pos(x - 1, y - 1), pos(x + 1, y - 1), pos(x + 2, y), pos(x + 1, y + 1), pos(x - 1, y + 1)];
}

function getPattern(filename) {
    const paths = readInput(__dirname, filename);
    const flipped = new Set();

    paths.forEach(p => {
        const position = findTile(p);
        if (flipped.has(position)) {
            flipped.delete(position);
        } else {
            flipped.add(position);
        }
    });

    return flipped;
}

function part1(filename) {
    return getPattern(filename).size;
}

function part2(filename, days) {
    let pattern = getPattern(filename);
    for (let day = 0; day < days; day++) {
        let newPattern = new Set();
        for (p of pattern) {
            const adjacent = getAdjacent(p);
            const adjBlack = adjacent.map(tile => pattern.has(tile) ? 1 : 0).reduce((a, b) => a + b);
            if (adjBlack == 1 || adjBlack == 2) {
                newPattern.add(p);
            };

            const adjWhite = adjacent.filter(pp => !pattern.has(pp));
            adjWhite.forEach(white => {
                const adjBlack2 = getAdjacent(white).map(tile => pattern.has(tile) ? 1 : 0).reduce((a, b) => a + b);
                if (adjBlack2 == 2) {
                    newPattern.add(white);
                };
            });
        }
        pattern = newPattern;
    }
    return pattern.size;
}

assert.strictEqual(findTile('esew'), '1,1');
assert.strictEqual(findTile('nwwswee'), '0,0');

assert.strictEqual(part1('24-sample.txt'), 10);
assert.strictEqual(part2('24-sample.txt', 1), 15);
assert.strictEqual(part2('24-sample.txt', 100), 2208);

console.log(part1('24.txt'));
console.log(part2('24.txt', 100));
