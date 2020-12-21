const assert = require('assert').strict;
const { readInput } = require('../common/utils');

function parseInput(filename) {
    const lines = readInput(__dirname, filename);
    const foodList = [];
    for (l of lines) {
        const [_, ingredients, allergens] = l.match(/(.*) \(contains (.*)\)/);
        foodList.push({
            ingredients: ingredients.split(' '),
            allergens: allergens.split(', ')
        })
    }
    return foodList;
}

function getData(filename) {
    const foodList = parseInput(filename);
    const allergenCandidates = new Map();
    for (f of foodList) {
        for (a of f.allergens) {
            const ingr = new Set(f.ingredients);
            if (allergenCandidates.has(a)) {
                const current = allergenCandidates.get(a);
                for (i of current) {
                    if (!ingr.has(i)) {
                        current.delete(i);
                    }
                }
            } else {
                allergenCandidates.set(a, ingr);
            }
        }
    }

    const safeIngredients = new Set(foodList.flatMap(f => f.ingredients));
    for (i of allergenCandidates.values()) {
        for (ii of i.values()) {
            safeIngredients.delete(ii);
        }
    }

    return {
        foodList,
        allergenCandidates,
        safeIngredients
    }
}

function part1(filename) {
    const {foodList, allergenCandidates, safeIngredients} = getData(filename);

    let result = 0;
    for (f of foodList) {
        result += f.ingredients.filter(i => safeIngredients.has(i)).length;
    }

    return result;
}

function part2(filename) {
    const allergenCandidates = getData(filename).allergenCandidates;

    const allergenMap = new Map();
    while (allergenCandidates.size > 0) {
        for (const [allergen, v] of allergenCandidates) {
            if (v.size === 1) {
                const local = v.values().next().value;
                allergenMap.set(allergen, local);
                allergenCandidates.delete(allergen);
                for (const vv of allergenCandidates.values()) {
                    vv.delete(local);
                }
                break;
            }
        }
    }

    return [...allergenMap.entries()]
        .sort((a, b) => (a[0] > b[0]) ? 1 : -1)
        .map(([allergen, ingredient]) => ingredient)
        .join(',');
}

assert.strictEqual(part1('21-sample.txt'), 5);
assert.strictEqual(part2('21-sample.txt'), "mxmxvkd,sqjhc,fvjkl");

console.log(part1('21.txt'));
console.log(part2('21.txt'));
