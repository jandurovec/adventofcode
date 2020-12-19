const assert = require('assert').strict;
const { NEWLINE_REGEX, readInput } = require('../common/utils');

function parseInput(filename) {
    const [_, ruleStr, messageStr] = readInput(__dirname, filename, /(.*[^\r\n])\r?\n\r?\n(.*)/s);

    const rules = new Map();
    for (r of ruleStr.split(NEWLINE_REGEX)) {
        const [no, rule] = r.split(': ');
        if (rule.match(/".*"/)) {
            rules.set(no, rule.replaceAll('"', ''));
        } else {
            rules.set(no, rule.split(' | ').map(r => r.split(' ')));
        }
    }

    return {
        rules,
        messages: messageStr.split(NEWLINE_REGEX)
    }
}

function match(s, rules) {
    let i = 0;

    function matchSub(n) {
        const origI = i;

        const rule = rules.get(n);
        if (Array.isArray(rule)) {
            for(let alternative of rule) {
                i = origI;
                let j = 0;
                while (j < alternative.length && matchSub(alternative[j])) {
                    j++
                }
                if (j === alternative.length) {
                    return true;
                }
            }
            i = origI;
            return false;
        } else {
            if (s.charAt(i) === rule) {
                i++;
                return true;
            } else {
                return false;
            }
        }
    }

    return matchSub('0') && i === s.length;
}

function part1(filename) {
    const {rules, messages} = parseInput(filename);
    return messages.map(m => match(m, rules) ? 1 : 0).reduce((a, b) => a + b);
}

assert.strictEqual(part1('19-sample.txt'), 2);

console.log(part1('19.txt'));
