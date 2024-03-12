
let totalLayers = 10;
let initialLength;
let leftAngle = 30;
let rightAngle = 30;
let numOfBranches = 2;

function setup() {
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  initialLength = height/3;
  createCanvas(width, height);
  background(50);
  stroke(255);
  strokeWeight(1);
  angleMode(DEGREES);
}

function draw() {
  translate(width/2, height);
  branch(0, initialLength,1 );
}

function branch(angle, length, currentLayer){
  if (currentLayer <= totalLayers){
  let nextPoint = createVector();
  nextPoint.x = length * sin(angle);
  nextPoint.y = -length * cos(angle);
  line(0,0,nextPoint.x, nextPoint.y);
  push();
  translate(nextPoint.x, nextPoint.y);

  for (let branch = -numOfBranches; branch < numOfBranches; branch++){
    push();
    let angle = 0;
    if (branch < 0){
      angle = -leftAngle * abs(branch)
    }else if(branch > 0){
      angle  = rightAngle * branch;
    }
    rotate(angle);
    if (currentLayer <= totalLayers){
      branch(angle,length * 0.5, currentLayer + 1);
    }
    pop();
  }  
  pop();
  // rotate(-leftAngle);
  // if (currentLayer <= totalLayers){
  //   branch(-leftAngle, length * 0.5, currentLayer + 1);
  // }
  // pop();
  
  // pop();
  // }
  }
}
