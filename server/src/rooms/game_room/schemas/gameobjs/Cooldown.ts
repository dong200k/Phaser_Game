export default class Cooldown{
    private time: number
    private remainingTime: number
    public isFinished: boolean
    
    constructor(time: number, isFinished?: boolean){
        this.time = time;
        this.remainingTime = time
        this.isFinished = isFinished!==undefined? isFinished : true
    }

    public reset(){
        this.remainingTime = this.time;
        this.isFinished = false
    }

    public setTime(time: number, isFinished?: boolean){
        this.time = time;
        this.remainingTime = time
        if(isFinished !== undefined) this.isFinished = isFinished
    }

    public tick(deltaT: number){
        this.remainingTime -= deltaT;
        if(this.remainingTime <=0) this.isFinished = true
    }
}