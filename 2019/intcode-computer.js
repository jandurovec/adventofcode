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
        this.parseInstr();
        while (this.currentInstr.opCode != 99) {
            switch (this.currentInstr.opCode) {
                case 1:
                    this.memory[this.memory[this.ip + 3]] = this.getInstrArg(1) + this.getInstrArg(2);
                    this.ip += 4;
                    break;
                case 2:
                    this.memory[this.memory[this.ip + 3]] = this.getInstrArg(1) * this.getInstrArg(2);
                    this.ip += 4;
                    break;
                case 3:
                    this.memory[this.memory[this.ip + 1]] = this.input[this.nextInput++];
                    this.ip += 2;
                    break;
                case 4:
                    this.output.push(this.getInstrArg(1));
                    this.ip += 2;
                    break;
                default:
                    return -1;
            }
            this.parseInstr();
        }
        return 0;
    }
}

module.exports = IntcodeComputer;