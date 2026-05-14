import {TiledMapLayer} from "./TiledMapLayer.js";
import {svg} from '../utils.js'

let mvt = (z, x, y) => `https://api.maptiler.com/tiles/v3/${z}/${x}/${y}.pbf?key=${maptiler_api_key}`

let colors = {
    crop: "#ffffff",
    snow: "#f0fffd",
    ice: "#d9edff",
    ocean: "#93d2ee",
    lake: "#93d2ee",
    // grass: "#b4e0a4",
    // scrub: "#a4e0c0",
    // tree: "#a4e0c0",
    // forest: "#a4e0c0",
    residential: "#e0d8a4",
    national_park: "#cae0a4",
    wood: "#cae0a4",
    grass: "#cae0a4",
    farmland: "#e0cfa4",
    wetland: "#ace0a4",
    sand: "#e0d4a4",
    rock: "#cec386",
    // protected_area: "#ffdbdb",
}

let layers = {
    transportation: "#9bc7d7",
    park: "#cae0a4",
    water: "#93d2ee",
    landuse: "#e0d8a450",
    building: "#c5c5c5"
}


export class VectorTiledMapLayer extends TiledMapLayer {
    constructor() {
        super();
    }

    createTile(mapState, z, x, y) {
        const img = svg(`<svg width="256" height="256" viewBox="0,0,256,256"></svg>`)
        function getColor(layerName, feature){
            let cl = feature._values[feature._keys.indexOf("class")];
            let col = layers[layerName]
            if (col)
                return col
            col = colors[cl]
            if (col) {
                return col
            }
            return "magenta"
        }

        fetch(mvt(z,x,y)).then(r => r.arrayBuffer()).then(rawResponse => {
            let tileData = ""
            let pbf = new Pbf(rawResponse);
            let tile = new VectorTile(pbf);
            let n=0
            for (let layerName in tile.layers) {
                let layer = tile.layers[layerName];
                let k = 256 / layer.extent;
                for (let i = 0; i < layer.length; i++) {
                    let feature = layer.feature(i)
                    let geom = feature.loadGeometry();
                    if (feature.toGeoJSON().geometry.type === "MultiPolygon" || feature.toGeoJSON().geometry.type === "Polygon") {
                        // let color = getColor(layerName, feature)
                        // geom.forEach(ring => {
                        //     tileData += `<path fill="${color}" d="${'M' + ring.map(({x,y}) => [(x * k).toFixed(2), (y * k).toFixed(1)]).join("L") + "Z"}"></path>`
                        // })
                    }
                    if (feature.toGeoJSON().geometry.type === "Point") {
                        if (!feature.properties.name)
                            continue
                        n++
                        let x = geom[0][0].x*k
                        let y = geom[0][0].y*k
                        let a = -mapState.heading.angle/Math.PI*180;
                        tileData += `<g transform="translate(${x},${y})">
                            <circle r=2 ></circle>
                            <text style="font-size: 10px" fill="white" transform="rotate(${a})">${feature.properties.name}</text>
                        </g>`
                    }
                }
            }
            console.log(n)
            img.innerHTML += tileData
        });
        return img
    }
}