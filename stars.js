// Stars
const messages = [
    "I love you!",
    "You are my universe!",
    "You make my world brighter",
    "You are my shining star!",
    "You light up my life!",
    "You are my galaxy!",
    "I love you to the moon and back!",
    "I WIN!",
    "You are my everything!",
    "You are my star!",
    "You are my light in the dark!",
    "You are my dream come true!",
    "Sorry the planets are shit!",
    "You are my entire galaxy",
    "I love you infinity",
];

const activeMessages = [];

const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

// Make canvas full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Planets
const planet = {
    x: canvas.width * 0.7,
    y: canvas.height * 0.3,
    radius: 120,
    color: "purple",
    speedX: -0.2
};

// Moon
const moon = {
    x: canvas.width * 0.2,
    y: canvas.height * 0.2,
    radius: 60,
    color: "lightgray",
    speedX: 0.05
};

// Nebula
function drawNebula() {
    const centerX = canvas.width * 0.5;
    const centerY = canvas.height * 0.5;
    const radiusX = canvas.width * 0.25; // horizontal radius
    const radiusY = canvas.height * 0.15; // vertical radius
    const tilt = -0.4; // radians, negative = clockwise tilt

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(tilt);
    ctx.scale(1, radiusY / radiusX);

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radiusX);
    gradient.addColorStop(0, "rgba(167, 16, 167, 0.79)"); // pinkish center
    gradient.addColorStop(0.5, "rgba(103, 149, 247, 0.45)"); // bluish mid
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // lighter outer

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, radiusX, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// Array to hold stars
const stars = [];

// Generate random stars
for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        brightness: Math.random() * 155 + 100, // start between 100–255
change: (Math.random() * 4.5 + 0.45) * (Math.random() < 0.5 ? -1 : 1) 
// speed between -4.5 and 4.5

    });
}

// Shooting heart stars
const hearts = [];
function spawnHeart() {
    hearts.push({
        x: Math.random() * canvas.width,
        y: -20,
        size: Math.random() * 10 + 5,
        speedX: (Math.random() - 0.5) * 2,
        speedY: Math.random() * 2 + 1,
        opacity: 1.0,
        trail: []
    });
}

// Constellation for "Steph"
const constellation = [
    {x: canvas.width*0.1, y: canvas.height*0.7},
    {x: canvas.width*0.15, y: canvas.height*0.65},
    {x: canvas.width*0.2, y: canvas.height*0.7},
    {x: canvas.width*0.25, y: canvas.height*0.6},
    {x: canvas.width*0.3, y: canvas.height*0.65},
];

function drawHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x, y - size/2, x - size, y - size/2, x - size, y);
    ctx.bezierCurveTo(x - size, y + size/2, x, y + size/1.5, x, y + size);
    ctx.bezierCurveTo(x, y + size/1.5, x + size, y + size/2, x + size, y);
    ctx.bezierCurveTo(x + size, y - size/2, x, y - size/2, x, y);
    ctx.closePath();
    ctx.fillStyle = `rgba(100, 29, 117, 0.8)`;
    ctx.fill();
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNebula();

    // Move planet
    planet.x += planet.speedX;

    // Wraip planet around screen
    if (planet.x + planet.radius < 0) {
        planet.x = canvas.width + planet.radius;
    }

    // Draw planet in background with gradient
    const gradient = ctx.createRadialGradient(
    planet.x - 20, planet.y - 20, 30, // small offset for "light source"
    planet.x, planet.y, planet.radius
    );

    gradient.addColorStop(0, 'pink');       // light center
    gradient.addColorStop(1, planet.color); // darker edges
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fill();

    // Move moon
moon.x += moon.speedX;

// Wrap moon around screen
if (moon.x + moon.radius < 0) {
    moon.x = canvas.width + moon.radius;
}

// Draw moon with gradient
const moonGradient = ctx.createRadialGradient(
    moon.x - 10, moon.y - 10, 20, 
    moon.x, moon.y, moon.radius
);
moonGradient.addColorStop(0, 'white');       // bright center
moonGradient.addColorStop(1, moon.color);    // gray edges

ctx.fillStyle = moonGradient;
ctx.beginPath();
ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI * 2);
ctx.fill();


    stars.forEach(star => {
        // Update brightness smoothly
        star.brightness += star.change;

        // Bounce brightness at limits
        if (star.brightness > 255) {
            star.brightness = 255;
            star.change *= -1;
        }
        if (star.brightness < 100) {
            star.brightness = 100;
            star.change *= -1;
        }

        // Draw star
        const b = Math.floor(star.brightness);
        ctx.fillStyle = `rgb(${b}, ${b}, ${b})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });

        // Draw hearts
    for (let i = hearts.length - 1; i >= 0; i--) {
    let h = hearts[i];
    // Add current position to trail
    h.trail.push({ x: h.x, y: h.y, size: h.size, opacity: h.opacity });

    // Keep trail length reasonable
    if (h.trail.length > 8) h.trail.shift();

// Draw the trail
h.trail.forEach((t, index) => {
    const alpha = t.opacity * ((h.trail.length - index) / h.trail.length); // fade out from newest to oldest
    ctx.globalAlpha = alpha;
    drawHeart(t.x, t.y, t.size * 0.8);
});
    ctx.globalAlpha = 1.0; // reset alpha

    // Draw main heart
    drawHeart(h.x, h.y, h.size);

    // Move heart
    h.x += h.speedX;
    h.y += h.speedY;
    h.opacity -= 0.005;

    if (h.y > canvas.height || h.opacity <= 0) hearts.splice(i, 1);
};


    
    // Occasionally spawn new hearts
    if (Math.random() < 0.02) spawnHeart();

        // Draw constellation
    ctx.strokeStyle = 'rgba(255, 217, 223, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i=0; i<constellation.length-1; i++) {
        ctx.moveTo(constellation[i].x, constellation[i].y);
        ctx.lineTo(constellation[i+1].x, constellation[i+1].y);
    }
    ctx.stroke();

    // Draw active messages
activeMessages.forEach((m, index) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
    ctx.font = "16px Arial";
    ctx.fillText(m.text, m.x, m.y);

    // Fade out
    m.opacity -= 0.01;
    if (m.opacity <= 0) {
        activeMessages.splice(index, 1); // remove faded messages
    }
});


    requestAnimationFrame(animateStars);
}

animateStars();

canvas.addEventListener("click", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    stars.forEach(star => {
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < star.radius + 5) {
            const msg = messages[Math.floor(Math.random() * messages.length)];

            activeMessages.push({
                text: msg,
                x: star.x + 10,
                y: star.y - 10,
                opacity: 1.0
            });

            // Spawn a few hearts at the star position
            for (let i = 0; i < 3; i++) {
                hearts.push({
                    x: star.x,
                    y: star.y,
                    size: Math.random() * 10 + 5,
                    speedX: (Math.random() - 0.5) * 2,
                    speedY: Math.random() * 2 + 1,
                    opacity: 1.0,
                    trail: []
                });
            }
        }
    });
});


// Mouse UX
canvas.addEventListener("mousemove", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    let hovering = false;

    stars.forEach(star => {
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < star.radius + 5) {
            hovering = true;
        }
    });

    if (hovering) {
        canvas.style.cursor = "pointer";
    } else {
        canvas.style.cursor = "default";
    }
});