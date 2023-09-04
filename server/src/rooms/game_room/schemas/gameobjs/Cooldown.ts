import { Schema, type } from '@colyseus/schema';
export default class Cooldown extends Schema{
    @type('number') time: number
    @type('number') remainingTime: number
    @type('boolean') isFinished: boolean
    
    constructor(time: number, isFinished?: boolean){
        super()
        this.time = time;
        this.remainingTime = time
        this.isFinished = isFinished!==undefined? isFinished : true
    }

    /**
     * Restart the cooldown timer and set state to not finished.
     */
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
        if(this.isFinished) return

        // update remaining time
        this.remainingTime -= deltaT;
        if(this.remainingTime <=0) {
            this.isFinished = true
            this.remainingTime = this.time
        }
    }
}