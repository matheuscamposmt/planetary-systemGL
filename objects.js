const G = 6.67430e-11;  // m^3 kg^-1 s^-2
const M_sun = 1.989e30;  // kg
const M_earth = 5.972e24;  // kg
const AU = 1.496 * Math.pow(10, 11);
const day = 86400;

// The length of one AU (Earth-Sun distance) in pixels.
const pixelsInOneEarthSunDistancePerPixel = 50;
// A factor by which we scale the distance between the Sun and the Earth
// in order to show it on screen
const scaleFactor = AU / pixelsInOneEarthSunDistancePerPixel;




class Planet {
    constructor(app, radius, color, texture) {
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
    }

    updatePosition(dt) {
        // Update velocity based on acceleration
        vec3.scaleAndAdd(this.velocity, this.velocity, this.acceleration, dt);

        // Update position based on velocity
        vec3.scaleAndAdd(this.position, this.position, this.velocity, dt);

        // scaledPosition is used for rendering
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

class Sun extends Planet {
    constructor(app) {
        super(app, 10.0, new Color(1.0, 1.0, 0.0, 1.0), "2k_sun.jpg");
        this.mass = M_sun;

        // Sun at the origin
        this.position = vec3.fromValues(0.0, 0.0, 0.0);
        this.velocity = vec3.fromValues(0.0, 0.0, 0.0);

    }
}


class Earth extends Planet {
    constructor(app) {
        super(app, 5.0, new Color(1.0, 1.0, 1.0, 1.0), "2k_earth_daymap.jpg");
        //
        this.mass = M_earth;
        // Earth at 1 AU from the Sun
        this.position = vec3.fromValues(-0.17781 * AU, 0.96765 * AU, 0.00008 * AU);
        vec3.scale(this.scaledPosition, this.position, 1 / scaleFactor);

        // Velocity of Earth at 1 AU from the Sun
        this.velocity = vec3.fromValues(-0.017202 * AU / day, -0.003227 * AU / day, 0.000001 * AU / day);
    }
}   