const utils = require('../common/utils');
const IntcodeComputer = require('./intcode-computer');

const PROG = utils.readInput(__dirname, '23.txt')[0].split(',').map(n => parseInt(n));
const NIC_COUNT = 50;
const IDLE_TIMEOUT = 10;
const nat = {
    lastSent: Date.now()
}
var done = false;

const inputs = [];
for (let i = 0; i < NIC_COUNT; i++) {
    inputs[i] = [i];
}

function outputProcessor() {
    let i = 0;
    let data = [];
    return n => {
        nat.lastSent = Date.now();
        if (++i % 3 === 0) {
            const [addr, x] = data;
            if (addr === 255) {
                if (nat.packet === undefined) {
                    console.log(`Part1: ${n}`);
                }
                nat.packet = { x, y: n };
            } else {
                inputs[addr].push(x);
                inputs[addr].push(n);
            }
            data = [];
        } else {
            data.push(n);
        }
    };
}

function doNat() {
    if (Date.now() - nat.lastSent > IDLE_TIMEOUT) {
        if (inputs.every(a => a.length === 0)) {
            // idle network detected
            if (nat.packet !== undefined && nat.packet.y === nat.lastY) {
                console.log(`Part2: ${nat.lastY}`);
                done = true;
            }
            nat.lastY = nat.packet.y;
            inputs[0].push(nat.packet.x, nat.packet.y);
        }
    }
}

const nics = [];
for (let i = 0; i < NIC_COUNT; i++) {
    nics[i] = new IntcodeComputer([...PROG], async () => {
        if (!done) {
            const d = inputs[i].shift();
            if (d === undefined) {
                doNat();
                return new Promise(resolve => {
                    setTimeout(resolve, 0, -1);
                });
            } else {
                return d;
            }
        } else {
            // return promise that never resolves
            return new Promise(() => { });
        }
    }, outputProcessor());
    nics[i].run();
}
