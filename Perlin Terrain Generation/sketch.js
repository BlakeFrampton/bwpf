let gridWidth = 100;
let gridHeight = 30;
let tileSize = 150;
let noiseStep = 0.15;
let FlightDist = 0;
let mapHeight = 500;

function setup() {
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  createCanvas(width , height, WEBGL);
 // tileSize = (width /gridWidth) * 4;
  //VertexHeight =  new float [gridWidth][gridHeight];
}

function draw() {
 // emissiveMaterial(100,0,0);
  background(abs(FlightDist)%150, 10, 150 -abs(FlightDist)%150);
  stroke(0);
  rotateX(PI /3 );
  translate(-gridWidth * tileSize/2 , -gridHeight * tileSize/2 - 1500, -200);
  for (let y =0;y< gridHeight -1; y++){
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < gridWidth; x++){
      fill(50, 0, y * (150/gridHeight));
      vertex(x*tileSize, y*tileSize, map(noise(x * noiseStep,(y) * noiseStep + FlightDist), 0,1,-mapHeight,mapHeight));
      vertex(x*tileSize, (y+1) * tileSize,map(noise(x * noiseStep,(y + 1) * noiseStep + FlightDist), 0,1,-mapHeight,mapHeight));
    }
    endShape();
  }
  FlightDist -= 0.15;
}