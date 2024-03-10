const flock = [];

function setup() {
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  createCanvas(width , height- 25);

  alignmentSlider = createSlider(0, 2, 1, 0,1);
  cohesionSlider = createSlider(0, 2, 1, 0,1);
  separationSlider = createSlider(0, 2, 1, 0,1);

  for (i=0; i < 300; i++){
  flock.push(new boid);
  }
}

function draw() {
  background(220);
  for (boid of flock){
    boid.update(flock);
  }
  for (boid of flock){
    boid.show();
  }
}
