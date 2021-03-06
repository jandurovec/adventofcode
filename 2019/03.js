const assert = require('assert').strict;
const Grid = require('../common/grid');
const utils = require('../common/utils');

function solve(inputfile) {
    const board = new Grid();
    const crossings = [];

    function addWire(wire, wireId) {
        let x = 0;
        let y = 0;
        let steps = 0;
        for (let i = 0; i < wire.length; i++) {
            let segment = wire[i];
            let direction = segment.charAt(0);
            let length = parseInt(segment.substr(1));
            while (length-- > 0) {
                steps++;
                if (direction == 'R') {
                    y++;
                } else if (direction == 'L') {
                    y--;
                } else if (direction == 'U') {
                    x--;
                } else if (direction == 'D') {
                    x++;
                }
                let current = board.get(x, y);
                if (current === undefined) {
                    let val = {
                    };
                    val[wireId] = steps;
                    board.set(x, y, val);
                } else if (current[wireId] === undefined) {
                    current[wireId] = steps;
                    crossings.push({ x: x, y: y, steps: current });
                }
            }
        }
    }

    let wires = utils.readInput(__dirname, inputfile).map(s => s.split(','));
    addWire(wires[0], 'a');
    addWire(wires[1], 'b');

    return {
        part1: Math.min(...crossings.map(obj => utils.manhattanDistance(0, 0, obj.x, obj.y))),
        part2: Math.min(...crossings.map(obj => obj.steps.a + obj.steps.b))
    };
}

assert.strictEqual(solve('03-sample0.txt').part1, 6);
assert.deepStrictEqual(solve('03-sample1.txt'), { part1: 159, part2: 610 });
assert.deepStrictEqual(solve('03-sample2.txt'), { part1: 135, part2: 410 });

console.log(solve('03.txt'));
