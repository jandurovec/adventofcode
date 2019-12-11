const assert = require('assert').strict;
const utils = require('../common/utils');
const IntcodeComputer = require('./intcode-computer');

const UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
const DIRECTIONS = 4;

class HullPaintingRobot {
    constructor(startColor = 0) {
        this.hull = {};
        this.x = 0;
        this.y = 0;
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
        this.orientation = 0;
        this.paint(startColor);
    }

    getPos(x = this.x, y = this.y) {
        return x + ',' + y;
    }

    move() {
        switch (this.orientation) {
            case UP:
                this.y++;
                this.maxY = Math.max(this.y, this.maxY);
                break;
            case DOWN:
                this.y--;
                this.minY = Math.min(this.y, this.minY);
                break;
            case RIGHT:
                this.x++;
                this.maxX = Math.max(this.x, this.maxX);
                break;
            case LEFT:
                this.x--;
                this.minX = Math.min(this.x, this.minX);
                break;
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
        return this.hull[this.getPos()] == 1 ? 1 : 0;
    }

    paint(n) {
        this.hull[this.getPos()] = n;
    }

    getPaintedPanels() {
        return Object.keys(this.hull).length;
    }

    print() {
        for (let j = this.maxY; j >= this.minY; j--) {
            const line = [];
            for (let i = this.minX; i <= this.maxX; i++) {
                line.push(this.hull[this.getPos(i, j)] == 1 ? '\u25AE' : ' ');
            }
            console.log(line.join(''));
        }
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
