class gameController{

    constructor(zoom){
        this.score = 0;
        this.fishSpawned = 0;
        this.fishToSpawn = 180;
        this.maxFish;
        this.orcasEaten = 0;
        this.initialZoom = zoom;
        this.targetZoom = this.initialZoom;
        this.zoom = this.initialZoom * pow(2, this.orcasEaten);
        this.orca = new predator(this.orcasEaten, this.zoom);
        this.restartButton =  createButton("Restart");
        this.restartButton.mouseClicked(restart);
        this.restartButton.position(-50,-50);
        this.restartButton.class("button restart");
    }

    spawnFish(flock){
        this.fishSpawned += 1;
        let x;
        let y;
        if (random(1)> 0.5){
            x = -width/2
            if (random(1)>0.5){
                x = abs(x);
            }
            y = random(-height/2, height/2);
        }else{
            y = -height/2
            if (random(1)>0.5){
                y = abs(y);
            }
            x = random(-width/2, width/2);
        }
        flock.push(new boid(x * this.targetZoom,y * this.targetZoom));
    }

    orcaEaten(flock){
        this.orcasEaten += 1;
        controller.score += 30;
        this.targetZoom = this.initialZoom +this.orcasEaten;
        this.fishSpawned = flock.length;
        while (this.fishSpawned< this.maxFish){
            this.spawnFish(flock);
        }
    }
}