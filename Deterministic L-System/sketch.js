let totalIterations;
let currentIteration = 0;
let lineLength = 5;
let lineLengthScaleFactor;
let angle;
let currentStrokeWeight;
let strokeWeightIncrement;
let animationResetDelay= 0;
let checkbox;
let systemSelect;
let totalIterationsSlider;
let lineLengthSlider;
let lineLengthScaleFactorSlider;
let angleSlider;


function setup() {
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  createCanvas(width, height);
  angleMode(DEGREES);
  stroke(255);
  strokeWeight(currentStrokeWeight);
  frameRate(5);
  fill(255);
  animateCheckbox = createCheckbox();
  animateCheckbox.position(22, 25);

  systemSelect = createSelect();
  systemSelect.position(5, 60);
  systemSelect.option("Leaf");
  systemSelect.option("Bush");

  totalIterationsSlider = createSlider(0, 30, 5, 1);
  totalIterationsSlider.position(width -140, 30);

  lineLengthSlider = createSlider(1, 20, 5, 0,0.5);
  lineLengthSlider.position(width-140, 90)

  lineLengthScaleFactorSlider = createSlider(1, 2, 1.2, 0.01);
  lineLengthScaleFactorSlider.position(width-140, 150);

  strokeWeightSlider = createSlider(0.1, 10, 1, 0.1);
  strokeWeightSlider.position(width-140, 210);

  angleSlider = createSlider(1, 90, 30, 1);
  angleSlider.position(width-140, 270);

  systemSelect.changed(() => {
    totalIterationsSlider.value(5);
  })
}

function draw() {
  background(50);
  push();
  noStroke();
  text("Animate?",10, 20);
  text("Iterations", width - 100, 20);
  text("Length", width - 90, 80);
  text("Length Scale", width - 110, 140);
  text("Stroke Weight", width - 110, 200);
  text("Angle", width -90, 260);
  pop();

  totalIterations = totalIterationsSlider.value();
  totalIterations = capIterations();

  lineLength = lineLengthSlider.value();
  lineLengthScaleFactor = lineLengthScaleFactorSlider.value();
  angle = angleSlider.value();
  currentStrokeWeight = strokeWeightSlider.value();
  strokeWeightIncrement = currentIteration;
  strokeWeight(currentStrokeWeight);
  let axiom = setInitialAxiom();
  let iterations = totalIterations;
  if (animateCheckbox.checked()){
    iterations = currentIteration % (totalIterations + 1);
    if (iterations == totalIterations){
      if (animationResetDelay < 3){
        animationResetDelay++;
      }else{
        currentIteration++;
        animationResetDelay = 0;
      }
    }else{
      currentIteration++;
    }
  }
  for (let i = 0; i < iterations; i++){
    axiom = Iterate(axiom);
    }
  translate(width/2, height);
  rotate(180);
  console.log(axiom);
  printShape(axiom);
}

function printShape(axiom){
  for (let char of axiom){
    switch(char){
      case "F":
        line(0,0,0,lineLength);
        translate(0,lineLength);
        break;
      case "f":
        translate(0,lineLength);
        break;
      case "-":
        rotate(angle);
        break;
      case "+":
        rotate(-angle);
        break;
      case "|":
        rotate(180);
        break;
      case "[":
        push();
        break;
      case "]":
        pop();
        break;
      case "#":
        currentStrokeWeight += strokeWeightIncrement;
        strokeWeight(currentStrokeWeight);
        break;
      case "!":
        currentStrokeWeight -= strokeWeightIncrement;
        strokeWeight(currentStrokeWeight);
        break;
      case "@":
        point(0,0);
        break;
      case ">":
        lineLength *= lineLengthScaleFactor;
        break;
      case "<":
        lineLength /= lineLengthScaleFactor;
        break;
      default:
        break;
    }
  }
}

function Iterate(axiom){
  let newAxiom = "";
    for (let char of axiom){
      newAxiom += rules(char);
    }
    return newAxiom;
}

function rules(char){
  switch (systemSelect.selected()){
    case "Leaf":
      return leaf(char);
    case "Bush":
      return bush(char);
    default:
      return "";
  }
}

function setInitialAxiom(){
  switch(systemSelect.selected()){
    case "Leaf":
      return "a";
    case "Bush":
      return "Y";
  }
}

function capIterations(){
  switch(systemSelect.selected()){
    case "Bush":
      return min(totalIterations, 8);
    default:
      return totalIterations;
  }
}

function leaf(char){
  switch(char){
    case "F":
      return ">F<"
    case "a":
      return  "F[+x]Fb"
    case "b":
      return "F[-y]Fa"
    case "x":
      return "a";
    case "y":
      return "b";
    default:
      return char
  }
} 

function bush(char){
  switch(char){
    case "X":
      return "X[-FFF][+FFF]FX";
    case "Y":
      return "YFX[+Y][-Y]";
    default:
      return char;
  }
}