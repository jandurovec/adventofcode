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
            for (let alternative of rule) {
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

function getBounds(n, rules) {
    const rule = rules.get(n);

    if (Array.isArray(rule)) {
        return rule.reduce((agg, r) => {
            const cur = r.reduce(
                (sum, rr) => {
                    const b = getBounds(rr, rules);
                    return {
                        min: sum.min + b.min,
                        max: sum.max + b.max
                    }
                },
                { min: 0, max: 0 });
            return {
                min: Math.min(agg.min, cur.min),
                max: Math.max(agg.max, cur.max)
            }
        },
            { min: Infinity, max: 0 });
    } else {
        return {
            min: rule.length,
            max: rule.length
        }
    }
}

function part1(filename) {
    const { rules, messages } = parseInput(filename);
    return messages.map(m => match(m, rules) ? 1 : 0).reduce((a, b) => a + b);
}

function part2(filename) {
    const { rules, messages } = parseInput(filename);

    /**
     * Rule update means that the message should match n * 42 followed by m * 31 (n > m; m > 0)
     */
    function match2(m) {
        const bounds42 = getBounds('42', rules);
        const bounds31 = getBounds('31', rules);

        let n31 = 1;
        while ((n31 + 1) * bounds42.min + n31 * bounds31.min <= m.length) {
            let n42 = n31 + 1;
            while (n42 * bounds42.min + n31 * bounds31.min <= m.length) {
                if (n42 * bounds42.max + n31 * bounds31.max >= m.length) {
                    const rule0 = [];
                    for (let i = 0; i < n42; i++) {
                        rule0.push('42');
                    }
                    for (let i = 0; i < n31; i++) {
                        rule0.push('31');
                    }
                    rules.set('0', [rule0]);
                    if (match(m, rules)) {
                        return true;
                    }
                }
                n42++;
            }
            n31++;
        }
        return false;
    }

    return messages.map(m => match2(m, rules) ? 1 : 0).reduce((a, b) => a + b);
}

assert.strictEqual(part1('19-sample1.txt'), 2);
assert.strictEqual(part1('19-sample2.txt'), 3);

assert.strictEqual(part2('19-sample2.txt'), 12);

console.log(part1('19.txt'));
console.log(part2('19.txt'));
