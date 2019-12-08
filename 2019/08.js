const assert = require('assert').strict;
const utils = require('../common/utils');

function getLayers(filename, imgWidth, imgHeight) {
    const input = utils.readInput(__dirname, filename)[0].split('').map(n => parseInt(n));
    const layers = [];
    const layerSize = imgWidth * imgHeight
    while (input.length >= layerSize) {
        layers.push(input.splice(0, layerSize));
    }
    return layers;
}

assert.deepStrictEqual(getLayers('08-sample1.txt', 3, 2), [[1, 2, 3, 4, 5, 6], [7, 8, 9, 0, 1, 2]]);

const IMG_W = 25;
const IMG_H = 6;
const LAYER_PIXELS = IMG_W * IMG_H;
const layers = getLayers('08.txt', IMG_W, IMG_H);

const minLayerCounts = layers.map(l => {
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
}, [LAYER_PIXELS, LAYER_PIXELS, LAYER_PIXELS]);

console.log(minLayerCounts[1] * minLayerCounts[2]);

function getImage(filename, imgWidth, imgHeight) {
    const layers = getLayers(filename, imgWidth, imgHeight);
    const emptyImg = [];
    for (let i = 0; i < imgHeight; i++) {
        emptyImg.push([]);
        for (let j = 0; j < imgWidth; j++) {
            emptyImg[i][j] = 2;
        }
    }
    return layers.reduce((agg, l) => {
        for (let i = 0; i < imgHeight; i++) {
            for (let j = 0; j < imgWidth; j++) {
                if (agg[i][j] == 2) {
                    agg[i][j] = l[i * imgWidth + j];
                }
            }
        }
        return agg;
    }, emptyImg);

}

assert.deepStrictEqual(getImage('08-sample2.txt', 2, 2), [[0, 1], [1, 0]]);

getImage('08.txt', IMG_W, IMG_H).forEach(row => {
    console.log(row.map(pix => {
        switch (pix) {
            case 1:
                return '\u25AE';
            default:
                return ' ';
        }
    }).join(''));
});
