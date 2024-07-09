const G = 6.67430e-11;  // m^3 kg^-1 s^-2
const M_sun = 1.989e30;  // kg
const M_earth = 5.972e24;  // kg
const AU = 1.496 * Math.pow(10, 11);
const day = 86400;

// The length of one AU (Earth-Sun distance) in pixels.
const pixelsInOneEarthSunDistancePerPixel = 120;
// A factor by which we scale the distance between the Sun and the Earth
// in order to show it on screen
const scaleFactor = AU / pixelsInOneEarthSunDistancePerPixel;


class CelestialObject {
    constructor(app, radius, color, texture) {
        this.app = app;
        this.gl = app.gl;
        this.program = app.program;
        this.updateModelViewMatrix = app.updateModelViewMatrix;
        this.stack = new SimpleGLStack();
        this.radius = radius;
        this.color = color;
        this.texture = texture;
        this.planet = new WebGLSphere(this.gl, this.program, this.radius, 32, 32, this.color, this.texture);
        this.planetModel = this.planet.getWebGLModel();

        this.mass = 500_000;


        this.acceleration = vec3.create();
        this.velocity = vec3.create();
        this.position = vec3.create();
        this.scaledPosition = vec3.create();

        this.avg_speed = 0;
    }

    updatePosition(dt) {
        this.avg_speed = vec3.length(this.velocity);
        vec3.scaleAndAdd(this.velocity, this.velocity, this.acceleration, dt);
        vec3.scaleAndAdd(this.position, this.position, this.velocity, dt);
        vec3.scale(this.scaledPosition, this.position, 1 / scaleFactor);

    }

    draw(modelViewMatrix) {
        this.stack.push(mat4.clone(modelViewMatrix));
        this.updateModelViewMatrix(this.planetModel.program, modelViewMatrix, "uModelViewMatrix");
        this.planetModel.draw();
        modelViewMatrix = this.stack.pop();
        
    }
}



function distance(p1, p2) {
    let r = vec3.create();
    vec3.sub(r, p2.position, p1.position);
    return vec3.length(r);
}

class Sun extends CelestialObject {
    constructor(app) {
        super(app, 29.0, new Color(1.0, 1.0, 0.0, 1.0), "2k_sun.jpg");
        this.mass = 1.989e30;

        // Sun at the origin
        this.position = vec3.fromValues(0.0, 0.0, 0.0);
        this.velocity = vec3.fromValues(0.0, 0.0, 0.0);
    }
}

class Earth extends CelestialObject {
    constructor(app) {
        super(app, 10.0, new Color(1.0, 1.0, 1.0, 1.0), "2k_earth_daymap.jpg");
        
        this.mass = 5.972e24;

        // Earth at 1 AU from the Sun
        this.position = vec3.fromValues(AU, 0.0, 0.0);
        vec3.scale(this.scaledPosition, this.position, 1 / scaleFactor);

        // Velocity of Earth at 1 AU from the Sun
        this.velocity = vec3.fromValues(0.0, 29.783 * 1000, 0.0);
    }
}

class Mars extends CelestialObject {
    constructor(app) {
        super(app, 3.0, new Color(1.0, 0.0, 0.0, 1.0), "2k_mars.jpg");
        this.mass = 6.39e23;

        // Mars at 1.52 AU from the Sun
        this.position = vec3.fromValues(1.52 * AU, 0.0, 0.0);
        vec3.scale(this.scaledPosition, this.position, 1 / scaleFactor);

        // Velocity of Mars at 1.52 AU from the Sun
        this.velocity = vec3.fromValues(0.0, 24.077 * 1000, 0.0);
    }
}

class Mercury extends CelestialObject {
    constructor(app) {
        super(app, 2.0, new Color(0.5, 0.5, 0.5, 1.0), "2k_mercury.jpg");
        this.mass = 3.285e23;

        // Mercury at 0.39 AU from the Sun
        this.position = vec3.fromValues(0.39 * AU, 0.0, 0.0);
        vec3.scale(this.scaledPosition, this.position, 1 / scaleFactor);

        // Velocity of Mercury at 0.39 AU from the Sun
        this.velocity = vec3.fromValues(0.0, 47.87 * 1000, 0.0);
    }
}

