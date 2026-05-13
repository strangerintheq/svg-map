const {PI, sin, cos, log, tan, hypot, atan2, max, log2, exp, atan, floor, pow, sqrt, asin} = Math;
const earthRadius = 6371e3;
const asRadians = PI / 180;
const asDegrees = 180 / PI;

function haversineDistance(from, to) {
    const phi1 = from.lat * asRadians, phi2 = to.lat * asRadians;
    const dPhi = phi2 - phi1, dLambda = (to.lon - from.lon) * asRadians;
    const a = pow(sin(dPhi / 2), 2) + cos(phi1) * cos(phi2) * pow(sin(dLambda / 2), 2);
    const c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return earthRadius * c; // km
}

function bearing(from, to) {
    const phi1 = from.lat * asRadians, phi2 = to.lat * asRadians;
    const dLambda = (to.lon - from.lon) * asRadians;
    const y = sin(dLambda) * cos(phi2);
    const x = cos(phi1) * sin(phi2) - sin(phi1) * cos(phi2) * cos(dLambda);
    return (atan2(y, x) * asDegrees + 360) % 360; // degrees
}

function destination(from, bearing, distance) {
    const phi1 = from.lat * asRadians, lambda1 = from.lon * asRadians, d = distance / earthRadius;
    const phi2 = asin(sin(phi1) * cos(d) + cos(phi1) * sin(d) * cos(bearing));
    const lambda2 = lambda1 + atan2(sin(bearing) * sin(d) * cos(phi1), cos(d) - sin(phi1) * sin(phi2));
    return {lat: phi2 * asDegrees, lon: lambda2 * asDegrees}
}

function interpolateGreatCircle(from, to, fraction) {
    let b = bearing(from, to);
    let d = haversineDistance(from, to);
    return destination(from, b*asRadians, d * fraction)
}

/**
 * Checks if two oriented rectangles intersect using SAT.
 * @param {Object} r1 { x, y, w, h, sin, cos }
 * @param {Object} r2 { x, y, w, h, sin, cos }
 */
function rectsIntersect(r1, r2) {
    const getVertices = (r) => {
        const { x, y, w, h, sin, cos } = r;
        const hw = w / 2, hh = h / 2;

        return [
            { x: x + (-hw * cos - -hh * sin), y: y + (-hw * sin + -hh * cos) },
            { x: x + ( hw * cos - -hh * sin), y: y + ( hw * sin + -hh * cos) },
            { x: x + ( hw * cos -  hh * sin), y: y + ( hw * sin +  hh * cos) },
            { x: x + (-hw * cos -  hh * sin), y: y + (-hw * sin +  hh * cos) }
        ];
    };

    const getAxes = (v) => [
        { x: v[1].x - v[0].x, y: v[1].y - v[0].y },
        { x: v[2].x - v[1].x, y: v[2].y - v[1].y }
    ];

    const v1 = getVertices(r1), v2 = getVertices(r2);
    const axes = [...getAxes(v1), ...getAxes(v2)];

    for (let axis of axes) {
        // Project both rects onto the axis
        const project = (vertices, a) => {
            const dots = vertices.map(v => v.x * a.x + v.y * a.y);
            return { min: Math.min(...dots), max: Math.max(...dots) };
        };

        const p1 = project(v1, axis);
        const p2 = project(v2, axis);

        // If there's no overlap on any axis, they don't intersect
        if (p1.max < p2.min || p2.max < p1.min) return false;
    }
    return true;
}
