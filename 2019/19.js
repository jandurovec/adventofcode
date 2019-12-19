const utils = require('../common/utils');
const Grid = require('../common/grid');
const IntcodeComputer = require('./intcode-computer');

const PROG = utils.readInput(__dirname, '19.txt')[0].split(',').map(n => parseInt(n));
const SCAN_SIZE = 50;
const SHIP_SIZE = 100;

class TractorBeam {
    constructor() {
        this.grid = new Grid();
    }

    async scan(x, y) {
        let result = this.grid.get(x, y);
        if (result !== undefined) {
            return result;
        } else {
            result = (await IntcodeComputer.run([...PROG], [x, y]))[0] === 1;
            this.grid.set(x, y, result);
            return result;
        }
    }
}

(async () => {
    const beam = new TractorBeam();

    let affectedFields = 0;
    for (let x = 0; x < SCAN_SIZE; x++) {
        for (let y = 0; y < SCAN_SIZE; y++) {
            if (await beam.scan(x, y)) {
                affectedFields++;
            }
        }
    }
    console.log(affectedFields);

    let x = 0; y = 0;
    while (!(await beam.scan(x, y) && await beam.scan(x + SHIP_SIZE - 1, y) && await beam.scan(x, y + SHIP_SIZE - 1))) {
        while (!await beam.scan(x + SHIP_SIZE - 1, ++y)); // move top right corner to beam
        while (!await beam.scan(++x, y + SHIP_SIZE - 1)); // move bottom left corner to beam
    }
    console.log(10_000 * x + y);
})();
