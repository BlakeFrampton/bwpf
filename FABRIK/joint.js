let jointSize = 10;

class joint{
    constructor(x, y){
        this.position = createVector(x, y);
    }

    getPosition(){
        return this.position;
    }

    setPosition(x, y){
        this.position = createVector(x, y);
    }

    static getJointSize(){
        return jointSize;
    }
}
