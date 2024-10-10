const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load 20 distinct images (replace with your own image paths)
const imageSources = [
    'img/00_arrange-01.png', 'img/00_arrange-02.png', 'img/00_arrange-03.png', 'img/00_arrange-04.png', 'img/00_arrange-05.png', 'img/00_arrange-06.png', 'img/00_arrange-07.png', 'img/00_arrange-08.png', 'img/00_arrange-09.png', 'img/00_arrange-10.png', 'img/00_arrange-11.png', 'img/00_arrange-12.png', 'img/00_arrange-13.png', 'img/00_arrange-14.png', 'img/00_arrange-15.png', 'img/00_arrange-16.png', 'img/00_arrange-17.png', 'img/00_arrange-18.png', 'img/00_arrange-19.png', 'img/00_arrange-20.png', 'img/00_arrange-21.png', 'img/00_arrange-22.png', 'img/00_arrange-23.png', 'img/00_arrange-24.png', 'img/00_arrange-26.png', 'img/00_arrange-27.png', 'img/00_arrange-28.png', 'img/00_arrange-29.png', 'img/00_arrange-30.png', 'img/00_arrange-31.png', 'img/00_arrange-32.png', 'img/00_arrange-34.png', 'img/00_arrange-37.png', 'img/00_arrange-38.png', 'img/00_arrange-39.png', 'img/00_arrange-40.png', 'img/00_arrange-41.png', 'img/00_arrange-42.png', 'img/00_arrange-43.png',
    'img/00_arrange-01.png', 'img/00_arrange-02.png', 'img/00_arrange-03.png', 'img/00_arrange-04.png', 'img/00_arrange-05.png', 'img/00_arrange-06.png', 'img/00_arrange-07.png', 'img/00_arrange-08.png', 'img/00_arrange-09.png', 'img/00_arrange-10.png', 'img/00_arrange-11.png', 'img/00_arrange-12.png', 'img/00_arrange-13.png', 'img/00_arrange-14.png', 'img/00_arrange-15.png', 'img/00_arrange-16.png', 'img/00_arrange-17.png', 'img/00_arrange-18.png', 'img/00_arrange-19.png', 'img/00_arrange-20.png', 'img/00_arrange-21.png', 'img/00_arrange-22.png', 'img/00_arrange-23.png', 'img/00_arrange-24.png', 'img/00_arrange-26.png', 'img/00_arrange-27.png', 'img/00_arrange-28.png', 'img/00_arrange-29.png', 'img/00_arrange-30.png', 'img/00_arrange-31.png', 'img/00_arrange-32.png', 'img/00_arrange-34.png', 'img/00_arrange-37.png', 'img/00_arrange-38.png', 'img/00_arrange-39.png', 'img/00_arrange-40.png', 'img/00_arrange-41.png', 'img/00_arrange-42.png', 'img/00_arrange-55.png',
    'img/00_arrange-01.png', 'img/00_arrange-02.png', 'img/00_arrange-03.png', 'img/00_arrange-04.png', 'img/00_arrange-05.png', 'img/00_arrange-06.png', 'img/00_arrange-07.png', 'img/00_arrange-08.png', 'img/00_arrange-09.png', 'img/00_arrange-10.png', 'img/00_arrange-11.png', 'img/00_arrange-12.png', 'img/00_arrange-13.png', 'img/00_arrange-14.png', 'img/00_arrange-15.png', 'img/00_arrange-16.png', 'img/00_arrange-17.png', 'img/00_arrange-18.png', 'img/00_arrange-19.png', 'img/00_arrange-20.png', 'img/00_arrange-21.png', 'img/00_arrange-22.png', 'img/00_arrange-23.png', 'img/00_arrange-24.png', 'img/00_arrange-26.png', 'img/00_arrange-27.png', 'img/00_arrange-28.png', 'img/00_arrange-29.png', 'img/00_arrange-30.png', 'img/00_arrange-31.png', 'img/00_arrange-32.png', 'img/00_arrange-34.png', 'img/00_arrange-37.png', 'img/00_arrange-38.png', 'img/00_arrange-39.png', 'img/00_arrange-40.png', 'img/00_arrange-41.png', 'img/00_arrange-42.png', 'img/00_arrange-55.png',
];

