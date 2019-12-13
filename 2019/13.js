const utils = require('../common/utils');
const IntcodeComputer = require('./intcode-computer');

const EMPTY = ' ', WALL = '|', BLOCK = '#', PADDLE = '=', BALL = 'o';
const TILES = [EMPTY, WALL, BLOCK, PADDLE, BALL];
const FRAME_DELAY = 0;

class Arcade {
    constructor(paintProgress = false) {
        this.paintProgress = paintProgress;
        this.data = [];
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
            if (this.data[y] === undefined) {
                this.data[y] = [];
            }
            this.data[y][x] = TILES[value];
            if (this.paintProgress) {
                utils.termWrite(y + 1, x, this.data[y][x]);
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
    const blockCount = a.data.reduce((sum, row) => sum + row.filter(x => x == BLOCK).length, 0);

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
