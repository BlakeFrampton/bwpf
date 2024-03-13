let totalIterations;
let currentIteration = 0;
let lineLength = 5;
let lineLengthScaleFactor;
let angle;
let axiom;
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

  systemSelect = createSelect();
  systemSelect.position(5, 10);
  systemSelect.option("Plant");
  systemSelect.option("Leaf");
  systemSelect.option("Bush");

  totalIterationsSlider = createSlider(0, 30, 6, 1);
  totalIterationsSlider.position(width -140, 30);

  lineLengthSlider = createSlider(1, 20, 5, 0,0.5);
  lineLengthSlider.position(width-140, 90)

  lineLengthScaleFactorSlider = createSlider(1, 2, 1.01, 0.01);
  lineLengthScaleFactorSlider.position(width-140, 150);

  strokeWeightSlider = createSlider(0.1, 10, 3, 0.1);
  strokeWeightSlider.position(width-140, 210);

  angleSlider = createSlider(1, 90, 30, 1);
  angleSlider.position(width-140, 270);

  systemSelect.changed(() => {
    totalIterationsSlider.value(5);
  })

  totalIterations = totalIterationsSlider.value();
  generateShape();
  console.log(axiom);
}

function draw() {
  background(50);
  push();
  noStroke();
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

  translate(width/2, height);
  rotate(180);
  printShape(axiom);
}

function mouseClicked(){
  generateShape();
}

function generateShape(){
  axiom = setInitialAxiom();

  for (let i = 0; i < totalIterations; i++){
    axiom = Iterate(axiom);
  }
}

function printShape(axiom){
  for (let char of axiom){
    switch(char){
      case "F":
        stroke("#9ea93f");
        line(0,0,0,lineLength);
        translate(0,lineLength);
        break;
      case "f":
        translate(0,lineLength);
        break;
      case "A":
        push();
        noStroke();
        fill("#E5CEDC");
        circle(0,0,lineLength*2);
        pop();
        break;
      case "a":
        push();
        noStroke();
        fill("#E5CEDC");
        circle(0,0,lineLength*1.5);
        pop();
        break;
      case "B":
        push();
        noStroke();
        fill("#FCA17D");
        circle(0,0,lineLength*2);
        pop();
        break;
      case "b":
        push();
        noStroke();
        fill("#FCA17D");
        circle(0,0,lineLength*1.5);
        pop();
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
  return chooseOne(plant(char)).rule;
}

function chooseOne(options){
  let rnd = random();
  let total =0;
  for (let i =0; i < options.length;i++){
    total += options[i].prob;
    if (total >= rnd){
      return options[i];
    }
  }
  return "";
}

function setInitialAxiom(){
  switch(systemSelect.selected()){
    case "Plant":
      return "X";
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

function plant(char){
  switch(char){
    case "X":
      return [{rule: "F[+X][-X]FX", prob: 0.5},
              {rule: "F[-X]FX", prob: 0.05},
              {rule: "F[+X]FX", prob: 0.05},
              {rule: "F[++X][-X]FX", prob: 0.1},
              {rule: "F[+X][--X]FX", prob: 0.1},
              {rule: "F[+X][-X]FA", prob: 0.05},
              {rule: "F[+X][-X]FB", prob: 0.05},
              {rule: "F[+X][-X]FA", prob: 0.05},
              {rule: "F[+X][-X]FB", prob: 0.05}];
    case "F":
      return [{rule: "FF", prob: 0.85},
              {rule: "FFF", prob: 0.05},
              {rule:"F", prob: 0.1}];
    default:
      return [{rule: char, prob: 1}];
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
      return char;
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