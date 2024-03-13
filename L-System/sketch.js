let Iterations = 2;
let currentIterations = 0;
let initialAxiom = "F";
let moveDist = 25;
let angle = 30;

function setup() {
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  createCanvas(width, height);
  angleMode(DEGREES);
  stroke(255);
  strokeWeight(10);
  frameRate(5);
}

function draw() {
  background(50);
  currentIterations ++;
  let Axiom = initialAxiom;
  for (let i = 0; i < currentIterations % Iterations; i++){
    Axiom = Iterate(Axiom);
    }
  translate(width/2, height/2);
  rotate(180);
  console.log(Axiom);
  for (let char of Axiom){
    switch(char){
      case "F":
        line(0,0,0,moveDist);
        translate(0,moveDist);
      case "B":
        line(0,0,0,-moveDist);
        translate(0,-moveDist);
      case "-":
        rotate(angle);
      case "+":
        rotate(-angle);
    }
  }
}

function Iterate(Axiom){
  let newAxiom = "";
    for (let char of Axiom){
      newAxiom += Rules(char);
    }
    return newAxiom;
}

function Rules(char){
  switch(char){
    case "F":
      return "F-F++F-F"
    default:
      return char
  }
} 