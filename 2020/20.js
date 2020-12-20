const assert = require('assert').strict;
const { NEWLINE_REGEX, readInput, reverseStr } = require('../common/utils');
const Grid = require('../common/grid')

const TILE_MID_SIZE = 8;
const MONSTER_DATA = ["                  # ",
                      "#    ##    ##    ###",
                      " #  #  #  #  #  #   "];
const MONSTER = {
    width: 20,
    height: 3,
    has: (x, y) => MONSTER_DATA[y].charAt(x) === '#'
};

function rotate(data) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        let s = '';
        for (let j = data.length - 1; j >= 0; j--) {
            s += data[j].charAt(i);
        }
        result.push(s);
    }
    return result;
}

function parseInput(filename) {
    const tileData = readInput(__dirname, filename, /\r?\n\r?\n/);

    return tileData.map(t => {
        const data = t.split(NEWLINE_REGEX);
        const [_, id] = data.shift().match(/Tile ([0-9]+):/);

        const mid = [];
        for (let i = 1; i <= TILE_MID_SIZE; i++) {
            mid.push(data[i].substr(1, TILE_MID_SIZE));
        }
        const variants = [];
        let variant = {
            id: parseInt(id),
            top: data[0],
            right: data.map(l => l.charAt(l.length - 1)).join(''),
            bottom: data[data.length - 1],
            left: data.map(l => l.charAt(0)).join(''),
            mid
        }
        for (let i = 0; i < 8; i++) {
            variants.push(variant);
            variant = {
                id: variant.id,
                top: reverseStr(variant.left),
                right: variant.top,
                bottom: reverseStr(variant.right),
                left: variant.bottom,
                mid: rotate(variant.mid)
            }
            if (i === 3) {
                // flip
                variant = {
                    id: variant.id,
                    top: reverseStr(variant.top),
                    right: variant.left,
                    bottom: reverseStr(variant.bottom),
                    left: variant.right,
                    mid: mid.map(s => reverseStr(s))
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
        .reduce((a, b) => a * b);
}

function part2(filename) {
    const res = assemble(filename);
    let img = [];
    for (let y = res.minY; y <= res.maxY; y++) {
        for (let l = 0; l < TILE_MID_SIZE; l++) {
            let s = '';
            for (let x = res.minX; x <= res.maxX; x++) {
                s += res.get(x, y).mid[l];
            }
            img.push(s);
        }
    }

    function checkSeaMonster(img, x, y) {
        if (img.length < y + MONSTER.height || img[0].length < x + MONSTER.width) {
            return false;
        }
        for (let i = 0; i < MONSTER.width; i++) {
            for (let j = 0; j < MONSTER.height; j++) {
                if (MONSTER.has(i, j) && img[y + j].charAt(x + i) !== '#') {
                    return false;
                }
            }
        }
        return true;
    }

    function countMonsters(img) {
        let result = 0;
        for (let y = 0; y < img.length; y++) {
            for (let x = 0; x < img.length; x++) {
                if (checkSeaMonster(img, x, y)) {
                    result++
                }
            }
        }
        return result;
    }

    for (let i = 0; i < 8; i++) {
        const cnt = countMonsters(img);
        if (cnt === 0) {
            img = rotate(img);
            if (i === 3) {
                // flip
                img = img.map(s => reverseStr(s));
            }
        } else {
            return img.join('').replaceAll('.', '').length - cnt * MONSTER_DATA.join('').replaceAll(' ', '').length;
        }
    }
}

assert.strictEqual(part1('20-sample.txt'), 20899048083289);
assert.strictEqual(part2('20-sample.txt'), 273);

console.log(part1('20.txt'));
console.log(part2('20.txt'));
