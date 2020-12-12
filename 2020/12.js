const assert = require('assert').strict;
const { manhattanDistance, readInput } = require('../common/utils');

const vectors = {
    N: { x: 0, y: 1 },
    S: { x: 0, y: -1 },
    E: { x: 1, y: 0 },
    W: { x: -1, y: 0 }
};

function parseInstr(i) {
    const [_, action, sval] = i.match(/([NSEWLRF])([0-9]+)/);
    return { action, val: parseInt(sval) };
}

function rotate(point, deg) {
    const rad = deg * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
        x: Math.round((point.x * cos) + (point.y * sin)),
        y: Math.round((point.y * cos) - (point.x * sin))
    }
}

function navigate(instr, waypoint, move) {
    let ship = { x: 0, y: 0 };

    instr.forEach(i => {
        const { action, val } = parseInstr(i);
        switch (action) {
            case 'L':
                waypoint = rotate(waypoint, -val);
                break;
            case 'R':
                waypoint = rotate(waypoint, val);
                break;
            case 'F':
                const dx = val * waypoint.x;
                const dy = val * waypoint.y;
                ship.x += dx;
                ship.y += dy;
                break;
            default:
                ({ ship, waypoint } = move(ship, waypoint, action, val));
        }
    });

    return manhattanDistance(0, 0, ship.x, ship.y);
}

function part1(instr) {
    return navigate(instr, { x: 1, y: 0 }, (ship, waypoint, direction, value) => {
        return {
            ship: {
                x: ship.x + value * vectors[direction].x,
                y: ship.y + value * vectors[direction].y
            },
            waypoint
        }
    });
}

function part2(instr) {
    return navigate(instr, { x: 10, y: 1 }, (ship, waypoint, direction, value) => ({
        ship,
        waypoint: {
            x: waypoint.x + value * vectors[direction].x,
            y: waypoint.y + value * vectors[direction].y
        }
    }));
}

const testInstructions = readInput(__dirname, '12-sample.txt');
assert.strictEqual(part1(testInstructions), 25);
assert.strictEqual(part2(testInstructions), 286);

const instructions = readInput(__dirname, '12.txt');
console.log(part1(instructions));
console.log(part2(instructions));
