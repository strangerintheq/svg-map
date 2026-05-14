import {TiledMapLayer} from "./TiledMapLayer.js";

let arcGisLoadFn = (z, x, y) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;


export class ImageTiledMapLayer extends TiledMapLayer {

    constructor() {
        super();
    }

    createTile(mapState, z, x, y) {
        let img = document.createElementNS("http://www.w3.org/2000/svg", "image");
        img.setAttribute("href", arcGisLoadFn(z,x,y));
        return img
    }
}