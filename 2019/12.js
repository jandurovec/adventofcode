const assert = require('assert').strict;
const utils = require('../common/utils');

function getInput(filename) {
    return utils.readInput(__dirname, filename).map(moon => {
        const matches = /<x=(.*), y=(.*), z=(.*)>/.exec(moon);
        return [matches[1], matches[2], matches[3]];
    }).map(moon => moon.map(n => parseInt(n)));
}

class MoonSimulator {
    constructor(positions) {
        this.pos = positions;
        this.vel = this.pos.map(n => [0, 0, 0]);
    }

    step(steps = 1) {
        for (let s = 0; s < steps; s++) {
            const newVel = this.vel.map(v => [...v]);
            for (let i = 0; i < this.pos.length; i++) {
                for (let j = 0; j < this.pos.length; j++) {
                    newVel[i] = newVel[i].map((val, idx) => val + Math.sign(this.pos[j][idx] - this.pos[i][idx]));
                }
            }
            this.pos = this.pos.map((p, idx1) => p.map((val, idx2) => val + newVel[idx1][idx2]));
            this.vel = newVel;
        }
        return {
            pos: this.pos,
            vel: this.vel,
            energy: this.energy
        }
    }

    get energy() {
        const pot = this.pos.map(p => p.reduce((sum, v) => sum + Math.abs(v), 0));
        const kin = this.vel.map(p => p.reduce((sum, v) => sum + Math.abs(v), 0));
        return pot.map((val, idx) => val * kin[idx]).reduce((sum, v) => sum + v, 0);
    }

    find1dLoop(dimension) {
        let pos = this.pos.map(a => a[dimension]);
        let vel = this.vel.map(a => a[dimension]);
        const pos0 = pos.toString();
        const vel0 = vel.toString();
        let step = 0;
        do {
            vel = vel.map((v, idx) => v + pos.map(p => Math.sign(p - pos[idx])).reduce((sum, v) => sum + v, 0));
            pos = pos.map((p, idx) => p + vel[idx]);
            step++;
        }
        while (pos0 != pos.toString() || vel0 != vel.toString());
        return step;
    }

    get loopLength() {
        const loopsByAxis = this.pos[0].map(
            (_, i) => this.find1dLoop(i)
        )
        return utils.lcm(...loopsByAxis);
    }
}

assert.deepStrictEqual(new MoonSimulator(getInput('12-sample1.txt')).step(10), {
    pos: [[2, 1, -3], [1, -8, 0], [3, -6, 1], [2, 0, 4]],
    vel: [[-3, -2, 1], [-1, 1, 3], [3, 2, -3], [1, -1, -1]],
    energy: 179
});
assert.deepStrictEqual(new MoonSimulator(getInput('12-sample2.txt')).step(100), {
    pos: [[8, -12, -9], [13, 16, -3], [-29, -11, -1], [16, -13, 23]],
    vel: [[-7, 3, 0], [3, -11, -5], [-3, 7, 4], [7, 1, 1]],
    energy: 1940
});

console.log(new MoonSimulator(getInput('12.txt')).step(1000).energy);

assert.strictEqual(new MoonSimulator(getInput('12-sample1.txt')).loopLength, 2772)
assert.strictEqual(new MoonSimulator(getInput('12-sample2.txt')).loopLength, 4686774924)

console.log(new MoonSimulator(getInput('12.txt')).loopLength);
