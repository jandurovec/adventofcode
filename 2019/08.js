const assert = require('assert').strict;
const utils = require('../common/utils');

class Image {
    constructor(filename, w, h) {
        this.w = w;
        this.h = h;
        this.layerSize = w * h;
        this.data = utils.readInput(__dirname, filename)[0].split('').map(n => parseInt(n));
        if (this.data.length % (w * h) != 0) {
            throw new Error(`Invalid data length. Data length must be a multiple of ${w * h} but is ${this.data.length}.`);
        }
    }

    getLayers() {
        const layers = [];
        let i = 0;
        let layer;
        while ((layer = this.data.slice(i * this.layerSize, (i + 1) * this.layerSize)).length > 0) {
            layers.push(layer);
            i++
        }
        return layers;
    }

    getChecksum() {
        let minLayerCounts = this.getLayers().map(l => {
            return {
                data: l,
                count: l.reduce((agg, pixel) => {
                    agg[pixel]++;
                    return agg;
                }, [0, 0, 0])
            }
        }).reduce((min, l) => {
            if (l.count[0] < min[0]) {
                return l.count;
            } else {
                return min;
            }
        }, [this.layerSize, this.layerSize, this.layerSize]);
        return minLayerCounts[1] * minLayerCounts[2];
    }

    getPixel(row, col) {
        let i = row * this.w + col;
        while (i < this.data.length) {
            let pixel = this.data[i];
            if (pixel != 2) {
                return pixel;
            } else {
                i += this.layerSize;
            }
        }
    }

    getPixels() {
        const pixels = [];
        for (let i = 0; i < this.h; i++) {
            pixels.push([]);
            for (let j = 0; j < this.w; j++) {
                pixels[i][j] = this.getPixel(i, j);
            }
        }
        return pixels;
    }
}

assert.deepStrictEqual(new Image('08-sample1.txt', 3, 2).getLayers(), [[1, 2, 3, 4, 5, 6], [7, 8, 9, 0, 1, 2]]);

const img = new Image('08.txt', 25, 6);
console.log(img.getChecksum());

assert.deepStrictEqual(new Image('08-sample2.txt', 2, 2).getPixels(), [[0, 1], [1, 0]]);

img.getPixels().forEach(row => {
    console.log(row.map(pix => pix == 1 ? '\u25AE' : ' ').join(''));
});
