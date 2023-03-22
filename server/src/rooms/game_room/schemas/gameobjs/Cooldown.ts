export default class Cooldown{
    private time: number
    private remainingTime: number
    public isUp: boolean
    
    constructor(time: number, isUp?: boolean){
        this.time = time;
        this.remainingTime = time
        this.isUp = isUp!==undefined? isUp : true
    }

    public reset(){
        this.remainingTime = this.time;
        this.isUp = false
    }

    public setTime(time: number, isUp?: boolean){
        this.time = time;
        this.remainingTime = time
        if(isUp !== undefined) this.isUp = isUp
    }

    public tick(deltaT: number){
        this.remainingTime -= deltaT;
        if(this.remainingTime <=0) this.isUp = true
    }
}