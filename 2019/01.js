const assert = require('assert').strict;
const utils = require('../utils');


function calculateFuel(mass) {
    return Math.floor(mass/3)-2;
}

function sum(aggregate, val) {
    return aggregate + val;
}

function calculateFuel2(mass) {
    let totalFuel = 0;
    let fuel = calculateFuel(mass);
    while (fuel > 0) {
        totalFuel = totalFuel + fuel
        fuel = calculateFuel(fuel);
    }
    return totalFuel;
}

assert.strictEqual(calculateFuel(12), 2);
assert.strictEqual(calculateFuel(14), 2);
assert.strictEqual(calculateFuel(1969), 654);
assert.strictEqual(calculateFuel(100756), 33583);

let starshipModules = utils.readInput(__dirname, '01.txt');

let totalFuel = starshipModules.map(calculateFuel).reduce((a, b) => a + b, 0);
console.log(totalFuel)

assert.strictEqual(calculateFuel2(14), 2);
assert.strictEqual(calculateFuel2(1969), 966);
assert.strictEqual(calculateFuel2(100756), 50346);

let totalFuel2 = starshipModules.map(calculateFuel2).reduce((a, b) => a + b, 0);
console.log(totalFuel2);
