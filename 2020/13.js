const assert = require('assert').strict;
const { lcm, readInput } = require('../common/utils');

function parseBuses(busString) {
    return busString.split(',').map((no, i) => (no === 'x' ? null : {
        busNo: parseInt(no), i
    })).filter(n => n !== null).map(({ busNo, i }) => ({
        busNo, i, requiredMod: (busNo - i % busNo) % busNo
    }));
}

function parseInput(filename) {
    const data = readInput(__dirname, filename);
    return {
        start: parseInt(data[0]),
        buses: parseBuses(data[1])
    }
}

function findFirst(data) {
    return data.buses.map(({ busNo, i }) => busNo).map(bus => ({
        bus,
        departsIn: bus - data.start % bus
    })).sort((a, b) => a.departsIn - b.departsIn)[0];
}

function part1(data) {
    const first = findFirst(data);
    return first.bus * first.departsIn;
}

function part2(buses) {
    let start = 0;
    let period = 1;
    buses.forEach(bus => {
        while (start % bus.busNo !== bus.requiredMod) {
            start += period;
        }
        period = lcm(period, bus.busNo);
    });
    return start;
}

const testInput = parseInput('13-sample.txt');
assert.strictEqual(part1(testInput), 295);
assert.strictEqual(part2(testInput.buses), 1068781);
assert.strictEqual(part2(parseBuses('17,x,13,19')), 3417);
assert.strictEqual(part2(parseBuses('67,7,59,61')), 754018);
assert.strictEqual(part2(parseBuses('67,x,7,59,61')), 779210);
assert.strictEqual(part2(parseBuses('67,7,x,59,61')), 1261476);
assert.strictEqual(part2(parseBuses('1789,37,47,1889')), 1202161486);

const input = parseInput('13.txt');
console.log(part1(input));
console.log(part2(input.buses));
