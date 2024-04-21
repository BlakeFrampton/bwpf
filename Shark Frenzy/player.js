class player{
  maxSpeed = 6;
  ColourMultiplier = 1;
  shrinkMult = 1;

    constructor(){
      this.position= createVector(0 , 0);
      this.velocity = createVector();
      this.acceleration = createVector();
      this.score = 402;
      this.hunger = 1;
      this.alive = true;
      this.eaten = false;
    }

    update(orca, effects, zoom, targetZoom){
      if (this.hunger == 0){
        this.starve();
      } 
      if (this.alive){
        targetZoom = this.checkPredatorCollision(orca, effects, targetZoom);

        this.hunger -= 0.0006;
        this.hunger = max(0,this.hunger);

        let mousePosition = createVector((mouseX - width/2) * zoom, (mouseY - height/2) * zoom);
        this.acceleration = mousePosition.sub(this.position);
        if (this.acceleration.mag() > 3){
        this.acceleration.limit(5 / (1 + this.score/200));
        this.acceleration.div(10);
        }
      }
      if (this.alive || this.hunger == 0) {
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.position.add(this.velocity);
      }
      return targetZoom;
    }

    starve(){
      this.alive = false;
      this.acceleration.mult(0.96);
      this.velocity.mult(0.96);
      if (this.ColourMultiplier > 0.65){
        this.ColourMultiplier *= 0.999;
      }
    }

    checkPredatorCollision(orca, effects, targetZoom){
      let sizeMult = 1 + this.score/150;
      let distance = dist(this.position.x, this.position.y, orca.position.x, orca.position.y);
      if (distance < 75 * sizeMult && sizeMult < 2.8){
        let position = createVector(this.position.x, this.position.y);
        effects.push(new deathEffect(position, 200 * sizeMult));
        this.alive = false;
        this.hunger = 0;
        this.eaten = true;
      }else if (distance< 75 * sizeMult && sizeMult > 3.2 && orca.alive){
        orca.alive = false;
        let position = createVector(orca.position.x, orca.position.y);
        effects.push(new deathEffect(position, 600));
        this.score += 30;
        this.hunger = 1;
        targetZoom += 1;
      }
      return targetZoom;
    }

    show() {
      if (this.eaten && this.shrinkMult > 0){
        this.shrinkMult -= 0.04;
        if (this.shrinkMult < 0){
          this.shrinkMult = 0 ;
        }
      }
      if (this.shrinkMult > 0){
        strokeWeight(15);
        stroke(250);
        push();
        translate(this.position.x, this.position.y);
        scale(this.shrinkMult);
        
        rotate(atan(this.velocity.y/this.velocity.x));
        if (this.velocity.x < 0){
           rotate(PI);
        }
        stroke(100 * this.ColourMultiplier);
        fill(100* this.ColourMultiplier);
        let sizeMult = 1 + this.score/150
        stroke(160* this.ColourMultiplier);
        strokeWeight(15 *sizeMult);
        ellipse(-30,0, 80 * sizeMult, 24 * sizeMult); //body

        fill(160 * this.ColourMultiplier);
        strokeWeight(5);
        noStroke();

        triangle(-30 - 35 * sizeMult, 0, -30 - 55 * sizeMult, 0,  -30 - 65 * sizeMult, 25* sizeMult); //tail
        triangle(-30 - 35 * sizeMult, 0,  -30 - 55 * sizeMult, 0, -30 - 65 * sizeMult, -25* sizeMult); //tail

        triangle(-35, 18 * sizeMult, -15 ,16 * sizeMult, -35, 35 * sizeMult); //fin
        triangle(-35, -18 * sizeMult, -15 ,-16 * sizeMult, -35, -35 * sizeMult); //fin
        pop();
      }
    }
}
