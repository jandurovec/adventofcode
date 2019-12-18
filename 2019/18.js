const assert = require('assert').strict;
const Grid = require('../common/grid');
const utils = require('../common/utils');

const ENTRANCE = "@", WALL = '#';

class Day18 {
    static isKey(c) {
        return c === c.toLowerCase() && c >= 'a' && c <= 'z';
    }
    static isDoor(c) {
        return c === c.toUpperCase() && c >= 'A' && c <= 'Z';
    }

    constructor(filename) {
        this.map = new Grid();
        this.keys = []
        this.entrances = [];
        this.paths = new Map();

        let y = 0;
        utils.readInput(__dirname, filename).forEach(row => {
            let x = 0;
            row.split('').forEach(o => {
                if (Day18.isKey(o)) {
                    this.keys.push({ loc: { x, y }, key: o });
                } else if (o === ENTRANCE) {
                    // up to 10 entrances supported
                    this.entrances.push({ loc: { x, y }, key: this.entrances.length.toString() });
                }
                this.map.set(x++, y, o);
            });
            y++;
        });

        this.allKeys = this.keys.map(k => k.key).sort().join('');

        this.initPaths();
    }

    initPaths() {
        [...this.entrances, ...this.keys].forEach(k => {
            const keyDist = new Map();
            const distances = new Grid();
            const toExplore = [{ loc: k.loc, dist: 0, req: [] }];
            while (toExplore.length > 0) {
                let { loc: { x, y }, dist: d, req } = toExplore.shift();
                if (distances.get(x, y) === undefined) {
                    const curr = this.map.get(x, y);
                    if (curr !== WALL) {
                        distances.set(x, y, d);
                        if (Day18.isDoor(curr)) {
                            req = [...req, curr.toLowerCase()];
                        }
                        toExplore.push({ loc: { x: x - 1, y }, dist: d + 1, req });
                        toExplore.push({ loc: { x: x + 1, y }, dist: d + 1, req });
                        toExplore.push({ loc: { x, y: y - 1 }, dist: d + 1, req });
                        toExplore.push({ loc: { x, y: y + 1 }, dist: d + 1, req });
                        if (Day18.isKey(curr) && curr !== k.key) {
                            keyDist.set(curr, { dist: d, req });
                        }
                    }
                }
            }
            this.paths.set(k.key, keyDist);
        });
    }

    findBestKeyPath() {
        const data = new Map();
        const toExplore = [];
        const initialState = this.entrances.map(e => e.key).sort().join('') + ':'
        data.set(initialState, { keys: new Set(), dist: 0 });
        toExplore.push(initialState);
        while (toExplore.length > 0) {
            const s = toExplore.shift();
            const curr = data.get(s);
            const [pos, ownedKeys] = s.split(':');
            if (ownedKeys === this.allKeys) {
                if (!data.has(ownedKeys) || data.get(ownedKeys).dist > curr.dist) {
                    data.set(ownedKeys, { dist: curr.dist });
                }
            } else {
                pos.split('').forEach(p => {
                    const nextPaths = this.paths.get(p);
                    for (const next of nextPaths.entries()) {
                        const [nextKey, nextData] = next;
                        if (curr.keys.has(nextKey)) {
                            continue;
                        }
                        if (nextData.req.every(k => curr.keys.has(k))) {
                            const newKeys = new Set(curr.keys);
                            newKeys.add(nextKey);
                            const newState = pos.replace(p, nextKey) + ':' + [...newKeys].sort().join('');
                            const newDist = curr.dist + nextData.dist;
                            if (!data.has(newState) || data.get(newState).dist > newDist) {
                                data.set(newState, { keys: newKeys, dist: newDist });
                                toExplore.push(newState);
                            }
                        }
                    }
                });
            }
        }
        return data.get(this.allKeys).dist;
    }
}

assert.strictEqual((new Day18('18-1-sample0.txt')).findBestKeyPath(), 8);
assert.strictEqual((new Day18('18-1-sample1.txt')).findBestKeyPath(), 86);
assert.strictEqual((new Day18('18-1-sample2.txt')).findBestKeyPath(), 132);

console.log((new Day18('18-1.txt')).findBestKeyPath());

assert.strictEqual((new Day18('18-2-sample1.txt')).findBestKeyPath(), 8);
assert.strictEqual((new Day18('18-2-sample2.txt')).findBestKeyPath(), 24);
assert.strictEqual((new Day18('18-2-sample3.txt')).findBestKeyPath(), 32);
assert.strictEqual((new Day18('18-2-sample4.txt')).findBestKeyPath(), 72);

console.log((new Day18('18-2.txt')).findBestKeyPath());
