import {MapLayer} from "./MapLayer.js";

export class TiledMapLayer extends MapLayer {

    tilesCache = {};

    constructor() {
        super();
    }

    repaintLayer(mapState) {
        this.element.innerHTML = ""
        mapState.tiles.tiles.forEach(this.drawTile.bind(this, mapState))
    }

    drawTile(mapState, tile) {
        let {x, y, s, tx, ty, tz} = tile;
        let key = tileKey(tile);
        let img = this.tilesCache[key];
        if (!img) {
            img = this.tilesCache[key] = this.createTile(mapState, tz, tx, ty);
        }
        this.element.append(img);
        let tilePad = -0.1
        img.setAttribute("x", x - s / 2 + tilePad)
        img.setAttribute("y", y - s / 2 + tilePad)
        img.setAttribute("width", s - tilePad * 2)
        img.setAttribute("height", s - tilePad * 2)
    }

    createTile(mapState, z,x,y) {

    }
}

function tileKey({tx, ty, tz}) {
    return `x${tx}y${ty}z${tz}`;
}