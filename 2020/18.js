const assert = require('assert').strict;
const { readInput } = require('../common/utils');

function evaluate(expr, priorityAddition = false) {
    const e = expr.replaceAll(' ', '').split('');
    let i = 0;

    function readToken() {
        let result;
        if (e[i] === '(') {
            i++;
            result = readExpr();
        } else {
            result = parseInt(e[i]);
        }
        i++;
        if (priorityAddition && e[i] === '+') {
            i++;
            result += readToken();
        }
        return result;
    }

    function readExpr() {
        let result = 0;
        let op = '+'
        while (i < e.length && e[i] !== ')') {
            switch (e[i]) {
                case '+':
                case '*':
                    op = e[i];
                    i++;
                    break;
                default:
                    const n = readToken();
                    if (op === '+') {
                        result += n;
                    } else {
                        result *= n;
                    }
            }
        }
        return result;
    }

    return readExpr();
}

function sumHomework(homework, ev) {
    return homework.map(ev).reduce((a, b) => a + b);
}

function part1(homework) {
    return sumHomework(homework, e => evaluate(e));
}

function part2(homework) {
    return sumHomework(homework, e => evaluate(e, true));
}


assert.strictEqual(evaluate('1 + 2 * 3 + 4 * 5 + 6'), 71);
assert.strictEqual(evaluate('1 + (2 * 3) + (4 * (5 + 6))'), 51);
assert.strictEqual(evaluate('2 * 3 + (4 * 5)'), 26);

assert.strictEqual(evaluate('1 + 2 * 3 + 4 * 5 + 6', true), 231);
assert.strictEqual(evaluate('1 + (2 * 3) + (4 * (5 + 6))', true), 51);
assert.strictEqual(evaluate('2 * 3 + (4 * 5)', true), 46);

const homework = readInput(__dirname, '18.txt');
console.log(part1(homework));
console.log(part2(homework));
