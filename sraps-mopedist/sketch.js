// The size of the vinyl cover is 31.43 cm
// Based on online calculator, that makes 1188 pixels
let scale = 11.88
let numberOfDivision = 137;
let r;
let angle;
let step  //distance between steps in radians
let startVinylNb = 23
let vinylNb = startVinylNb;

let pointsCoordinates = [];
let canvas;
//let div;
let currFont;

function setup() {
    canvas = createCanvas(100 * scale, 100 * scale);
    // div = createDiv(vinylNb)
    r = 100 * scale / 2;
    angle = 0;
    step = TWO_PI / numberOfDivision;
    background(255, 255, 255, 0);
    translate(width / 2, height / 2);
    for (let i = 0; i < numberOfDivision; i++) {
        //convert polar coordinates to cartesian coordinates
        var x = r * sin(angle);
        var y = r * cos(angle);
        pointsCoordinates.push({ x, y })

        //draw ellipse at every x,y point
        //if (i==0){
        // ellipse(x, y, 30);}

        //increase angle by step size
        angle = angle - step;
    }

    // create div element and append it to canvas
    //div.parent = canvas;  
    //div.position(0,0);
    // set position and dimensions of div
    //div.style("position", "absolute");
    // center div within canvas
    //div.style("top", "50%");
    //div.style("left", "50%");
    //div.style("transform", "translateX(-50%)");
    //div.style("color", "black")
    textSize(42);
    textFont("Courier New");
    textAlign(LEFT, CENTER);
    //textStyle(BOLD);
}

function drawLines(currVinylNb) {
    let currIndex = currVinylNb - 1;
    for (let i = 0; i < currVinylNb; i++) {
        let currPt = pointsCoordinates[currIndex % numberOfDivision]
        let newIndex = currIndex + currVinylNb;
        let nextPt = pointsCoordinates[newIndex % numberOfDivision]
        line(currPt.x, currPt.y, nextPt.x, nextPt.y);
        currIndex = newIndex;
    }
}

function draw() {
    clear();
    background(255, 255, 255, 0);
    textAlign(CENTER);
    frameRate(3);
    translate(width / 2, height / 2);

    stroke(0);
    fill(0);
    circle(0, 0, 7 * scale);
    noFill();
    strokeWeight(1 * scale);
    circle(0, 0, 100 * scale);
    drawLines(vinylNb);
    console.log(('000' + (vinylNb - startVinylNb)).substr(-3) + "/100");
    vinylNb++;
    let textToDisplay = ('000' + (vinylNb - startVinylNb)).substr(-3) + "/100";
    strokeWeight(1);
    var w = textWidth("hello");
    fill(255);
    rect(300, -25, 200, 50);
    fill(0);
    text(textToDisplay, 300, -50, 200, 100);
    //var bbox = font.textBounds(textToDisplay, 0, 0, 18);
    //text(('000' + (vinylNb - startVinylNb)).substr(-3) + "/100", 100, 0);
    //saveCanvas(canvas, ('000' + (vinylNb - startVinylNb)).substr(-3), "png");
    if (vinylNb >= (10 + startVinylNb)) {
        noLoop();
    }
}