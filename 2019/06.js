const assert = require('assert').strict;
const utils = require('../common/utils');

function solve(filename) {
    const orbitMap = {
        COM: {
            orbits: 0
        }
    };

    const input = utils.readInput(__dirname, filename).map(x => x.split(')'));
    input.forEach(e => {
        const orbits = !!orbitMap[e[0]] && orbitMap[e[0]].orbits >= 0 ? orbitMap[e[0]].orbits + 1 : -1;
        orbitMap[e[1]] = {
            prev: e[0],
            orbits: orbits
        }
    });

    function populateOrbits(x) {
        if (orbitMap[x].orbits == -1) {
            orbitMap[x].orbits = populateOrbits(orbitMap[x].prev) + 1;
        }
        return orbitMap[x].orbits;
    }
    Object.keys(orbitMap).forEach(x => populateOrbits(x));

    const visited = {};
    function populateVisitedObjectsToRoot(x) {
        let obj = orbitMap[x];
        while(!!obj) {
            visited[obj.prev] = visited[obj.prev] > 0 ? visited[obj.prev] + 1 : 1;
            obj = orbitMap[obj.prev];
        }
    }
    populateVisitedObjectsToRoot('YOU');
    populateVisitedObjectsToRoot('SAN');

    return {
        part1: Object.keys(orbitMap).map(k => orbitMap[k].orbits).reduce((prev, curr) => prev + curr, 0),
        part2: Object.keys(visited).map(k => visited[k]).filter(x => x == 1).reduce((prev, curr) => prev + curr, 0)
    }
}

assert.strictEqual(solve('06-sample1.txt').part1, 42);
assert.strictEqual(solve('06-sample2.txt').part2, 4);

console.log(solve('06.txt'));
