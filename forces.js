class Force {
    apply(object1, object2) {
        // Placeholder method, does nothing
    }
}

class GravityForce extends Force {
    G = 6.67430e-11; // Gravitational constant in m^3 kg^-1 s^-2

    constructor() {
        super();
    }

    apply(object1, object2) {

        let r = vec3.create();
        vec3.sub(r, object2.position, object1.position);
        let rLength = vec3.length(r);
        let rNorm = vec3.create();
        vec3.normalize(rNorm, r);

        let force = vec3.create();
        let forceMagnitude = this.G * object1.mass * object2.mass / Math.pow(rLength, 2);

        vec3.scale(force, rNorm, forceMagnitude);

        vec3.scaleAndAdd(object1.acceleration, object1.acceleration, force, 1 / object1.mass);
        vec3.scaleAndAdd(object2.acceleration, object2.acceleration, force, -1 / object2.mass);


        }
}
