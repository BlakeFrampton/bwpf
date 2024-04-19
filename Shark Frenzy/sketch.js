let flock = [];
let shark;
let effects = [];

function setup() {
  angleMode(RADIANS);
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  createCanvas(width , height);

  for (i=0; i < width * height / 8000; i++){
  flock.push(new boid(i));
  }
  console.log(width * height / 8000);
  shark = new player;
}

function draw() {
  background(44, 160, 224);
  for (let effect of effects){
    effect.update(effects);
  }
  for (let thisBoid of flock){
    thisBoid.update(flock, shark, effects);
  }
  for (let thisBoid of flock){
    thisBoid.show();
  }
  shark.update();
  shark.show();
  drawUI(shark.hunger);
  
}

function drawUI(hunger){
  //Draw score
  push();
  noFill();
  stroke(90, 90, 255);
  strokeWeight(3);
  textSize(100);
  textAlign(CENTER);
  text(shark.score * 5/3,width/2, 100);
  pop();
  //Draw hunger bar

  let meterHeight = height / 8;
  push();
  fill(0);
  noStroke();
  rect(10, 10, 10 + meterHeight/8, meterHeight, 10);
  fill(255 * (1-hunger), 255 * hunger ,0);
  rect(14, 14 + (meterHeight -8) * (1-hunger) , 2 + meterHeight/8, (meterHeight -8) * hunger , 10);
}