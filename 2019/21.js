const utils = require('../common/utils');
const IntcodeComputer = require('./intcode-computer');

const PROG = utils.readInput(__dirname, '21.txt')[0].split(',').map(n => parseInt(n));

async function runSpringDroid(springscript) {
    const out = await IntcodeComputer.run([...PROG], springscript.split('').map(c => c.charCodeAt(0)));
    out.forEach(i => {
        if (i < 256) {
            process.stdout.write(String.fromCharCode(i));
        } else {
            console.log(i);
        }
    });
}

(async () => {
    let script1 = '';
    script1 += 'NOT A J\n';
    script1 += 'NOT B T\n';
    script1 += 'OR T J\n';
    script1 += 'NOT C T\n';
    script1 += 'OR T J\n';
    script1 += 'AND D J\n';
    script1 += 'WALK\n';
    await runSpringDroid(script1);

    let script2 = '';
    script2 += 'NOT A J\n';
    script2 += 'NOT B T\n';
    script2 += 'OR T J\n';
    script2 += 'NOT C T\n';
    script2 += 'OR T J\n';
    script2 += 'AND D J\n'
    script2 += 'AND E T\n';
    script2 += 'OR H T\n';
    script2 += 'AND T J\n';
    script2 += 'RUN\n';
    await runSpringDroid(script2);

})();
