const utils = require('../common/utils');
const Grid = require('../common/grid');
const IntcodeComputer = require('./intcode-computer');

const EMPTY = ' ', WALL = '|', BLOCK = '#', PADDLE = '=', BALL = 'o';
const TILES = [EMPTY, WALL, BLOCK, PADDLE, BALL];
const FRAME_DELAY = 0;

class Arcade {
    constructor(paintProgress = false) {
        this.paintProgress = paintProgress;
        this.data = new Grid();
        this.ballPos = 0;
        this.paddlePos = 0;
    }

    draw(x, y, value) {
        if (x == -1 && y == 0) {
            this.score = value;
            if (this.paintProgress) {
                utils.termWrite(0, 1, `Score: ${value}`);
            }
        } else {
            this.data.set(x, y, TILES[value]);
            if (this.paintProgress) {
                utils.termWrite(y + 1, x, this.data.get(x, y));
            }
            switch (TILES[value]) {
                case BALL:
                    this.ballPos = x;
                    break;
                case PADDLE:
                    this.paddlePos = x;
                    break;
            }
        }
    }
}

const a = new Arcade()

function outputProcessor() {
    let i = 0;
    const args = [];
    return function (n) {
        args[i++] = n;
        if ((i %= 3) == 0) {
            a.draw(...args);
        }
    }
}

(async function () {
    const prg = utils.readInput(__dirname, '13.txt')[0].split(',').map(n => parseInt(n));
    await new IntcodeComputer([...prg], null, outputProcessor()).run();
    const blockCount = a.data.entries.map(x => x.value === BLOCK ? 1 : 0).reduce((sum, cur) => sum + cur, 0);

    a.paintProgress = true;
    prg[0] = 2;

    utils.termClear()

    await new IntcodeComputer([...prg], _ => new Promise(resolve => {
        setTimeout(_ => resolve(Math.sign(a.ballPos - a.paddlePos)), FRAME_DELAY);
    }), outputProcessor()).run();

    utils.termClear();

    console.log(blockCount);
    console.log(a.score);
})();
