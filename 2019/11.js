const assert = require('assert').strict;
const utils = require('../common/utils');
const Grid = require('../common/grid');
const IntcodeComputer = require('./intcode-computer');

const UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
const DIRECTIONS = 4;

class HullPaintingRobot {
    constructor(startColor = 0) {
        this.hull = new Grid();
        this.x = 0;
        this.y = 0;
        this.orientation = 0;
        this.paint(startColor);
    }

    getPos(x = this.x, y = this.y) {
        return x + ',' + y;
    }

    move() {
        switch (this.orientation) {
            case UP: this.y--; break;
            case DOWN: this.y++; break;
            case RIGHT: this.x++; break;
            case LEFT: this.x--; break;
        }
    }

    turnLeft() {
        this.orientation = (this.orientation + DIRECTIONS - 1) % DIRECTIONS;
        this.move();
    }

    turnRight() {
        this.orientation = (this.orientation + 1) % DIRECTIONS;
        this.move();
    }

    getColor() {
        return this.hull.get(this.x, this.y) == 1 ? 1 : 0;
    }

    paint(n) {
        this.hull.set(this.x, this.y, n);
    }

    getPaintedPanels() {
        return Object.keys(this.hull.entries).length;
    }

    print() {
        this.hull.print(v => v == 1 ? '\u25AE' : ' ');
    }

}

async function runHullPaintingRobot(prg, startColor = 0) {
    const robot = new HullPaintingRobot(startColor);
    let paint = true; // move if false

    const comp = new IntcodeComputer(prg,
        () => new Promise(resolve => {
            resolve(robot.getColor());
        }),
        n => {
            if (paint) {
                robot.paint(n);
            } else if (n == 0) {
                robot.turnLeft();
            } else {
                robot.turnRight();
            }
            paint = !paint;
        });
    await comp.run();
    return robot;
}

(async function () {
    const prg = utils.readInput(__dirname, '11.txt')[0].split(',').map(n => parseInt(n));
    console.log((await runHullPaintingRobot([...prg])).getPaintedPanels());
    (await runHullPaintingRobot([...prg], 1)).print();
})();
