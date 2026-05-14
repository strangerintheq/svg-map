const {PI, sin, cos, log, tan, hypot, atan2, max, log2, exp, atan, floor, pow, sqrt, asin} = Math;

export class MapInteraction {

    constructor(map) {
        let state = map.state
        let svg = map.element;
        let start, count = 0, pointers = {}, touchCfgChanged = false, listenersActivated = false;
        // svg.addEventListener("pointerdown", (e0) => {
        //     if (!clickCallbackFn)
        //         return
        //     const up = (e1) => {
        //         if (Math.hypot(e0.offsetX - e1.offsetX, e0.offsetY - e1.offsetY) < 3){
        //             let x = e1.offsetX - w / 2;
        //             let y = e1.offsetY - h / 2;
        //             let p = rotationTmp.applyRotation(x, y)
        //             clickCallbackFn(unProject(...p))
        //         }
        //         svg.removeEventListener("pointerup", up)
        //     }
        //     svg.addEventListener("pointerup", up)
        //
        // });
        svg.addEventListener("pointerdown", down);
        svg.addEventListener("wheel", e => {
            e.preventDefault()
            applyZoom(e.offsetX, e.offsetY, state.z, e.deltaY < 0 ? 1.1 : 0.9);
        });

        function down(e) {
            if (!listenersActivated) {
                addEventListener("pointermove", move);
                addEventListener("pointerup", up);
                listenersActivated = true;
            }
            if (e.isPrimary) {
                pointers = {};
                count = 0;
            }
            if (count === 2)
                return;
            count++;
            touchCfgChanged = true;
            let x = e.offsetX;
            let y = e.offsetY;
            pointers[e.pointerId] = {x, y, ex: x, ey: y};
            transform();
        }

        function move(e) {
            let p = pointers[e.pointerId];
            if (!p)
                return;
            let rect = map.element.getBoundingClientRect();
            p.ex = e.clientX - rect.x;
            p.ey = e.clientY - rect.y;
            transform();
        }

        function up(e) {
            if (!pointers[e.pointerId])
                return;
            count--;
            touchCfgChanged = true;
            delete pointers[e.pointerId];
            transform();
            if (count === 0) {
                removeEventListener("pointermove", move);
                removeEventListener("pointerup", up);
                listenersActivated = false;
            }
        }

        function transform() {
            let v = Object.values(pointers);
            let p0 = v[0];
            let p1 = v[1] || p0;
            if (p0) {
                if (touchCfgChanged) {
                    start = {x:state.x, y:state.y, z: state.z, a: state.heading.angle};
                    touchCfgChanged = false;
                    Object.values(pointers).forEach(p => {
                        p.x = p.ex;
                        p.y = p.ey
                    })
                }
                let x0 = p0.x / 2 + p1.x / 2;
                let y0 = p0.y / 2 + p1.y / 2;
                let x1 = p0.ex / 2 + p1.ex / 2;
                let y1 = p0.ey / 2 + p1.ey / 2;
                if (p0 !== p1) { // multi touch
                    let d0 = hypot(p0.x - p1.x, p0.y - p1.y);
                    let d1 = hypot(p0.ex - p1.ex, p0.ey - p1.ey);
                    let kz = d1 / d0;
                    state.x = start.x - x0 / kz + x1 / kz;
                    state.y = start.y - y0 / kz + y1 / kz;
                    applyZoom(x0, y0, start.z, kz);
                    let a0 = atan2(p1.y - p0.y, p1.x - p0.x);
                    let a1 = atan2(p1.ey - p0.ey, p1.ex - p0.ex);
                    state.heading = start.a + a1 - a0;
                } else { // mouse or single touch
                    let [x,y] = state.heading.applyRotation(x1-x0, y1-y0)
                    state.x = start.x +x;
                    state.y = start.y +y;
                }
                map.requestRepaint()
            } else {
                start = null;
            }
            updateCenter()
        }

        function applyZoom(x0, y0, startZ, kz) {
            if (startZ * kz > 2 ** 20 || startZ * kz < 1)
                return
            x0 -= state.width / 2;
            y0 -= state.height / 2;
            [x0, y0] = state.heading.applyRotation(x0, y0)
            let r = atan2(state.y - y0, state.x - x0);
            let d = hypot(state.x - x0 , state.y - y0 ) * kz;
            state.x = cos(r) * d + x0 ;
            state.y = sin(r) * d + y0 ;
            state.z = startZ * kz;
            updateCenter()
            map.requestRepaint()
        }

        function updateCenter() {
            let [newLat, newLon] = state.unProject(0, 0);
            state.centerLat = newLat;
            state.centerLon = newLon
        }

    }
}