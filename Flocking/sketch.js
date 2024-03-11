let flock = [];

function setup() {

  angleMode(RADIANS);
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  createCanvas(width , height);

  alignmentSlider = createSlider(0, 5, 1, 0,1);
  cohesionSlider = createSlider(0, 2, 1, 0,1);
  separationSlider = createSlider(0, 2, 1, 0,1);
  populationSlider = createSlider(1, 300, 100, 1);

  let AlignmentLabel = createSpan('Alignment');
  AlignmentLabel.position(width-120, 20);
  alignmentSlider.position(width - 150, 40);

  let CohesionLabel = createSpan('Cohesion');
  CohesionLabel.position(width-120, 70);
  cohesionSlider.position(width - 150, 90);

  let SeparationLabel = createSpan('Separation');
  SeparationLabel.position(width-120, 120);
  separationSlider.position(width - 150, 140);

  let PopulationLabel = createSpan('Population');
  PopulationLabel.position(width-120, 170);
  populationSlider.position(width-150, 190);

  for (i=0; i < populationSlider.value(); i++){
  flock.push(new boid);
  }
}
function draw() {
  populationSlider.input(updatePopulation);
  background(44, 160, 224);
  for (let thisBoid of flock){
    thisBoid.update(flock);
  }
  for (let thisBoid of flock){
    thisBoid.show();
  }
}

function updatePopulation() {
 flock = [];
for (i=0; i < populationSlider.value(); i++){
    flock.push(new boid);
}
  return;
}
