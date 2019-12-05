class IntcodeComputer {
    /**
     * @param {number[]} memory 
     */
    constructor(memory) {
        this.memory = memory;
    }

    run() {
        let ip = 0;
        while (this.memory[ip] != 99) {
            switch (this.memory[ip]) {
                case 1:
                    this.memory[this.memory[ip + 3]] = this.memory[this.memory[ip + 1]] + this.memory[this.memory[ip + 2]];
                    break;
                case 2:
                    this.memory[this.memory[ip + 3]] = this.memory[this.memory[ip + 1]] * this.memory[this.memory[ip + 2]];
                    break;
                default:
                    return -1;
            }
            ip += 4;
        }
        return 0;
    }
}

module.exports = IntcodeComputer;