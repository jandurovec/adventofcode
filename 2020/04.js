const assert = require('assert').strict;
const utils = require('../common/utils');

const SEPARATOR = /\r?\n\r?\n/;

function parsePassports(passportData) {
    console.log(passportData);
    return passportData.map(p => {
        const passport = new Map();
        p.split(/\s+/).forEach(x => {
            [k, v] = x.split(':');
            passport.set(k, v);
        });
        return passport;
    });
}

function mandatoryFieldsPresent(passport) {
    for (field of ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']) {
        if (!passport.has(field)) {
            return false;
        }
    }
    return true;
}

function intInRange(n, l, from, to) {
    let result = true;
    result &&= n.length == l;
    let parsed = parseInt(n);
    result &&= (!!parsed) && parsed >= from && parsed <= to;
    return result;
}

function validValues(passport) {
    for ([k, v] of passport.entries()) {
        let result = true;
        switch (k) {
            case 'byr':
                result = intInRange(v, 4, 1920, 2002)
                break;
            case 'iyr':
                result = intInRange(v, 4, 2010, 2020)
                break;
            case 'eyr':
                result = intInRange(v, 4, 2020, 2030)
                break;
            case 'hgt':
                const match = v.match(/^([0-9]+)(cm|in)$/);
                result =
                    match !== null
                    && (match[2] === 'cm' ? intInRange(match[1], 3, 150, 193) : intInRange(match[1], 2, 59, 76));
                break;
            case 'hcl':
                result = /#[0-9a-f]{6}/.test(v);
                break;
            case 'ecl':
                result = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(v);
                break;
            case 'pid':
                result = intInRange(v, 9, 0, 999999999);
                break;
        }
        if (!result) {
            return false;
        }
    };
    return true;
}

function countValid(passports, validator) {
    return passports.map(validator).reduce((count, valid) => count + (valid ? 1 : 0), 0);
}

function countValidPart1(passports) {
    return countValid(passports, mandatoryFieldsPresent);
}

function countValidPart2(passports) {
    return countValid(passports, p => mandatoryFieldsPresent(p) && validValues(p));
}

assert.strictEqual(countValidPart1(parsePassports(utils.readInput(__dirname, '04-sample.txt', SEPARATOR))), 2);
assert.strictEqual(countValidPart2(parsePassports(utils.readInput(__dirname, '04-sample-invalid.txt', SEPARATOR))), 0);
assert.strictEqual(countValidPart2(parsePassports(utils.readInput(__dirname, '04-sample-valid.txt', SEPARATOR))), 4);

let passportData = utils.readInput(__dirname, '04.txt', SEPARATOR);
const passports = parsePassports(passportData);
console.log(countValidPart1(passports));
console.log(countValidPart2(passports));
