const utils = require('../common/utils');
const Grid = require('../common/grid');
const BlockingQueue = require('../common/blocking-queue');
const IntcodeComputer = require('./intcode-computer');

const WALL = '#', FREE = '.', OXYGEN = 'O';

async function constructMap(filename) {
    const toExplore = [
        { x: 0, y: 0, path: [] }
    ];

    const map = new Grid();
    map.set(0, 0, { surface: FREE, moves: 0 });

    function getStepBack(step) {
        switch (step) {
            case 1: return 2;
            case 2: return 1;
            case 3: return 4;
            case 4: return 3;
            default: throw new Error(`Unknown step ${step}`);
        }
    }

    const cpuInput = new BlockingQueue();
    const cpuOutput = new BlockingQueue();

    async function move(path) {
        const pathBack = [];
        for (let i = 0; i < path.length; i++) {
            cpuInput.enqueue(path[i]);
            const res = await cpuOutput.dequeue();
            if (res != 1) {
                throw new Error(`Unexpected error code "${res}"`);
            }
            pathBack.unshift(getStepBack(path[i]));
        }
        return pathBack;
    }

    async function check(prefix, lastMove, destX, destY, moves) {
        if (map.get(destX, destY) === undefined) {
            cpuInput.enqueue(lastMove);
            const moveRes = await cpuOutput.dequeue();
            if (moveRes == 0) {
                map.set(destX, destY, { surface: WALL, moves });
            } else {
                switch (moveRes) {
                    case 1:
                        map.set(destX, destY, { surface: FREE, moves });
                        toExplore.push({
                            x: destX,
                            y: destY,
                            path: [...prefix, lastMove]
                        });
                        break;
                    case 2:
                        map.set(destX, destY, { surface: OXYGEN, moves });
                        break;
                    default:
                        throw new Error(`Unexpected computer output: ${moveRes}`);
                }
                move([getStepBack(lastMove)]);
            }
        }
    }

    async function explore(loc) {
        const pathBack = await move(loc.path);
        const moves = map.get(loc.x, loc.y).moves;
        await check(loc.path, 1, loc.x, loc.y - 1, moves + 1);
        await check(loc.path, 2, loc.x, loc.y + 1, moves + 1);
        await check(loc.path, 3, loc.x - 1, loc.y, moves + 1);
        await check(loc.path, 4, loc.x + 1, loc.y, moves + 1);
        await move(pathBack);
    }

    const prg = utils.readInput(__dirname, filename)[0].split(',').map(n => parseInt(n));
    const comp = new IntcodeComputer(prg, () => cpuInput.dequeue(), n => cpuOutput.enqueue(n));
    comp.run();

    while (toExplore.length > 0) {
        await explore(toExplore.shift());
    }

    return {
        map,
        oxygen: map.entries.find(e => e.value.surface === OXYGEN)
    };
}

function fillOxygen(map, startX, startY) {
    let totalMinutes = 0;
    const toExplore = [{ x: startX, y: startY, minutes: 0 }]

    function check(x, y, minutes) {
        if (map.get(x, y).surface === FREE && map.get(x, y).minutes === undefined) {
            totalMinutes = minutes;
            toExplore.push({ x, y, minutes });
        }
    }

    while (toExplore.length > 0) {
        const curr = toExplore.shift();
        map.get(curr.x, curr.y).minutes = curr.minutes;
        check(curr.x - 1, curr.y, curr.minutes + 1);
        check(curr.x + 1, curr.y, curr.minutes + 1);
        check(curr.x, curr.y - 1, curr.minutes + 1);
        check(curr.x, curr.y + 1, curr.minutes + 1);
    }

    return totalMinutes;
}

(async function () {
    const shipData = await constructMap('15.txt');
    console.log(shipData.map.get(shipData.oxygen.x, shipData.oxygen.y).moves);
    console.log(fillOxygen(shipData.map, shipData.oxygen.x, shipData.oxygen.y));
})();
