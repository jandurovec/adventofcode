const assert = require('assert').strict;
const utils = require('../common/utils');

function parseInput(filename) {
    return utils.readInput(__dirname, filename).map(s => s.split(' ')).map(([instr, arg]) => ({ instr, arg: parseInt(arg) }));
}

function execute(instructions) {
    let ip = 0;
    let acc = 0;
    const visited = [];
    while (ip < instructions.length && !visited[ip]) {
        visited[ip] = true;
        const { instr, arg } = instructions[ip];
        switch (instr) {
            case 'acc':
                acc += arg;
                break;
            case 'jmp':
                ip += arg - 1; // will be incremented later by 1
                break;
        }
        ip++;
    }
    return {
        infLoop: ip < instructions.length,
        acc
    }
}

function switchInstr(i) {
    if (i.instr === 'nop' || i.instr === 'jmp') {
        i.instr = i.instr === 'nop' ? 'jmp' : 'nop';
        return true;
    } else {
        return false;
    }
}

function fix(instructions) {
    for (let i = 0; i < instructions.length; i++) {
        if (switchInstr(instructions[i])) {
            const execResult = execute(instructions);
            // revert changes
            switchInstr(instructions[i]);

            if (!execResult.infLoop) {
                return execResult.acc;
            }
        }
    }
}

const testInstr = parseInput('08-sample.txt');
assert.strictEqual(execute(testInstr).acc, 5);
assert.strictEqual(fix(testInstr), 8);

const instr = parseInput('08.txt');
console.log(execute(instr).acc);
console.log(fix(instr));
