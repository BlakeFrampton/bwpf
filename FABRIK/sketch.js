let joints = [];
let startingPoint;
let startingLength = 100;
let lengthScale = 0.9;
let jointCount= 10;
let rooted = true;

let muscleLengthLabel;
let lengthScaleLabel;
let jointCountLabel;


function setup() {
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  createCanvas(width , height);
  startingPoint = createVector(width/2, height);

  muscleLengthLabel = createSpan('Muscle Length: ' + startingLength);
  muscleLengthLabel.position(width-150, 20);
  muscleLengthSlider = createSlider(1, 200, startingLength);
  muscleLengthSlider.position(width - 150, 40);

  lengthScaleLabel = createSpan('Muscle Scaler: ' + lengthScale);
  lengthScaleLabel.position(width-145, 70);
  lengthScaleSlider = createSlider (0.1, 2, lengthScale, 0.1);
  lengthScaleSlider.position(width - 150, 90);

  jointCountLabel = createSpan('Joint Count: ' + jointCount);
  jointCountLabel.position(width-130, 120);
  jointCountSlider = createSlider(2, 2000, jointCount);
  jointCountSlider.position(width-150, 140);

  let rootedLabel = createSpan('Rooted?');
  rootedLabel.position(width-105, 170)
  rootedCheckbox = createCheckbox('', true);
  rootedCheckbox.position(width-90, 190);

  let showJointsLabel = createSpan('Show Joints?');
  showJointsLabel.position(width-120, 220)
  showJointsCheckbox = createCheckbox('', true);
  showJointsCheckbox.position(width-90, 240);

  noFill();
  strokeWeight(3);
  spawnJoints();
}

function draw() {
  background(150);

  jointCountSlider.input(sliderChanged);
  muscleLengthSlider.input(sliderChanged);
  lengthScaleSlider.input(sliderChanged);

  fabrik();
  drawJoints();
}

function drawJoints(){
  for (i=1; i < jointCount; i++){
    let previousPos = joints[i-1].getPosition();
    let pos = joints[i].getPosition();

    stroke(0);
    line(previousPos.x, previousPos.y, pos.x, pos.y);

    // if (showJointsCheckbox.checked() && jointCount <= 300){
    if (showJointsCheckbox.checked()){
      if (p5.Vector.sub(joints[i].getPosition(), joints[i-1].getPosition()).mag() > 0.1){
        stroke(255);
        circle(pos.x, pos.y, joint.getJointSize());
      }
    }
  }
}

function sliderChanged(){
  updateLabels();
  spawnJoints();
}

function updateLabels(){
  jointCount = jointCountSlider.value();
  startingLength = muscleLengthSlider.value();
  lengthScale = lengthScaleSlider.value();

  muscleLengthLabel.html('Muscle Length: ' + startingLength);
  lengthScaleLabel.html('Muscle Scaler: ' + lengthScale);
  jointCountLabel.html('Joint Count: ' + jointCount);
}


function spawnJoints(){
  joints = [];

  for (i=0; i < jointCount; i++){
    if (i == 0){
      joints.push(new joint(startingPoint.x, startingPoint.y));
    } else {
      let previousPos = joints[i-1].getPosition();
      joints.push(new joint(previousPos.x, previousPos.y - getJointLength(i)));
    }
  }
}

function getJointLength(i){
  return startingLength * Math.pow(lengthScale, i);
}


function fabrik(){
  forwardInverseKinematics();
  if (rootedCheckbox.checked()){
    backwardInverseKinematics();
  }
}

function forwardInverseKinematics(){
  for (i=jointCount-1; i >= 0; i--){
    if (i == jointCount - 1){
      joints[i].setPosition(mouseX, mouseY);
    } else {
      let previousPos = joints[i+1].getPosition();
      let pos = joints[i].getPosition();
      let movementVector = p5.Vector.sub(pos, previousPos);

      let jointLength = getJointLength(i);
      if (movementVector.mag() > jointLength){
        movementVector.setMag(jointLength);
        let newPos = p5.Vector.add(previousPos, movementVector);
        joints[i].setPosition(newPos.x, newPos.y);
      }
    }
  }
}

function backwardInverseKinematics(){
  for (i=0; i < jointCount; i++){
    if (i == 0){
      joints[i].setPosition(startingPoint.x, startingPoint.y);
    } else {
      let previousPos = joints[i-1].getPosition();
      let pos = joints[i].getPosition();
      let movementVector = p5.Vector.sub(pos, previousPos);
      
      let jointLength = getJointLength(i);
      if (movementVector.mag() > jointLength){
        movementVector.setMag(jointLength);
        let newPos = p5.Vector.add(previousPos, movementVector);
        joints[i].setPosition(newPos.x, newPos.y);
      }
    }
  }
}