class Venus extends CelestialObject {
    constructor(app) {
        super(app, 8.0, new Color(0.5, 0.5, 0.5, 1.0), "2k_venus_surface.jpg");
        this.mass = 4.867e24;

        // Venus at 0.72 AU from the Sun
        this.position = vec3.fromValues(0.72 * AU, 0.0, 0.0);
        vec3.scale(this.scaledPosition, this.position, 1 / scaleFactor);

        // Velocity of Venus at 0.72 AU from the Sun
        this.velocity = vec3.fromValues(0.0, 35.02 * 1000, 0.0);
    }
}

class Jupiter extends CelestialObject {
    constructor(app) {
        super(app, 26.0, new Color(0.5, 0.5, 0.5, 1.0), "2k_jupiter.jpg");
        this.mass = 1.898e27;

        // Jupiter at 5.20 AU from the Sun
        this.position = vec3.fromValues(5.20 * AU, 0.0, 0.0);
        vec3.scale(this.scaledPosition, this.position, 1 / scaleFactor);

        // Velocity of Jupiter at 5.20 AU from the Sun
        this.velocity = vec3.fromValues(0.0, 13.07 * 1000, 0.0);
    }
}

class Saturn extends CelestialObject {
    constructor(app) {
        super(app, 22.0, new Color(0.5, 0.5, 0.5, 1.0), "2k_saturn.jpg");
        this.mass = 5.683e26;

        // Saturn at 9.58 AU from the Sun
        this.position = vec3.fromValues(9.58 * AU, 0.0, 0.0);
        vec3.scale(this.scaledPosition, this.position, 1 / scaleFactor);

        // Velocity of Saturn at 9.58 AU from the Sun
        this.velocity = vec3.fromValues(0.0, 9.69 * 1000, 0.0);
    }
}

class Uranus extends CelestialObject {
    constructor(app) {
        super(app, 18.5, new Color(0.5, 0.5, 0.5, 1.0), "2k_uranus.jpg");
        this.mass = 8.681e25;

        // Uranus at 19.22 AU from the Sun
        this.position = vec3.fromValues(19.22 * AU, 0.0, 0.0);
        vec3.scale(this.scaledPosition, this.position, 1 / scaleFactor);

        // Velocity of Uranus at 19.22 AU from the Sun
        this.velocity = vec3.fromValues(0.0, 6.81 * 1000, 0.0);
    }
}

class Neptune extends CelestialObject {
    constructor(app) {
        super(app, 19.5, new Color(0.5, 0.5, 0.5, 1.0), "2k_neptune.jpg");
        this.mass = 1.024e26;

        // Neptune at 30.05 AU from the Sun
        this.position = vec3.fromValues(30.05 * AU, 0.0, 0.0);
        vec3.scale(this.scaledPosition, this.position, 1 / scaleFactor);

        // Velocity of Neptune at 30.05 AU from the Sun
        this.velocity = vec3.fromValues(0.0, 5.43 * 1000, 0.0);
    }
}


class Moon extends CelestialObject {
    constructor(app, earth) {
        super(app, 0.8, new Color(0.5, 0.5, 0.5, 1.0), "2k_moon.jpg");
        this.mass = 7.342e22;

        // Moon relative to Earth
        let moonDistanceFromEarth = 0.00257 * AU;
        this.position = vec3.fromValues(
            earth.position[0] + moonDistanceFromEarth,
            earth.position[1],
            earth.position[2]
        );
        vec3.scale(this.scaledPosition, this.position, 1 / scaleFactor);

        // Velocity of Moon relative to Earth
        let moonOrbitalVelocity = 1.022 * 1000;  // m/s
        this.velocity = vec3.fromValues(
            earth.velocity[0],
            earth.velocity[1] + moonOrbitalVelocity,
            earth.velocity[2]
        );
    }
}