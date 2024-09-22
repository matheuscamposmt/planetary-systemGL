# Solar Planetary System with Gravity and Acceleration - WebGL Simulation

## Overview

This WebGL simulation models a solar system with planets orbiting the Sun based on real-time gravitational forces and acceleration. The simulation follows Newtonian physics to compute the orbital paths, offering an interactive 3D experience.

## Features

- **Gravity & Acceleration:** Implements Newton’s law of universal gravitation.
- **Realistic Orbits:** Simulates orbital motion with real-time updates to position and velocity.
- **Interactive 3D View:** Rotate, zoom, and explore the solar system.
- **Time Control:** Adjust the speed of the simulation.

## Tech Stack

- **WebGL** for 3D rendering
- **JavaScript** for physics and interaction logic
- **Math.js** for gravitational calculations

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/matheuscamposmt/planetary-systemGL.git
   cd planetary-systemGL
   ```
2. Open `index.html` in a browser:
   ```bash
   open index.html
   ```

## Controls

- **Zoom**: Scroll or pinch
- **Rotate**: Click and drag
- **Time Speed**: Adjust via slider

## Physics

Gravitational force:
```
F = G * (m1 * m2) / r²
```
Where `F` is the force, `G` is the gravitational constant, `m1` and `m2` are the masses, and `r` is the distance between bodies. Acceleration is derived from force to update velocity and position.
