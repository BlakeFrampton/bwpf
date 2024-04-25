let flock = [];
let shark;
let effects = [];
let controller;
let pauseButton;
let paused = false;


function setup() {
  frameRate(60);
  angleMode(RADIANS);
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  createCanvas(width, height);
  let zoom =1;
  if (width < 800){
    zoom = 2;
  }
  controller = new gameController(zoom);
  shark = new player;
  controller.maxFish = int(width * height / 14000 * controller.zoom);
  for (i=0; i < controller.maxFish; i++){
  flock.push(new boid(random(-width/2 * controller.zoom, width/2 * controller.zoom), random(-height/2 * controller.zoom, height/2 * controller.zoom)));
  }
  controller.fishSpawned += controller.maxFish;

  pauseButton = createButton(String.fromCharCode(9208));
  pauseButton.mouseClicked(pause);
  pauseButton.class("button pause");
  pauseButton.position(width - 70, 20);

  translate(width/2, height/2);
}

function draw() {
  if (!paused){
  translate(width/2,height/2);
  background(max(0, 47 - controller.zoom * 3), max(0, 165 - controller.zoom * 5), 224);
  scale(1/controller.zoom);
  for (let effect of effects){
    effect.update(effects);
  }
  for (let thisBoid of flock){
    thisBoid.update(flock, shark, effects, controller);
  }
  for (let thisBoid of flock){
    thisBoid.show(controller);
  }
  shark.update(effects, controller, flock);
  shark.show(controller);
  controller.orca.update(shark, controller);
  controller.orca.show(controller);
  drawUI(shark);
  updateZoom(controller);
}
}

function drawUI(shark){
  //Draw score
  // translate(width/2, height/2);
  let zoom = controller.zoom;
  push();
  noFill();
  stroke(90, 90, 255);
  strokeWeight(3 * zoom);
  textSize(100 * zoom);
  textAlign(CENTER);
  text(controller.score * 5/3,0, (-height /2 + 90) *  zoom);
  pop();
  //Draw hunger bar
  let hunger = shark.hunger
  let meterHeight = height / 8;
  push();
  fill(0);
  noStroke();
  rect(-width/2 * zoom + 10 , -height /2 * zoom + 10, 10 + meterHeight/8 * zoom, meterHeight * zoom, 7 * zoom);
  fill(255 * (1-hunger), 255 * hunger ,0);
  rect((-width/2 * zoom) + 14, - height /2 * zoom + 14 + (meterHeight -8) * (1-hunger) * zoom, 2 + meterHeight/8 * zoom, (meterHeight -8) * hunger * zoom, 10 * zoom);
  pop();
}

function pause(){
  if (paused == true){
    paused = false;
    pauseButton.html(String.fromCharCode(9208));
  } else{
    paused = true;
    pauseButton.html(String.fromCharCode(9654));
  }
}

function updateZoom(controller){
  if (controller.targetZoom > controller.zoom){
    controller.zoom += 0.01;
    //when zoom as finished
    if (controller.targetZoom <= controller.zoom){
      controller.orca = new predator(controller.orcasEaten, controller.zoom);
    }
  }else if (controller.zoom > controller.targetZoom){
    controller.zoom = controller.targetZoom;
  }
}