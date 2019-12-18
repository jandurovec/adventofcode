const utils = require('../common/utils');
const Grid = require('../common/grid');
const BlockingQueue = require('../common/blocking-queue');
const IntcodeComputer = require('./intcode-computer');

const SCAFFOLD = '#';
const NORTH = 0, EAST = 1, SOUTH = 2, WEST = 3;
const DIRECTIONS = '^>v<';
const MEMSIZE = 20;

const PROG = utils.readInput(__dirname, '17.txt')[0].split(',').map(n => parseInt(n));

class Scaffolding {
    constructor() {
        this.grid = new Grid();
        this.cursor = { x: 0, y: 0 };
    }

    process(n) {
        if (n === 10) {
            this.cursor.x = 0;
            this.cursor.y++;
        } else {
            const ch = String.fromCharCode(n)
            this.grid.set(this.cursor.x, this.cursor.y, ch);
            if (DIRECTIONS.indexOf(ch) > -1) {
                this.robot = { x: this.cursor.x, y: this.cursor.y, direction: DIRECTIONS.indexOf(ch) };
            }
            this.cursor.x++;
        }
    }

    getAlignmentSum() {
        return this.grid.entries.filter(e =>
            this.grid.get(e.x, e.y) === SCAFFOLD &&
            this.grid.get(e.x - 1, e.y) === SCAFFOLD &&
            this.grid.get(e.x + 1, e.y) === SCAFFOLD &&
            this.grid.get(e.x, e.y - 1) === SCAFFOLD &&
            this.grid.get(e.x, e.y + 1) === SCAFFOLD
        ).map(e => e.x * e.y).reduce((a, b) => a + b, 0);
    }

    rotate() {
        if ((this.robot.direction === NORTH && this.grid.get(this.robot.x + 1, this.robot.y) === SCAFFOLD) ||
            (this.robot.direction === EAST && this.grid.get(this.robot.x, this.robot.y + 1) === SCAFFOLD) ||
            (this.robot.direction === SOUTH && this.grid.get(this.robot.x - 1, this.robot.y) === SCAFFOLD) ||
            (this.robot.direction === WEST && this.grid.get(this.robot.x, this.robot.y - 1) === SCAFFOLD)) {
            this.robot.direction = (this.robot.direction + 1) % DIRECTIONS.length;
            return 'R';
        }
        if ((this.robot.direction === SOUTH && this.grid.get(this.robot.x + 1, this.robot.y) === SCAFFOLD) ||
            (this.robot.direction === WEST && this.grid.get(this.robot.x, this.robot.y + 1) === SCAFFOLD) ||
            (this.robot.direction === NORTH && this.grid.get(this.robot.x - 1, this.robot.y) === SCAFFOLD) ||
            (this.robot.direction === EAST && this.grid.get(this.robot.x, this.robot.y - 1) === SCAFFOLD)) {
            this.robot.direction = (this.robot.direction + DIRECTIONS.length - 1) % DIRECTIONS.length;
            return 'L';
        }
    }

    move() {
        let vector;
        switch (this.robot.direction) {
            case NORTH: vector = { x: 0, y: -1 }; break;
            case EAST: vector = { x: 1, y: 0 }; break;
            case SOUTH: vector = { x: 0, y: 1 }; break;
            case WEST: vector = { x: -1, y: 0 }; break;
        }

        let distance = 0;
        while (this.grid.get(this.robot.x + vector.x, this.robot.y + + vector.y) === SCAFFOLD) {
            distance++;
            this.robot.x += vector.x;
            this.robot.y += vector.y;
        }
        return distance;
    }

    findPath() {
        const robotBackup = { ... this.robot };
        const result = []
        let instr;
        while ((instr = this.rotate()) !== undefined) {
            result.push(instr);
            result.push(this.move());
        }
        this.robot = robotBackup;
        return result;
    }

    findMovement(path) {
        let routine = path;

        for (let aLen = 1; aLen <= MEMSIZE; aLen++) {
            const aPattern = routine.substring(0, aLen);
            if (!aPattern.match(/^.*[^,]$/)) {
                continue;
            }
            routine = routine.replace(new RegExp(aPattern, 'g'), 'A');
            let rest = routine.replace(/^[A,]+/, '');
            for (let bLen = 1; bLen <= MEMSIZE; bLen++) {
                const bPattern = rest.substring(0, bLen);
                if (!bPattern.match(/^.*[^,]$/)) {
                    continue;
                }
                routine = routine.replace(new RegExp(bPattern, 'g'), 'B');
                rest = routine.replace(/^[AB,]+/, '');
                for (let cLen = 1; cLen <= MEMSIZE; cLen++) {
                    const cPattern = rest.substring(0, cLen);
                    if (!cPattern.match(/^.*[^,]$/)) {
                        continue;
                    }
                    routine = routine.replace(new RegExp(cPattern, 'g'), 'C');
                    if (routine.match(/^[ABC,]+$/) && routine.length <= MEMSIZE) {
                        return {
                            path,
                            routine,
                            A: aPattern,
                            B: bPattern,
                            C: cPattern
                        }
                    }
                    routine = routine.replace(/C/g, cPattern);
                    rest = routine.replace(/^[AB,]+/, '');
                }
                routine = routine.replace(/B/g, bPattern);
                rest = routine.replace(/^[A,]+/, '');
            }
            routine = routine.replace(/A/g, aPattern);
        }
    }
}

async function constructMap() {
    const map = new Scaffolding();
    const comp = new IntcodeComputer([...PROG], null, n => map.process(n));
    await comp.run();
    return map;
}

async function getDust(movement) {
    const input = `${movement.routine}\n${movement.A}\n${movement.B}\n${movement.C}\nn\n`.split('').map(n => n.charCodeAt(0));
    const output = [];
    const prg = [...PROG];
    prg[0] = 2;
    const comp = new IntcodeComputer(prg, () => input.shift(), n => output.push(n));
    await comp.run();
    return output.filter(n => n > 255)[0];
}


(async function () {
    const scaffolding = await constructMap();
    console.log(scaffolding.getAlignmentSum());

    const movement = scaffolding.findMovement(scaffolding.findPath().join());
    console.log(movement);

    const dust = await getDust(movement)
    console.log(dust);

})();
