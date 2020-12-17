const assert = require('assert').strict;
const { readInput } = require('../common/utils');

const STEPS = 6;

class PocketDimension {
    #data = new Set();
    minX = 0;
    maxX = 0;
    minY = 0;
    maxY = 0;
    minZ = 0;
    maxZ = 0;
    minW = 0;
    maxW = 0;

    #getCoords(x = 0, y = 0, z = 0, w = 0) {
        return [x, y, z, w].join(',');
    }

    activate(x = 0, y = 0, z = 0, w = 0) {
        this.#data.add(this.#getCoords(x, y, z, w));
        if (x > this.maxX) {
            this.maxX = x;
        }
        if (x < this.minX) {
            this.minX = x;
        }
        if (y > this.maxY) {
            this.maxY = y;
        }
        if (y < this.minY) {
            this.minY = y;
        }
        if (z > this.maxZ) {
            this.maxZ = z;
        }
        if (z < this.minZ) {
            this.minZ = z;
        }
        if (w > this.maxW) {
            this.maxW = w;
        }
        if (w < this.minW) {
            this.minW = w;
        }
    }

    isActive(x = 0, y = 0, z = 0, w = 0) {
        return this.#data.has(this.#getCoords(x, y, z, w));
    }

    neighbors(x, y, z, w) {
        let result = 0;

        let minL = -1;
        let maxL = 1;
        if (w === undefined) {
            minL = 0
            maxL = 0;
            w = 0;
        }

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                for (let k = -1; k <= 1; k++) {
                    for (let l = minL; l <= maxL; l++) {
                        if (!(i === 0 && j === 0 && k === 0 && l === 0)) {
                            result += this.isActive(x + i, y + j, z + k, w + l) ? 1 : 0;
                        }
                    }
                }
            }
        }
        return result;
    }

    get count() {
        return this.#data.size;
    }
}

function parseInput(filename) {
    const result = new PocketDimension();
    const input = readInput(__dirname, filename);
    input.forEach((row, x) => {
        [...row].forEach((c, y) => {
            if (c === '#') {
                result.activate(x, y)
            }
        })
    });
    return result;
}

function shouldBeActive(isActive, neighborCount) {
    return neighborCount == 3 || (isActive && neighborCount == 2);
}

function part1(pd) {
    for (let i = 0; i < STEPS; i++) {
        const newpd = new PocketDimension();
        for (let x = pd.minX - 1; x <= pd.maxX + 1; x++) {
            for (let y = pd.minY - 1; y <= pd.maxY + 1; y++) {
                for (let z = pd.minZ - 1; z <= pd.maxZ + 1; z++) {
                    if (shouldBeActive(pd.isActive(x, y, z), pd.neighbors(x, y, z))) {
                        newpd.activate(x, y, z);
                    }
                }
            }
        }
        pd = newpd;
    }
    return pd.count;
}

function part2(pd) {
    for (let i = 0; i < STEPS; i++) {
        const newpd = new PocketDimension();
        for (let x = pd.minX - 1; x <= pd.maxX + 1; x++) {
            for (let y = pd.minY - 1; y <= pd.maxY + 1; y++) {
                for (let z = pd.minZ - 1; z <= pd.maxZ + 1; z++) {
                    for (let w = pd.minW - 1; w <= pd.maxW + 1; w++) {
                        if (shouldBeActive(pd.isActive(x, y, z, w), pd.neighbors(x, y, z, w))) {
                            newpd.activate(x, y, z, w);
                        }
                    }
                }
            }
        }
        pd = newpd;
    }
    return pd.count;
}

let testPocketDimension = parseInput('17-sample.txt');
assert.strictEqual(part1(testPocketDimension), 112);
assert.strictEqual(part2(testPocketDimension), 848);

let pocketDimension = parseInput('17.txt');
console.log(part1(pocketDimension));
console.log(part2(pocketDimension));
