let flock = [];
let shark;
let orca;
let effects = [];
let zoom = 1;
let targetZoom = 1;
let fishToSpawn = 160;

function setup() {
  angleMode(RADIANS);
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  createCanvas(width, height);
  shark = new player;
  orca = new predator;
  shark.fishSpawned += int(width * height / 14000);
  for (i=0; i < shark.fishSpawned; i++){
  flock.push(new boid(random(-width/2, width/2), random(-height/2, height/2)));
  }

  translate(width/2, height/2);
}

function draw() {
  translate(width/2,height/2);
  background(44, 160, 224);
  scale(1/zoom);
  for (let effect of effects){
    effect.update(effects);
  }
  for (let thisBoid of flock){
    thisBoid.update(flock, shark, orca, effects, zoom, fishToSpawn);
  }
  for (let thisBoid of flock){
    thisBoid.show(zoom);
  }
  targetZoom = shark.update(orca, effects, zoom, targetZoom, fishToSpawn);
  shark.show();
  orca.update(shark, zoom);
  orca.show(shark);
  drawUI(shark.hunger, zoom);
  updateZoom();
}

function drawUI(hunger, zoom){
  //Draw score
  // translate(width/2, height/2);
  push();
  noFill();
  stroke(90, 90, 255);
  strokeWeight(3 * zoom);
  textSize(100 * zoom);
  textAlign(CENTER);
  text(shark.score * 5/3,0, (-height /2 + 90) *  zoom);
  pop();
  //Draw hunger bar

  let meterHeight = height / 8;
  push();
  fill(0);
  noStroke();
  rect(-width/2 * zoom + 10 , -height /2 * zoom + 10, 10 + meterHeight/8 * zoom, meterHeight * zoom, 7 * zoom);
  fill(255 * (1-hunger), 255 * hunger ,0);
  rect((-width/2 * zoom) + 14, - height /2 * zoom + 14 + (meterHeight -8) * (1-hunger) * zoom, 2 + meterHeight/8 * zoom, (meterHeight -8) * hunger * zoom, 10 * zoom);
}

function updateZoom(){
  if (targetZoom > zoom){
    zoom += 0.01;
  }else if (zoom > targetZoom){
    zoom = targetZoom;
  }
}
