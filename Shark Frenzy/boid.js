let perceptionRadius = 100;
let MaxForce = 0.5;

class boid{
    constructor(){
        this.position= createVector(random(width), random(height));
        this.velocity = createVector();
        this.velocity = p5.Vector.random2D(); 
        this.acceleration = createVector();
    }

    destroy(flock, effects){
        if (shark.alive == true){
        let index = flock.indexOf(this);
        shark.score += 3;
        shark.hunger += 0.05;
        shark.hunger = min(shark.hunger, 1);
        effects.push(new deathEffect(this.position, 50));
        flock.splice(index, 1);
        }
    }

    alignment(flock){
        let force = createVector();
        let NumOfLocals = 0;
        for (let other of flock){
            if (this.includeBoid(other, perceptionRadius)){
                force.add(other.velocity);
                NumOfLocals++;
            }
        }
        if (NumOfLocals > 0){
        force.div(NumOfLocals);
        }
        force.limit(MaxForce);
        return force;
    }

    cohesion(flock){
        let force = createVector();
        let NumOfLocals = 0;
        for (let other of flock){
            if (this.includeBoid(other,perceptionRadius)){
                force.add(other.position);
                NumOfLocals++;
            }
        }
        if (NumOfLocals > 0){
            force.div(NumOfLocals);
        }
        force.sub(this.position);
        force.limit(MaxForce);
        return force;
    }

    separation(flock){
        let force = createVector();
        let NumOfLocals = 0;
        let currentForce = createVector();
        for (let other of flock){
            if (this.includeBoid(other, perceptionRadius)){
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
        force.limit(MaxForce);
        force.mult(2);
        return force;
    }

    includeBoid(other, perceptionDist){
        let distance = dist(this.position.x, this.position.y, other.position.x, other.position.y)
        if (this !== other && distance <= perceptionDist){
            return true;
        }
        return false;
    }

    avoidShark(shark){
        let force = createVector();
        let distance = dist(this.position.x, this.position.y, shark.position.x, shark.position.y);
        if (distance <= perceptionRadius * 2* (1 + shark.score / 250)){
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
    
    sharkCollision(flock, shark, effects){
        let distance = dist(this.position.x, this.position.y, shark.position.x, shark.position.y);
        if (distance < 20 * (1 + shark.score/70) ){
           this.destroy(flock, effects);
        }
    }

    update(flock, shark, orca, effects){
        this.sharkCollision(flock, shark, effects);

        this.acceleration.mult(0);
        this.acceleration.add(this.cohesion(flock));
        this.acceleration.add(this.separation(flock));
        this.acceleration.add(this.alignment(flock));
        this.acceleration.add(this.avoidShark(shark));
        this.acceleration.add(this.avoidOrca(orca));
        this.acceleration.mult(0.8);

        this.velocity.add(this.acceleration);
        this.velocity.setMag(4);
        this.position.add(this.velocity);
    }

    show() {
        strokeWeight(15);
        stroke(250);
        fill(250);
        this.LoopEdges();
        push();
        translate(this.position.x, this.position.y);
        
        rotate(atan(this.velocity.y/this.velocity.x));
        if (this.velocity.x < 0){
           rotate(PI);
        }
        stroke(50, 70, 200, 230);
        fill(50, 70, 200, 200)
        triangle(-13,0.5, -13,-0.5,-11.5,0);
        ellipse(6,0,15,3);
        strokeWeight(3);
        stroke(40);
        point(12,-4);
        pop();
    }

    LoopEdges(){
        if (this.position.x > width) {
            this.position.x = 0;
          } else if (this.position.x < 0) {
            this.position.x = width;
          }
          if (this.position.y > height) {
            this.position.y = 0;
          } else if (this.position.y < 0) {
            this.position.y = height;
          }
    }
}
