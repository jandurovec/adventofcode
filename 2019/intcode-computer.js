const BlockingQueue = require('../common/blocking-queue');

const MAX_PARAMS = 3;

class IntcodeComputer {
    /**
     * @param {number[]} memory
     * @param {function(): Promise<number>} input
     * @param {function(number): void} output
     */
    constructor(memory, input, output = ((n) => {})) {
        this.memory = memory;
        this.input = input;
        this.output = output;
        this.ip = 0;
        this.relBase = 0;
    }

    parseInstr() {
        let instr = this.memory[this.ip];
        let opCode = instr % 100;
        instr = Math.floor(instr / 100);
        let paramModes = [];
        for (let i = 0; i < MAX_PARAMS; i++) {
            paramModes[i] = instr % 10;
            instr = Math.floor(instr / 10);
        }
        this.currentInstr = {
            opCode: opCode,
            paramModes: paramModes
        }
    }

    getValueAddr(paramPos) {
        let param = this.ip + paramPos;
        let paramMode = this.currentInstr.paramModes[paramPos - 1];
        switch (paramMode) {
            case 0: return this.memory[param]; // position mode
            case 1: return param; // immediate mode
            case 2: return this.relBase + this.memory[param]; //relative mode
            default: throw new Error("Uknown parameter mode " + paramMode);
        }
    }

    getParam(paramPos) {
        let val = this.memory[this.getValueAddr(paramPos)];
        return val === undefined ? 0 : val;
    }

    set(paramPos, value) {
        this.memory[this.getValueAddr(paramPos)] = value;
    }

    /**
     * @returns {Promise<void>} computer output
     */
    async run() {
        while (true) {
            this.parseInstr();
            switch (this.currentInstr.opCode) {
                case 1: // +
                    this.set(3, this.getParam(1) + this.getParam(2));
                    this.ip += 4;
                    break;
                case 2: // *
                    this.set(3, this.getParam(1) * this.getParam(2));
                    this.ip += 4;
                    break;
                case 3: // input
                    this.set(1, await this.input());
                    this.ip += 2;
                    break;
                case 4: // output
                    this.output(this.getParam(1));
                    this.ip += 2;
                    break;
                case 5: // jump-if-true
                    if (this.getParam(1) != 0) {
                        this.ip = this.getParam(2);
                    } else {
                        this.ip += 3;
                    }
                    break;
                case 6: // jump-if-false
                    if (this.getParam(1) == 0) {
                        this.ip = this.getParam(2);
                    } else {
                        this.ip += 3;
                    }
                    break;
                case 7: // less-than
                    this.set(3, this.getParam(1) < this.getParam(2) ? 1 : 0);
                    this.ip += 4;
                    break;
                case 8: // equals
                    this.set(3, this.getParam(1) == this.getParam(2) ? 1 : 0);
                    this.ip += 4;
                    break;
                case 9: // adjust relbase
                    this.relBase += this.getParam(1);
                    this.ip += 2;
                    break;
                case 99:
                    return;
                default:
                    throw new Error("Invalid instruction: " + this.memory[this.ip]);
            }
        }
    }

    /**
     * @param {number[]} memory
     * @param {number[]} input
     * @returns {Promise<number[]>} computer output
     */
    static async run(memory, input) {
        const out = [];
        let i = 0;
        async function getInput() {
            return input[i++];
        }
        await new IntcodeComputer(memory, getInput, n => out.push(n)).run();
        return out;
    }
}

module.exports = IntcodeComputer;