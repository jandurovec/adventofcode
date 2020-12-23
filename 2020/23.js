const assert = require('assert').strict;

function play(cups, moves) {
    const cupMap = new Map();
    let current = cups[0];
    for (let i = 0; i < cups.length; i++) {
        const val = cups[i];
        const next = cups[(i + 1) % cups.length];
        cupMap.set(val, next);
    }

    for (let i = 0; i < moves; i++) {
        const selected = new Set();

        // detach three cups
        let head = cupMap.get(current);
        let tail = current;
        for (let j = 0; j < 3; j++) {
            tail = cupMap.get(tail);
            selected.add(tail);
        }
        cupMap.set(current, cupMap.get(tail));

        // find destination
        let destination = 1 + (current + cups.length - 2) % cups.length;
        while (selected.has(destination)) {
            destination = 1 + (destination + cups.length - 2) % cups.length;
        }

        // attach
        cupMap.set(tail, cupMap.get(destination));
        cupMap.set(destination, head);

        // shift current
        current = cupMap.get(current);
    }

    return cupMap;
}

function part1(cups, moves) {
    const resultMap = play(cups.split('').map(n => parseInt(n)), moves);

    let result = '';
    let cup = 1;
    for (let i = 0; i < cups.length - 1; i++) {
        cup = resultMap.get(cup);
        result += cup;
    }
    return result;
}

function part2(cups) {
    const input = cups.split('').map(n => parseInt(n));
    for(let i = cups.length + 1; i <= 1000000; i++) {
        input.push(i);
    }

    const resultMap = play(input, 10000000);

    let result = 1;
    let cup = 1;
    for (let i = 0; i < 2; i++) {
        cup = resultMap.get(cup);
        result *= cup;
    }
    return result;
}

assert.strictEqual(part1('389125467', 10), '92658374');
assert.strictEqual(part1('389125467', 100), '67384529');
assert.strictEqual(part2('389125467'), 149245887792);

console.log(part1('872495136', 100));
console.log(part2('872495136'));
