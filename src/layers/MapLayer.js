import {svg} from '../utils.js'

export class MapLayer {

    element = svg(`<g class="${this.constructor.name}"></g>`)

    constructor() {

    }

    repaintLayer(mapState) {

    }

}