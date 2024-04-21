class predator{
  maxSpeed = 30;
  maxAcceleration = 0.12;
  ColourMultiplier = 1;
  shrinkMult = 1;

    constructor(){
      this.position= createVector(width , height);
      this.velocity = createVector();
      this.acceleration = createVector();
      this.alive =true;
    }

    update(shark){
      if (shark.alive && this.alive){
        this.acceleration.x = shark.position.x;
        this.acceleration.y = shark.position.y;
        this.acceleration =this.acceleration.sub(this.position);

        if (this.acceleration.mag() > 3){
        this.acceleration.limit(this.maxAcceleration);
       
        }
      }
      this.velocity.add(this.acceleration);
      this.velocity.limit(30);
      this.position.add(this.velocity);
    }

    show() {
      if (!this.alive && this.shrinkMult > 0){
        this.shrinkMult -= 0.04;
        if (this.shrinkMult < 0){
          this.shrinkMult = 0 ;
        }
      }
      if (this.shrinkMult > 0){
        strokeWeight(15);
        stroke(250);
        push();
        translate(this.position.x , this.position.y);
        scale(this.shrinkMult);
        
        rotate(atan(this.velocity.y/this.velocity.x));
        if (this.velocity.x < 0){
           rotate(PI);
        }
        fill(255);
        let sizeMult = 3;
        stroke(30);
        strokeWeight(15 *sizeMult);
        ellipse(-30,0, 80 * sizeMult, 24 * sizeMult); //body

        fill(30 * this.ColourMultiplier);
        strokeWeight(5);
        strokeWeight(2);

        triangle(-30 - 35 * sizeMult, 0, -30 - 55 * sizeMult, 0,  -30 - 65 * sizeMult, 25* sizeMult); //tail
        triangle(-30 - 35 * sizeMult, 0,  -30 - 55 * sizeMult, 0, -30 - 65 * sizeMult, -25* sizeMult); //tail

        triangle(-35, 18 * sizeMult, -15 ,16 * sizeMult, -35, 35 * sizeMult); //fin
        triangle(-35, -18 * sizeMult, -15 ,-16 * sizeMult, -35, -35 * sizeMult); //fin
        pop();
    }
  }
}
