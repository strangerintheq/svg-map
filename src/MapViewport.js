export class MapViewport {

    left;
    top;
    right;
    bottom;
    width;
    height;
    viewportPad;

    constructor(viewportPad) {
        this.viewportPad = viewportPad;
    }

    update(w, h) {
        this.left = -w / 2 + this.viewportPad;
        this.top = -h / 2 + this.viewportPad;
        this.right = w / 2 - this.viewportPad;
        this.bottom = h / 2 - this.viewportPad;
        this.width = w - this.viewportPad * 2;
        this.height = h - this.viewportPad * 2;
    }
}
