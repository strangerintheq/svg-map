import {html} from './utils.js'
import {MapState} from "./MapState.js";
import {MapInteraction} from "./MapInteraction.js";

const debug = {
    viewportPad: 0
}

export class SvgMap {

    element = html(`
        <svg>
            <g class="layers"></g>
            <rect class="debug" fill="none" stroke="red"></rect>
        </svg>
    `);
    state = new MapState(debug.viewportPad);

    layers = [];

    constructor(container) {
        container = typeof container === "string" ? document.querySelector(container) : container;
        new ResizeObserver(() => this.resize()).observe(container)
        container.appendChild(this.element);
        container.style.touchAction = "none";
        this.resize();
        new MapInteraction(this)
    }

    resize() {
        if (!this.element.parentElement)
            return
        this.state.updateBounds(this.element.parentElement)
        let svg = this.element;
        let {width:w, height:h, viewport} = this.state;
        svg.setAttribute("viewBox", [-w / 2, -h / 2, w, h].toString());
        svg.setAttribute("width", w + "px");
        svg.setAttribute("height", h + "px");
        // setCenter(center.lat, center.lon);
        if (debug.viewportPad) {
            let rect = svg.querySelector(".debug");
            rect.setAttribute("width" , w - debug.viewportPad*2)
            rect.setAttribute("height" , h - debug.viewportPad*2)
            rect.setAttribute("x", viewport.left)
            rect.setAttribute("y", viewport.top)
        }
        this.requestRepaint();
    }

    addLayer(layer) {
        this.layers.push(layer);
        this.element.querySelector("g.layers")
            .appendChild(layer.element);
    }

    removeLayer(layer) {
        let index = this.layers.indexOf(layer);
        if (index === -1)
            return
        this.layers.splice(index,1)
        this.element.querySelector("g.layers")
            .removeChild(layer.element)
    }

    requestRepaint() {
        if (!this.state.repaintRequested)
            requestAnimationFrame(this.repaint.bind(this));
        this.state.repaintRequested = true;
    }

    repaint() {
        let deg = this.state.heading.angle * 180 / Math.PI
        this.element.querySelector("g")
            .setAttribute("transform", `rotate(${deg})`)
        this.state.tiles.calc(this.state);
        this.layers.forEach(l => l.repaintLayer(this.state));
        this.state.repaintRequested = false;
    }

    setHeading() {

    }
}
