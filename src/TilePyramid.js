export class TilePyramid {

    tiles;

    constructor() {
    }

    calc(state) {
        let s = state.baseSize * state.z;
        this.tiles = [tile(state.x, state.y, s, 0, 0, 0)];
        for (let i = 1; i < log2(state.z); i++)
            this.tiles = this.tiles.map(subdivide).flat().filter(inViewport);
        // tiles = tiles.concat(tiles.map(subdivide).flat().filter(inViewport))
        // tiles.forEach(drawTile);
        // let actualTilesKeys = tiles.map(tileKey);

        // Object.keys(tilesCache)
        //     .filter(key => !actualTilesKeys.includes(key))
        //     .forEach(key => {
        //         tilesCache[key].removeAttribute("href"); // stop loading
        //         delete tilesCache[key];
        //     });

        function inViewport({x, y, s}) {
            let o1 = { // tile
                x, y, w: s, h: s, cos: 1, sin: 0 // zero rotation
            }
            let o2 = { // viewport
                x: 0, y: 0,
                w: state.viewport.width,
                h: state.viewport.height,
                cos: state.heading.cs,
                sin: -state.heading.sn
            }
            return rectsIntersect(o1, o2);
        }

        // console.log(this.tiles)
    }
}

function tile(x, y, s, tz, tx, ty) {
    return {x, y, s, tz, tx, ty};
}

function subdivide({x, y, s, tz, tx, ty}) {
    let d = s / 2, t = d / 2, TZ = tz + 1,
        TX = tx * 2, TY = ty * 2;
    return [
        tile(x - t, y - t, d, TZ, TX, TY),
        tile(x + t, y - t, d, TZ, TX + 1, TY),
        tile(x + t, y + t, d, TZ, TX + 1, TY + 1),
        tile(x - t, y + t, d, TZ, TX, TY + 1)
    ];
}

