

let angle = 0;

function setup() {


  frameRate(60);
  angleMode(RADIANS);
  const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  createCanvas(width , height, WEBGL);
  fill(170);
  LayersSlider = createSlider(1, 3, 2, 1);
  LayersSlider.position(width - 140, 40);
  let LayersLabel = createSpan('Layers');
  LayersLabel.position(width-95, 20);
}

function draw() {
  background(200);
  lights();
  noStroke();
  rotateX(-angle);
  rotateY(angle *0.7);
  rotate(angle * 1.2);
  rotateZ(angle * 0.3);
 
  subCube(min(width, height)/7, 1);

  angle += 0.01;
}

function subCube(BoxWidth, layer){
  for (let XOffset = -BoxWidth; XOffset <= BoxWidth; XOffset += BoxWidth){
    for (let YOffset = -BoxWidth; YOffset <= BoxWidth; YOffset += BoxWidth){
      for (let ZOffset = -BoxWidth; ZOffset <= BoxWidth; ZOffset += BoxWidth){
        let isCenter = (XOffset == 0) + (YOffset == 0) + (ZOffset == 0);
        if (isCenter < 2){
          push();
          translate(XOffset, YOffset, ZOffset);
          if (layer < LayersSlider.value()){
            shininess(0)
            specularMaterial(0,0,0)
            subCube(BoxWidth/3, layer + 1);
          }else{
            ambientMaterial(25, 50, 150);
            specularMaterial(100, 50, 200);
            shininess(180);
            box(BoxWidth);
          }
          pop();
        }
        ZeroOffsets = 0;
      }
    }
  }
}
