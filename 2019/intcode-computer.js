const MAX_PARAMS = 3;

class IntcodeComputer {
    /**
     * @param {number[]} memory
     */
    constructor(memory, input = [], output= []) {
        this.memory = memory;
        this.input = input;
        this.output = output;
        this.ip = 0;
        this.nextInput = 0;
    }

    parseInstr() {
        let instr = this.memory[this.ip];
        let opCode = instr % 100;
        instr = Math.floor(instr/100);
        let paramModes = [];
        for (let i = 0; i < MAX_PARAMS; i++) {
            paramModes[i] = instr % 10;
            instr = Math.floor(instr/10);
        }
        this.currentInstr = {
            opCode: opCode,
            paramModes: paramModes
        }
    }

    getInstrArg(pos) {
        let addr = this.ip + pos;
        if (this.currentInstr.paramModes[pos - 1] == 1) {
            return this.memory[addr];
        } else {
            return this.memory[this.memory[addr]];
        }
    }

    run() {
        while (true) {
            this.parseInstr();
            switch (this.currentInstr.opCode) {
                case 1: // +
                    this.memory[this.memory[this.ip + 3]] = this.getInstrArg(1) + this.getInstrArg(2);
                    this.ip += 4;
                    break;
                case 2: // *
                    this.memory[this.memory[this.ip + 3]] = this.getInstrArg(1) * this.getInstrArg(2);
                    this.ip += 4;
                    break;
                case 3: // input
                    this.memory[this.memory[this.ip + 1]] = this.input[this.nextInput++];
                    this.ip += 2;
                    break;
                case 4: // output
                    this.output.push(this.getInstrArg(1));
                    this.ip += 2;
                    break;
                case 5: // jump-if-true
                    if (this.getInstrArg(1) != 0) {
                        this.ip = this.getInstrArg(2);
                    } else {
                        this.ip += 3;
                    }
                    break;
                case 6: // jump-if-false
                    if (this.getInstrArg(1) == 0) {
                        this.ip = this.getInstrArg(2);
                    } else {
                        this.ip += 3;
                    }
                    break;
                case 7: // less-than
                    this.memory[this.memory[this.ip + 3]] = this.getInstrArg(1) < this.getInstrArg(2) ? 1 : 0;
                    this.ip += 4;
                    break;
                case 8: //equals
                    this.memory[this.memory[this.ip + 3]] = this.getInstrArg(1) == this.getInstrArg(2) ? 1 : 0;
                    this.ip += 4;
                    break;
                case 99:
                    return this.output;
                default:
                    throw new Error("Invalid instruction: " + this.currentInstr);
            }
        }
    }
}

module.exports = IntcodeComputer;