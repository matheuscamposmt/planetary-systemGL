class Force {
    calculate(object1, object2) {
        // Placeholder method, does nothing
    }
}

class GravityForce extends Force {
    G = 6.67430e-11; // Gravitational constant in m^3 kg^-1 s^-2

    constructor() {
        super();
    }

    calculate(obj1, obj2) {
        let r = vec3.create();
        vec3.sub(r, obj2.position, obj1.position);
        let distance = vec3.length(r);
        let forceMagnitude = (G * obj1.mass * obj2.mass) / (distance * distance);
        
        vec3.normalize(r, r);
        let force = vec3.create();
        vec3.scale(force, r, forceMagnitude);
    
        return force;
    }
    
}


function applyForces(objects, Force) {
    objects.forEach((obj1, i) => {
        objects.forEach((obj2, j) => {
            if (i !== j) {
                if (obj1 instanceof Sun) {
                    // Skip the Sun's acceleration update
                    return;
                }
                let force = Force.calculate(obj1, obj2);
                let acceleration1 = vec3.create();
                let acceleration2 = vec3.create();

                vec3.scale(acceleration1, force, 1 / obj1.mass);

                // Apply the acceleration to obj1
                vec3.add(obj1.acceleration, obj1.acceleration, acceleration1);

                // Only apply acceleration to obj2 if it's not the Sun
                if (!(obj2 instanceof Sun)) {
                    vec3.scale(acceleration2, force, -1 / obj2.mass);
                    vec3.add(obj2.acceleration, obj2.acceleration, acceleration2);
                }
            }
        });
    });
}
