const assert = require('assert').strict;
const { readInput } = require('../common/utils');

const MASK_LEN = 36;

function applyMask1(n, mask) {
    let result = '';
    const bits = n.toString(2).split('').reverse();
    for (let i = 0; i < MASK_LEN; i++) {
        let newBit;
        switch (mask[i]) {
            case '0':
            case '1':
                newBit = mask[i];
                break;
            case 'X':
                newBit = bits[i] || '0';
                break;
        }
        result = newBit + result;
    }
    return parseInt(result, 2);
}

function applyMask2(n, mask) {
    let result = [''];
    const bits = n.toString(2).split('').reverse();
    for (let i = 0; i < MASK_LEN; i++) {
        switch (mask[i]) {
            case '0':
                result = result.map(x => (bits[i] || '0') + x);
                break;
            case '1':
                result = result.map(x => '1' + x);
                break;
            case 'X':
                result = result.map(x => '0' + x).concat(result.map(x => '1' + x));
                break;
        }
    }
    return result;
}

function execute(prog, processAssignment) {
    const mem = new Map();
    let mask;
    prog.forEach(instr => {
        const maskMatch = instr.match(/mask = ([0X1]+)/);
        if (!!maskMatch) {
            mask = maskMatch[1].split('').reverse();
        } else {
            const [_, addr, val] = instr.match(/mem\[([0-9]+)\] = ([0-9]+)/);
            processAssignment(mem, parseInt(addr), parseInt(val), mask);
        }
    });
    let result = 0;
    for (n of mem.values()) {
        result += n;
    }
    return result;
}

function part1(prog) {
    return execute(prog, (mem, addr, value, mask) => {
        mem.set(addr, applyMask1(value, mask));
    });
}

function part2(prog) {
    return execute(prog, (mem, addr, value, mask) => {
        applyMask2(addr, mask).forEach(a => {
            mem.set(a, value);
        });
    });
}

assert.strictEqual(part1(readInput(__dirname, '14-sample1.txt')), 165);
assert.strictEqual(part2(readInput(__dirname, '14-sample2.txt')), 208);

const prog = readInput(__dirname, '14.txt');
console.log(part1(prog));
console.log(part2(prog));
