const utils = require('../common/utils');
const BlockingQueue = require('../common/blocking-queue');
const IntcodeComputer = require('./intcode-computer');

const PROG = utils.readInput(__dirname, '25.txt')[0].split(',').map(n => parseInt(n));
const ITEMS = ['jam', 'loom', 'mug', 'spool of cat6', 'prime number', 'food ration', 'fuel cell', 'manifold'];

const inputQueue = new BlockingQueue();

function command(cmd) {
    cmd.split('').map(c => c.charCodeAt(0)).forEach(c => {
        inputQueue.enqueue(c);
    });
    inputQueue.enqueue(10);
}

function withItems(what, itemFlags) {
    let idx = 0;
    while (itemFlags > 0) {
        if (itemFlags % 2 === 1) {
            command(`${what} ${ITEMS[idx]}`)
        }
        idx++;
        itemFlags >>= 1;
    }
}

const comp = new IntcodeComputer(PROG, async () => {
    const i = await inputQueue.dequeue();
    process.stdout.write(String.fromCharCode(i));
    return i;
}, n => process.stdout.write(String.fromCharCode(n)));
comp.run();

utils.readInput(__dirname, '25-collect-items.txt').forEach(line => {
    command(line);
})

for (let i = Math.pow(2, ITEMS.length) - 1; i > 0; i--) {
    withItems('drop', i);
    withItems('take', i - 1);
    command('north');
}
