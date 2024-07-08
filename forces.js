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

    apply(body1, body2) {
        let dx = body2.position[0] - body1.position[0];
        let dy = body2.position[1] - body1.position[1];
        let dz = body2.position[2] - body1.position[2];
        let distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
        let force = this.G * body1.mass * body2.mass / (distance * distance);
        let ax = force * dx / (body1.mass * distance);
        let ay = force * dy / (body1.mass * distance);
        let az = force * dz / (body1.mass * distance);
        body1.acceleration[0] += ax;
        body1.acceleration[1] += ay;
        body1.acceleration[2] += az;
        body2.acceleration[0] -= ax;
        body2.acceleration[1] -= ay;
        body2.acceleration[2] -= az;
      }
    
}
