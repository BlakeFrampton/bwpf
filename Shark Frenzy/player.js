class player{
  maxSpeed = 6;
  ColourMultiplier = 1;
  shrinkMult = 1;

    constructor(){
      this.position= createVector(0 , 0);
      this.velocity = createVector();
      this.acceleration = createVector();
      this.hunger = 1;
      this.alive = true;
      this.eaten = false;
    }

    update( effects, controller, flock ){
      if (this.alive){
        if (this.hunger == 0){
          this.starve(controller);
        } 
        this.checkPredatorCollision(effects, controller, flock);

        this.hunger -= 0.0006;
        this.hunger = max(0,this.hunger);

        let mousePosition = createVector((mouseX - width/2) * controller.zoom, (mouseY - height/2) * controller.zoom);
        this.acceleration = mousePosition.sub(this.position);
        if (this.acceleration.mag() > 3){
        this.acceleration.limit(5);
        this.acceleration.div(10);
        }
      }
      if (this.alive || this.hunger == 0) {
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed + 1 / max(controller.score, 1)); //max avoids dividing by 0
      this.position.add(this.velocity);
      }
    }

    starve(controller){
      this.alive = false;
      
      this.acceleration.mult(0.96);
      this.velocity.mult(0.96);
      if (this.ColourMultiplier > 0.65){
        this.ColourMultiplier *= 0.999;
      }

      controller.restartButton.position(width/2 -60,height/2);
    }

    checkPredatorCollision(effects, controller,flock){
      let sizeMult = 1 + controller.score/150;
      let distance = dist(this.position.x, this.position.y, controller.orca.position.x,  controller.orca.position.y);
      if (distance < 120* (1 + controller.orcasEaten) && sizeMult < 2.8 * (1+controller.orcasEaten) &&controller.orca.alive){
        let position = createVector(this.position.x, this.position.y);
        effects.push(new deathEffect(position, 200 * sizeMult));
        this.alive = false;
        this.hunger = 0;
        this.eaten = true;
        controller.restartButton.position(width/2-60,height/2);

      }else if (distance< 40 * sizeMult + 120 * (1+ controller.orcasEaten)  && sizeMult > 3.2* (1+controller.orcasEaten) &&  controller.orca.alive){
        controller.orca.alive = false;
        let position = createVector( controller.orca.position.x,  controller.orca.position.y);
        effects.push(new deathEffect(position, 600));
        this.hunger = 1;
        controller.orcaEaten(flock);
      }
    }

    show(controller) {
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
        let sizeMult = 1 + controller.score/150
        stroke(160* this.ColourMultiplier);
        strokeWeight(15 *sizeMult);
        ellipse(-30,0, 80 * sizeMult, 24 * sizeMult); //body

        fill(160 * this.ColourMultiplier);
        strokeWeight(5);
        noStroke();

        triangle(-30 - 35 * sizeMult, 0, -30 - 55 * sizeMult, 0,  -30 - 65 * sizeMult, 25* sizeMult); //tail
        triangle(-30 - 35 * sizeMult, 0,  -30 - 55 * sizeMult, 0, -30 - 65 * sizeMult, -25* sizeMult); //tail

        triangle(-70 * sizeMult/3 -20, 18 * sizeMult, -20,16 * sizeMult, -70 * sizeMult/3 -20, 35 * sizeMult); //fin
        triangle(-70 * sizeMult/3 -20, -18 * sizeMult,-20 ,-16 * sizeMult, -70 * sizeMult/3 -20, -35 * sizeMult); //fin

        pop();
      }
    }
}
