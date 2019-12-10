const assert = require('assert').strict;
const utils = require('../common/utils');

const ASTEROID = '#';

function getInput(filename) {
    return utils.readInput(__dirname, filename).map(x => x.split(''));
}

function calculatePosition(originX, originY, x, y) {
    return {
        x,
        y,
        dist: utils.manhattanDistance(originX, originY, x, y),
        angle: -Math.atan2(y - originY, x - originX)
    }
}

function calculateAsteroidPositions(starMap, originX, originY) {
    const result = [], h = starMap.length, w = starMap[0].length;
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (starMap[i][j] == ASTEROID) {
                const pos = calculatePosition(originX, originY, i, j);
                if (pos.dist > 0) {
                    result.push(pos);
                }
            }
        }
    }
    return result;
}

function getVisibleAsteroids(starMap, originX, originY) {
    const pos = calculateAsteroidPositions(starMap, originX, originY).sort((a, b) => a.angle - b.angle);
    let angle = -4;
    const result = [];
    pos.forEach(p => {
        if (angle != p.angle) {
            result.push(p);
        }
        angle = p.angle;
    });
    return result;
}

function getVisibleAsteroidCount(starMap) {
    const result = [], h = starMap.length, w = starMap[0].length;
    for (let i = 0; i < h; i++) {
        result.push([]);
        for (let j = 0; j < w; j++) {
            if (starMap[i][j] == ASTEROID) {
                result[i].push(getVisibleAsteroids(starMap, i, j).length);
            } else {
                result[i].push(0);
            }

        }
    }
    return result;
}

function getVaporizationOrder(starMap, originX, originY) {
    const pos = calculateAsteroidPositions(starMap, originX, originY).sort((a, b) => {
        if (a.angle == b.angle) {
            return a.dist - b.dist;
        } else {
            return a.angle - b.angle;
        }
    });
    let angle = -4; // angle < -Math.PI
    let layer = 0;
    const withLayers = [];
    pos.forEach(p => {
        if (angle == p.angle) {
            layer++;
        } else {
            layer = 0;
            angle = p.angle;
        }
        withLayers.push({
            x: p.x,
            y: p.y,
            angle: p.angle,
            layer
        });
    });
    return withLayers.sort((a, b) => {
        if (a.layer == b.layer) {
            return a.angle - b.angle;
        } else {
            return a.layer - b.layer;
        }
    }).map(({ x, y }) => ({ x, y }));
}

function getStationLocation(starMap) {
    const counts = getVisibleAsteroidCount(starMap);
    const loc = {
        x: 0,
        y: 0,
        asteroids: 0,
    }
    const h = counts.length, w = counts[0].length;
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (counts[i][j] > loc.asteroids) {
                loc.x = i;
                loc.y = j;
                loc.asteroids = counts[i][j];
            }
        }
    }
    return loc;
}


assert.deepStrictEqual(getVisibleAsteroidCount(getInput('10-sample-1.txt')),
    [
        [0, 7, 0, 0, 7],
        [0, 0, 0, 0, 0],
        [6, 7, 7, 7, 5],
        [0, 0, 0, 0, 7],
        [0, 0, 0, 8, 7]
    ]
)
assert.deepStrictEqual(getStationLocation(getInput('10-sample-2.txt')).asteroids, 33);
assert.deepStrictEqual(getStationLocation(getInput('10-sample-3.txt')).asteroids, 35);
assert.deepStrictEqual(getStationLocation(getInput('10-sample-4.txt')).asteroids, 41);
assert.deepStrictEqual(getStationLocation(getInput('10-sample-5.txt')).asteroids, 210);

assert.deepStrictEqual(getVaporizationOrder(getInput('10-sample-6.txt'), 3, 8).slice(0, 9),
    [
        { x: 1, y: 8 },
        { x: 0, y: 9 },
        { x: 1, y: 9 },
        { x: 0, y: 10 },
        { x: 2, y: 9 },
        { x: 1, y: 11 },
        { x: 1, y: 12 },
        { x: 2, y: 11 },
        { x: 1, y: 15 }
    ]);
assert.deepStrictEqual(getVaporizationOrder(getInput('10-sample-5.txt'), 13, 11)[199], { x: 2, y: 8 });

const starMap = getInput('10.txt');
const stationLoc = getStationLocation(starMap);
console.log(stationLoc.asteroids);

const asteroid200 = getVaporizationOrder(starMap, stationLoc.x, stationLoc.y)[199];
// AoC has switched X/Y
console.log(100 * asteroid200.y + asteroid200.x);
