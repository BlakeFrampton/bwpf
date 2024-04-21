class deathEffect{
    constructor(position, radius){
        this.position= position;
        this.percentLifeLived = 0;
        this.maxRadius = radius;
    }

    update(effects){
        this.percentLifeLived += 0.005;
        let lifeRemaining = 1 - this.percentLifeLived;
        push();
        noStroke();
        fill(200 , 50 , 70 , 255 * lifeRemaining);
        ellipse(this.position.x, this.position.y, this.maxRadius *2 * this.percentLifeLived);

        if (lifeRemaining <= 0){
            let index = effects.indexOf(this);
            effects.splice(index, 1);
        }
        pop();
    }

}