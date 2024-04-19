class player{
  maxSpeed = 6;
  ColourMultiplier = 1;

    constructor(){
      this.position= createVector(width/2 , height /2);
      this.velocity = createVector();
      this.acceleration = createVector();
      this.score = 0;
      this.hunger = 1;
    }

    update(){
      if (this.hunger == 0){
        this.acceleration.mult(0.96);
        this.velocity.mult(0.96);
        if (this.ColourMultiplier > 0.7){
          this.ColourMultiplier *= 0.999;
        }
      }else{
        // this.hunger -= 0.0006;
        this.hunger -= 0.01;
        this.hunger = max(0,this.hunger);
        let mousePosition = createVector(mouseX, mouseY);
        this.acceleration = mousePosition.sub(this.position);
        
        if (this.acceleration.mag() > 3){
        this.acceleration.limit(5 / (1 + this.score/200));
        this.acceleration.div(10);
       
        }
      }
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      // this.velocity.limit(this.maxSpeed / (1 + this.score/200));
      this.position.add(this.velocity);
    }
    show() {
        push();
        noStroke();
        fill(44, 160, 224, 50);
        rect(0,0, width, height);
        pop();
        strokeWeight(15);
        stroke(250);
        push();
        translate(this.position.x, this.position.y);
        
        rotate(atan(this.velocity.y/this.velocity.x));
        if (this.velocity.x < 0){
           rotate(PI);
        }
        stroke(100 * this.ColourMultiplier);
        fill(100* this.ColourMultiplier);
        let sizeMult = 1 + this.score/150
        stroke(150* this.ColourMultiplier);
        strokeWeight(15 *sizeMult);
        ellipse(0,0, 48 * sizeMult, 24 * sizeMult);
        pop();
    }
}
