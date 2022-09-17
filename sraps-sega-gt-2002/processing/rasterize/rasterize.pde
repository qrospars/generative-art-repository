PImage img;
float[][][] colors;
float prevSinValue = 0;

// CONFIGURATION
float tiles = 3000;
int sphereDetails = 2;

// TODO -- Setup different phases in the animation
// PHASE 1 -> Slight noise on the sphere positions
// PHASE 2 -> Zoom in as I already have

void settings(){
  //img = loadImage("../../get-images/images/800.jpg");
  img = loadImage("../../080.jpg");
  float w = img.width*2;
  float h = img.height*2;
  size(int(w), int(h), P3D);
}

void setup() {
  img.resize(img.width*2, img.height*2);
  sphereDetail(sphereDetails);
  float tileSize = width/tiles;
  float tileSizeY = height/tiles;
  lightSpecular(255, 255, 180);
  directionalLight(204, 204, 204, 0, 0, -1);
  colors = new float[int(tiles)][int(tiles)][4];
   for (int y = 0; y < tiles; y++) {
  for (int x = 0; x < tiles; x++) {
    color c = img.get(int(x*tileSize),int(y*tileSizeY));
      float b = map(brightness(c),0,255,0,1);
      //float z = map(b,0,1,-150,150);
      float redC = 2*red(c);
      float greenC = 2*green(c);
      float blueC = 2*blue(c);
      float amplifyRed = map(int(red(c)),0, 255, 0, 1);
      float reduceBlack = calculateGreyReduction(c);
      colors[y][x][0] = redC;
      colors[y][x][1] = greenC;
      colors[y][x][2] = blueC;
      colors[y][x][3] = reduceBlack;
  }
   }
}

float calculateGreyReduction(color c) {
  float avgOfColors = (red(c) + green(c) + blue(c)) / 3;
  float sumOfColors = abs(red(c) - avgOfColors) + abs(green(c) - avgOfColors) + abs(blue(c) - avgOfColors);
  return map(sumOfColors, 0, 255, 0.3, 1.0); // TODO - verify that 255 is the maximum value
}

float reduceBlack(color c) {
  float sumOfColors = (red(c) + green(c) + blue(c));
  return map(sumOfColors, 0, 255*3, 1.0, 0.8); // TODO - verify that 255 is the maximum value
}

void draw() {
  background(#000000);
  fill(0);
  noStroke();
  push();
  translate(width/2,height/2);
  //rotateY(radians(frameCount));
  float tileSize = width/tiles;
  float tileSizeY = height/tiles;
  float sinFrame;
  if (frameCount <= 30) { 
   sinFrame = 0;
  } else {
     sinFrame = sin((frameCount-30)*0.05);
   }
  
    for (int y = 0; y < tiles; y++) {
  for (int x = 0; x < tiles; x++) {
      float redC = colors[y][x][0];
      float greenC = colors[y][x][1];
      float blueC = colors[y][x][2];
      float reduceBlack = colors[y][x][3];
      float z = map(reduceBlack,0,1,-100*sinFrame*reduceBlack,200*sinFrame*reduceBlack);
      push();
      translate(x*tileSize - width/2, y*tileSizeY - height/2, z);
      fill(redC, greenC, blueC);
      sphere(tileSize*reduceBlack);
      pop();
      
    }
  }
  pop();
  saveFrame("output/zoom_####.png");
  if ( prevSinValue > 0 && sinFrame < 0) {
    noLoop();
    exit();
  } else {
    prevSinValue = sinFrame;
  }
}
