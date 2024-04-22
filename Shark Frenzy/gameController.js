class gameController{
    constructor(zoom){
        this.score = 0;
        this.fishSpawned = 0;
        this.fishToSpawn = 0;
        this.orcasEaten = 0;
        this.initialZoom = zoom;
        this.targetZoom = this.initialZoom;
        this.zoom = this.initialZoom * pow(2, this.orcasEaten);
    }
    orcaEaten(){
        this.orcasEaten += 1;
        this.targetZoom = this.initialZoom +this.orcasEaten;
        
    }
}