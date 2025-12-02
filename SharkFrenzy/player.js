class player{
  maxSpeed = 6;
  ColourMultiplier = 1;
  shrinkMult = 1;
  boosting = false;
  latestTap = 0;

    constructor(){
      this.position= createVector(0 , 0);
      this.velocity = createVector();
      this.acceleration = createVector();
      this.hunger = 1;
      this.alive = true;
      this.eaten = false;
      this.sizeMult = 0;
      this.boostDuration = 0;
      this.redFishBoostMult = 2;
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

        if (this.boostDuration > 0) {
          this.boostDuration -= 1;
          this.velocity.limit(this.maxSpeed * this.redFishBoostMult + 1 / max(controller.score, 1)); //max avoids dividing by 0
        } else {
          this.velocity.limit(this.maxSpeed + 1 / max(controller.score, 1)); //max avoids dividing by 0
        }

        this.boostCheck();
        this.boost();
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


    //check boost for PC
    boostCheck(){
      if (!isMobileDevice){
        if (keyIsDown(32) || mouseIsPressed){
          this.boosting =true;
        }else{
          this.boosting = false;
        }
      }
    }


    doubletapCheck() {
      var now = new Date().getTime();
      var timesince = now - this.latestTap;
      if((timesince < 600) && (timesince > 0)){
        console.log("Double tap");
        this.boosting = true;
        this.boost();   
      }else{
          this.boosting =false;
      }
      this.latestTap = new Date().getTime();
    }

    //spend hunger to increase speed
    boost(){
      if (this.boosting == true){
      this.hunger -= 0.003;
      this.velocity.mult(1.3);
      this.hunger = max(0,this.hunger);
      }
    }

    redFishBoost(){
      console.log("boost")
      this.boostDuration = 60 * 1; // 4 seconds
    }

    checkPredatorCollision(effects, controller,flock){
      this.sizeMult = 1 + controller.score/150;
      let distance = dist(this.position.x, this.position.y, controller.orca.position.x,  controller.orca.position.y);
      if (distance < 72* (1 + controller.orcasEaten) && this.sizeMult < 2.8 * (1+controller.orcasEaten) &&controller.orca.alive){
        let position = createVector(this.position.x, this.position.y);
        effects.push(new deathEffect(position, 200 * this.sizeMult));
        this.alive = false;
        this.hunger = 0;
        this.eaten = true;
        controller.restartButton.position(width/2-60,height/2);
      } else if (distance < 40 * this.sizeMult + 120 * (1+ controller.orcasEaten)  && this.sizeMult > 3.2 * (1 + controller.orcasEaten) &&  controller.orca.alive){
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
        this.sizeMult = 1 + controller.score/150;
        stroke(160* this.ColourMultiplier);
        strokeWeight(15 *this.sizeMult);
        ellipse(-30,0, 80 * this.sizeMult, 24 * this.sizeMult); //body

        fill(160 * this.ColourMultiplier);
        strokeWeight(5);
        noStroke();

        triangle(-30 - 35 * this.sizeMult, 0, -30 - 55 * this.sizeMult, 0,  -30 - 65 * this.sizeMult, 25* this.sizeMult); //tail
        triangle(-30 - 35 * this.sizeMult, 0,  -30 - 55 * this.sizeMult, 0, -30 - 65 * this.sizeMult, -25* this.sizeMult); //tail

        triangle(-70 * this.sizeMult/3 -20, 18 * this.sizeMult, -20,16 * this.sizeMult, -70 * this.sizeMult/3 -20, 35 * this.sizeMult); //fin
        triangle(-70 * this.sizeMult/3 -20, -18 * this.sizeMult,-20 ,-16 * this.sizeMult, -70 * this.sizeMult/3 -20, -35 * this.sizeMult); //fin

        pop();
      }
    }

    getSizeMult(){
      return this.sizeMult;
    }
}
