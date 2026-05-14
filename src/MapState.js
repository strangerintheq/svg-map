import {Rotation} from "./Rotation.js";
import {MapViewport} from "./MapViewport.js";
import {TilePyramid} from "./TilePyramid.js";

const {PI, sin, cos, log, tan, hypot, atan2, max, log2, exp, atan, floor, pow, sqrt, asin} = Math;

export class MapState {
    x = 0;
    y = 0;
    z = 1;
    viewport;
    width;
    height;
    baseSize = 256;
    heading = new Rotation(44);
    tiles = new TilePyramid();
    repaintRequested;
    centerLat;
    centerLon;

    constructor(viewportPad) {
        this.viewport = new MapViewport(viewportPad);
    }

    updateBounds(parentElement) {
        this.width = parentElement.clientWidth;
        this.height = parentElement.clientHeight;
        this.viewport.update(this.width, this.height)
    }

    project(lat, lon) {
        const {x, y, z, baseSize} = this;
        const s = baseSize / 2 * z;
        lat = -log(tan(PI / 4 + lat / 360 * PI))
        return [lon / 180 * s + x, lat / PI * s + y];
    }

    unProject(px, py, target = []) {
        const {x, y, z, baseSize} = this;
        const s = baseSize / 2 * z;
        const lat = PI / 4 - atan(exp((py - y) / s * PI))
        target[0] = lat / PI * 360;
        target[1] = (px - x) / s * 180
        return target
    }
}
