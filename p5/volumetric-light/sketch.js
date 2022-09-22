/*
Inspired by https://inconvergent.net/2021/volumetric-light/
*/

let points = [];
let prevIndex = 0;

function setup() {
    createCanvas(800, 800);
    background(0);
}

function draw() {
    stroke('white'); // Change the color
    strokeWeight(1); // Make the points 10 pixels in size

    // add points to the total points
    for (let i = 0; i < 1000; i++) {
        points.push({
            x: random(width),
            y: random(height)
        })
    }

    // draw points
    for (let i = prevIndex; i < points.length; i++) {
        point(points[i].x, points[i].y);
    }

    prevIndex = points.length - 1;

    if (points.length > 50000) {
        noLoop();
    }
}