class deathEffect{
    constructor(position, radius){
        this.position= position;
        this.percentLifeLived = 0.1;
        this.maxRadius = radius;
    }

    update(effects){
        this.percentLifeLived += 0.005;
        let lifeRemaining = 1 - this.percentLifeLived;
        push();
        if (lifeRemaining <= 0){
            let index = effects.indexOf(this);
            effects.splice(index, 1);
        }
        noStroke();
        let alphaMultiplier;
        if (lifeRemaining > 0.1){
        alphaMultiplier = Math.min(1, (Math.log10(lifeRemaining) + 1));
        } else{
            alphaMultiplier = 0;
        }
        fill(200 , 50 , 70 , 255 * alphaMultiplier); 
        ellipse(this.position.x, this.position.y, this.maxRadius *2 * (Math.log10(this.percentLifeLived) + 1));

        pop();
        
    }

}