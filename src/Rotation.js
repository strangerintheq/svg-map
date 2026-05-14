export class Rotation {
    angle;
    cs;
    sn;

    constructor(angleDeg) {
        this.setDeg(angleDeg)
    }

    setDeg(angleDeg) {
        this.setRad(angleDeg / 180 * Math.PI)
    }

    setRad(angleRad) {
        this.angle = angleRad;
        this.cs = Math.cos(angleRad);
        this.sn = Math.sin(angleRad);
    }

    applyRotation(x, y, sign = 1, target = []) {
        target[0] = this.cs * x + this.sn * y * sign;
        target[1] = -this.sn * x * sign + this.cs * y;
        return target;
    }
}
