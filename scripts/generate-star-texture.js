const fs = require('fs');
const { createCanvas } = require('canvas');

console.log('Generating star texture...');

// Create a canvas
const canvas = createCanvas(32, 32);
const ctx = canvas.getContext('2d');

// Draw a radial gradient for the star
const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 32, 32);

// Save the canvas as a PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/star.png', buffer);

console.log('Star texture generated and saved to public/star.png');