const images = [];
const imageBodies = [];

// Set up Matter.js engine and world
const { Engine, Runner, Bodies, World, Body } = Matter;

const engine = Engine.create();
const world = engine.world;

// Gravity setup (default is pointing downward)
world.gravity.y = 2;

// Create boundary walls for the left, right, and bottom edges of the canvas
const wallThickness = 20;  // Thickness of the boundary walls

const leftWall = Bodies.rectangle(-wallThickness / 2, canvas.height / 2, wallThickness, canvas.height, {
    isStatic: true
});
const rightWall = Bodies.rectangle(canvas.width + wallThickness / 2, canvas.height / 2, wallThickness, canvas.height, {
    isStatic: true
});
const bottomWall = Bodies.rectangle(canvas.width / 2, canvas.height + wallThickness / 2, canvas.width, wallThickness, {
    isStatic: true
});

// Add the left, right, and bottom walls to the world
World.add(world, [leftWall, rightWall, bottomWall]);

// Function to create a Matter.js body for each image using its natural dimensions
function createImageBody(img, x, y) {
    const ratio = img.naturalWidth / img.naturalHeight;
    const width = 80 * ratio;  // Arbitrarily scale height to 50px and scale width accordingly
    const height = 80;
    
    // Create a body with lower inertia to allow rotation
    const body = Bodies.rectangle(x, y, width, height, {
        restitution: 0.005,  // Bounce factor
        friction: 0.03,     // Friction for stacking
        frictionAir: 0.10, // Adds a bit of air friction to slow down rotation over time
        angle: Math.random() * Math.PI * 2,  // Start each image at a random angle
        inertia: Body.create({ mass: 1 }).inertia  // Set reasonable inertia for rotation
    });

    // Add angular damping to slow down the rotation as it settles
    body.angularDamping = 1.10;

    body.render = {
        sprite: {
            texture: img.src, // Use image as texture
            xScale: width / img.naturalWidth,  // Scale the image body accordingly
            yScale: height / img.naturalHeight
        }
    };

    World.add(world, body);
    imageBodies.push({ body, width, height, img });
}

// Load all images and create their respective physics bodies
imageSources.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    
    // Once the image is loaded, we create a body for it
    img.onload = () => {
        images.push(img);  // Store the loaded image
        const x = Math.random() * canvas.width;
        const y = Math.random() * -canvas.height;  // Start above canvas
        createImageBody(img, x, y);
    };
});

// Matter.js runner for simulation
const runner = Runner.create();
Runner.run(runner, engine);

// Custom rendering loop for drawing images at their original ratios
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas

    // Draw each image at the position of its corresponding Matter.js body
    imageBodies.forEach(({ body, img, width, height }) => {
        const posX = body.position.x - width / 2;
        const posY = body.position.y - height / 2;
        const angle = body.angle;  // Get the current angle of the body

        // Save the canvas context before applying transformations
        ctx.save();
        
        // Translate the canvas to the body's position and rotate
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(angle);

        // Draw the image centered at the rotated position
        ctx.drawImage(img, -width / 2, -height / 2, width, height);

        // Restore the canvas context
        ctx.restore();
    });

    requestAnimationFrame(render);  // Continue the animation loop
}

// Start rendering loop
render();

// Handle window resize to keep canvas dimensions and boundary walls consistent
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update ground and walls
    Body.setPosition(leftWall, { x: -wallThickness / 2, y: canvas.height / 2 });
    Body.setPosition(rightWall, { x: canvas.width + wallThickness / 2, y: canvas.height / 2 });
    Body.setPosition(bottomWall, { x: canvas.width / 2, y: canvas.height + wallThickness / 2 });
});
