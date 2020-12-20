const assert = require('assert').strict;
const { NEWLINE_REGEX, readInput, reverseStr } = require('../common/utils');
const Grid = require('../common/grid')

function parseInput(filename) {
    const tileData = readInput(__dirname, filename, /\r?\n\r?\n/);

    return tileData.map(t => {
        const data = t.split(NEWLINE_REGEX);
        const [_, id] = data.shift().match(/Tile ([0-9]+):/);

        const variants = [];
        let variant = {
            id: parseInt(id),
            top: data[0],
            right: data.map(l => l.charAt(l.length - 1)).join(''),
            bottom: data[data.length - 1],
            left: data.map(l => l.charAt(0)).join('')
        }
        for (let i = 0; i < 8; i++) {
            variants.push(variant);
            // rotate
            variant = {
                id: variant.id,
                top: reverseStr(variant.left),
                right: variant.top,
                bottom: reverseStr(variant.right),
                left: variant.bottom
            }
            // flip
            if (i === 3) {
                variant = {
                    id: variant.id,
                    top: reverseStr(variant.top),
                    right: variant.left,
                    bottom: reverseStr(variant.bottom),
                    left: variant.right
                }
            }
        }

        return {
            id,
            variants
        };
    });
}

function assemble(filename) {
    const tiles = parseInput(filename);
    const size = Math.floor(Math.sqrt(tiles.length));

    function check(tile, grid, x, y) {
        let valid = true;
        valid &&= !grid.has(x - 1, y) || tile.left === grid.get(x - 1, y).right;
        valid &&= !grid.has(x + 1, y) || tile.right === grid.get(x + 1, y).left;
        valid &&= !grid.has(x, y - 1) || tile.top === grid.get(x, y - 1).bottom;
        valid &&= !grid.has(x, y + 1) || tile.bottom === grid.get(x, y + 1).top;
        return valid;
    }

    function solve(availableTiles, i = 0, g = new Grid()) {
        if (availableTiles.length === 0) {
            return g;
        }
        const x = i % size;
        const y = Math.floor(i / size);
        for (t of availableTiles) {
            const leftTiles = availableTiles.filter(x => x.id !== t.id);
            for (v of t.variants) {
                if (check(v, g, x, y)) {
                    g.set(x, y, v);
                    if (!!solve(leftTiles, i + 1, g)) {
                        return g;
                    }
                    g.delete(x, y);
                }
            }
        }
    }

    return solve(tiles);
}

function part1(filename) {
    const res = assemble(filename);
    return [[0, 0], [res.maxX, 0], [0, res.maxY], [res.maxX, res.maxY]]
        .map(([x, y]) => parseInt(res.get(x, y).id))
        .reduce((a,b) => a * b);
}

assert.strictEqual(part1('20-sample.txt'), 20899048083289);

console.log(part1('20.txt'));
