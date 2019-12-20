const assert = require('assert').strict;
const utils = require('../common/utils');
const Grid = require('../common/grid');

class DonutMaze {

    static isPortal(c) {
        return c >= 'A' && c <= 'Z';
    }
    static isPath(c) {
        return c === '.';
    }

    constructor(filename) {
        const input = utils.readInput(__dirname, filename);
        this.maze = new Grid();
        this.portals = new Map();

        const portalNames = new Map();

        let y = 0;
        input.forEach(row => {
            let x = 0;
            row.split('').forEach(c => {
                this.maze.set(x, y, c);
                if (DonutMaze.isPortal(c)) {
                    let portalPos, name;
                    if (DonutMaze.isPortal(this.maze.get(x - 1, y))) {
                        name = this.maze.get(x - 1, y) + this.maze.get(x, y);
                        if (DonutMaze.isPath(this.maze.get(x - 2, y))) {
                            portalPos = utils.pos(x - 2, y);
                        } else {
                            portalPos = utils.pos(x + 1, y);
                        }
                    } else if (DonutMaze.isPortal(this.maze.get(x, y - 1))) {
                        name = this.maze.get(x, y - 1) + this.maze.get(x, y);
                        if (DonutMaze.isPath(this.maze.get(x, y - 2))) {
                            portalPos = utils.pos(x, y - 2);
                        } else {
                            portalPos = utils.pos(x, y + 1);
                        }
                    }
                    if (name !== undefined) {
                        const otherEnd = portalNames.get(name);
                        if (otherEnd !== undefined) {
                            this.portals.set(portalPos, otherEnd);
                            this.portals.set(otherEnd, portalPos);
                        } else {
                            portalNames.set(name, portalPos);
                        }
                    }
                }
                x++;
            })
            y++;
        });
        this.start = utils.parsePos(portalNames.get('AA'));
        this.end = utils.parsePos(portalNames.get('ZZ'));
    }

    isOuterPortal(x, y) {
        return x === 2 || y === 2 || x === this.maze.maxX - 2 || y === this.maze.maxY - 2;
    }

    checkTile(x, y, d, l, toExplore) {
        if (DonutMaze.isPath(this.maze.get(x, y))) {
            toExplore.push({ x, y, d, l });
        }
    }

    findShortestPath(recursive = false) {
        const toExplore = [{ ...this.start, d: 0, l: 0 }];
        const distances = [new Grid()];
        while (toExplore.length > 0) {
            const { x, y, d, l } = toExplore.shift();
            let dists = distances[l] !== undefined ? distances[l] : (distances[l] = new Grid());
            if (dists.get(x, y) === undefined) {
                dists.set(x, y, d);
                if (l === 0 && x == this.end.x && y === this.end.y) {
                    break;
                }
                this.checkTile(x - 1, y, d + 1, l, toExplore);
                this.checkTile(x + 1, y, d + 1, l, toExplore);
                this.checkTile(x, y - 1, d + 1, l, toExplore);
                this.checkTile(x, y + 1, d + 1, l, toExplore);
                const portal = this.portals.get(utils.pos(x, y));
                if (portal !== undefined) {
                    const { x: px, y: py } = utils.parsePos(portal);
                    if (recursive) {
                        if (this.isOuterPortal(x, y)) {
                            if (l > 0) {
                                toExplore.push({ x: px, y: py, d: d + 1, l: l - 1 });
                            }
                        } else {
                            toExplore.push({ x: px, y: py, d: d + 1, l: l + 1 });
                        }
                    } else {
                        toExplore.push({ x: px, y: py, d: d + 1, l });
                    }
                }
            }
        }
        return distances[0].get(this.end.x, this.end.y);
    }
}

assert.strictEqual(new DonutMaze('20-sample1.txt').findShortestPath(), 23);
assert.strictEqual(new DonutMaze('20-sample2.txt').findShortestPath(), 58);
assert.strictEqual(new DonutMaze('20-sample3.txt').findShortestPath(true), 396);

const maze = new DonutMaze('20.txt');
console.log(maze.findShortestPath());
console.log(maze.findShortestPath(true));
