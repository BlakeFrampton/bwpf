class boid{
    constructor(xPos, yPos, iFrames){
        this.position= createVector(xPos,yPos);
        this.velocity = createVector(-xPos, -yPos);
        if (this.velocity.mag == 0){
        this.velocity = p5.Vector.random2D(); 
        }
        this.acceleration = createVector();

        this.invincibilityFrames = iFrames;

        this.colour = "blue";
        this.points = 3;
        this.maxVelocity =4;
        this.hungerValue = 0.05;
        this.perceptionRadius = 100;
        this.maxForce = 0.5;
        this.scale = 1;

        let rndInt = int(random(1,75));
        if (rndInt == 1){
            this.colour = "gold";
            this.points = 30;
            this.maxVelocity = 5;
            this.hungerValue = 0.05;
        }else if (rndInt == 2){
            this.colour = "green";
            this.hungerValue = 0.2;
            this.perceptionRadius = 200;
        }else if (rndInt >= 65){
            this.colour = "orange"
            this.maxForce = 0.25;
            this.scale = 2;
            this.hungerValue = 0.1;
        }
    }

    destroy(flock, effects, controller, shark){
        if (shark.alive == true){
        let index = flock.indexOf(this);
        controller.score += this.points;
        shark.hunger += this.hungerValue / (controller.orcasEaten + 1);
        shark.hunger = min(shark.hunger, 1);
        effects.push(new deathEffect(this.position, 50));
        flock.splice(index, 1);
        if (controller.fishSpawned < controller.fishToSpawn){
        controller.spawnFish(flock);
        }
        }
    }

    alignment(flock){
        let force = createVector();
        let NumOfLocals = 0;
        for (let other of flock){
            if (this.includeBoid(other, this.perceptionRadius)){
                force.add(other.velocity);
                NumOfLocals++;
            }
        }
        if (NumOfLocals > 0){
        force.div(NumOfLocals);
        }
        force.limit(this.maxForce);
        return force;
    }

    cohesion(flock){
        let force = createVector();
        let NumOfLocals = 0;
        for (let other of flock){
            if (this.includeBoid(other,this.perceptionRadius)){
                force.add(other.position);
                NumOfLocals++;
            }
        }
        if (NumOfLocals > 0){
            force.div(NumOfLocals);
        }
        force.sub(this.position);
        force.limit(this.maxForce);
        return force;
    }

    separation(flock){
        let force = createVector();
        let NumOfLocals = 0;
        let currentForce = createVector();
        for (let other of flock){
            if (this.includeBoid(other, this.perceptionRadius)){
                currentForce = p5.Vector.sub(this.position, other.position);
                let distance = dist(this.position.x, this.position.y, other.position.x, other.position.y)
                if (distance > 0){
                currentForce.div(pow(distance, 2));
                }
                force.add(currentForce);
            }
        if (NumOfLocals > 0){
            force.div(NumOfLocals);
        }
        }
        force.limit(this.maxForce);
        force.mult(4);
        return force;
    }

    wiggle(shark){
        let force = createVector(0,0);
        let distance = dist(this.position.x, this.position.y, shark.position.x, shark.position.y);
        if (distance <= (this.perceptionRadius + 30) * 2* (1 + shark.score / 250)){
        force.x = random(-1, 1);
        force.y = random(-1, 1);
        force.mult(0.5);
        }
        return force;
    }

    includeBoid(other, perceptionDist){
        let distance = dist(this.position.x, this.position.y, other.position.x, other.position.y)
        if (this !== other && distance <= perceptionDist){
            return true;
        }
        return false;
    }

    avoidShark(shark, controller){
        let force = createVector();
        let distance = dist(this.position.x, this.position.y, shark.position.x, shark.position.y);
        if (distance <= this.perceptionRadius * 2* (1 + controller.score / 250)){
            force = p5.Vector.sub(this.position, shark.position);
            if (distance > 0){
            force.div(distance);
            }
        }
        return force;
    }

    avoidOrca(orca){
        let force = createVector();
        let distance = dist(this.position.x, this.position.y, orca.position.x, orca.position.y);
        if (distance <=200){
            force = p5.Vector.sub(this.position, orca.position);
            if (distance > 0){
            force.div(distance);
            }
        }
        return force;
    }
    
    sharkCollision(flock, shark, effects, controller){
        let distance = dist(this.position.x, this.position.y, shark.position.x, shark.position.y);
        if (distance < 20 * (1 + controller.score/70) && this.invincibilityFrames == 0 ){
         this.destroy(flock, effects,controller, shark);
        }
    }

    update(flock, shark, effects, controller){
        this.invincibilityFrames = max(0, this.invincibilityFrames-1);
        this.sharkCollision(flock, shark, effects, controller);

        this.acceleration.mult(0);
        this.acceleration.add(this.cohesion(flock));
        this.acceleration.add(this.separation(flock));
        this.acceleration.add(this.alignment(flock));
        this.acceleration.add(this.avoidShark(shark,controller));
        this.acceleration.add(this.avoidOrca(controller.orca));
        this.acceleration.add(this.wiggle(shark));
        this.acceleration.mult(0.8);

        this.velocity.add(this.acceleration);
        this.velocity.setMag(this.maxVelocity);
        this.position.add(this.velocity);
    }

    show(controller) {
        strokeWeight(15);
        stroke(250);
        fill(250);
        this.LoopEdges(controller.zoom);
        push();
        translate(this.position.x, this.position.y);
        
        rotate(atan(this.velocity.y/this.velocity.x));
        if (this.velocity.x < 0){
           rotate(PI);
        }
        if (this.colour == "blue"){
            stroke(50, 70, 200);
        } else if(this.colour == "gold"){
            stroke(200,180, 53)
        } else if(this.colour == "green"){
            stroke(39, 189, 80);
        } else if(this.colour == "orange"){
            stroke(255, 158, 11);
        }
        triangle(-13 ,0.5* this.scale, -13,-0.5* this.scale,-11.5 ,0);
        ellipse(6* this.scale,0,15* this.scale,3* this.scale);
        strokeWeight(2.5 + 0.5 * this.scale);
        stroke(40);
        point(12* this.scale,-4);
        pop();
    }

    LoopEdges(zoom){
        let looped = false;
        if (this.position.x > width/2 * zoom   ) {
            this.position.x = -width/2 * zoom;
            looped = true;
          } else if (this.position.x < -width/2 * zoom) {
            this.position.x = width/2* zoom;
            looped = true;
          }
          if (this.position.y > height/2* zoom) {
            this.position.y = -height/2 * zoom;
            looped = true;
          } else if (this.position.y < -height/2* zoom) {
            this.position.y = height/2* zoom;
            looped = true;
          }
          if (looped){
            this.invincibilityFrames = 10;
          }
    }
}
