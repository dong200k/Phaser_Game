import MathUtil from "../../../../../../util/MathUtil";
import Cooldown from "../../../../schemas/gameobjs/Cooldown";
import Player from "../../../../schemas/gameobjs/Player";
import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import RangedMonsterController from "../rangemonster/RangedMonsterController";
import Phantom from "./states/Phantom";

export interface RangedPhantomMonsterData {
    monster: Monster;
    /** Cooldown of the phantom state in seconds */
    cooldown?: number;
    /** Duration of the phantom state in seconds */
    duration?: number;
}

/**
 * This controller controls the phantom ranged monster. 
 * This monster will occasionally enter a phantom state to becoming immune to collisions when the player approaches. 
 */
export default class RangedPhantomMonster extends RangedMonsterController {

    /** Cooldown of the phantom state in seconds */
    private cooldown!: Cooldown
    /** Duration of the phantom state in seconds */
    private duration = 2
    /** Range where monster enters the phantom state */
    private phantomRange = 100

    protected create(data: RangedPhantomMonsterData): void {
        super.create(data)

        this.cooldown = new Cooldown(data.cooldown ?? 3)

        this.addState(new Phantom("Phantom", this))
        
        //Set initial state
        this.changeState("Idle");
    }

    public update(deltaT: number): void {
        super.update(deltaT)

        this.cooldown.tick(deltaT)
        if(this.isCooldownReady()){
            this.monster.gameManager.gameObjects.forEach(obj=>{
                if(obj instanceof Player){
                    let distance = MathUtil.distance(this.monster.x, this.monster.y, obj.x, obj.y)
                    if(distance <= this.phantomRange && this.stateName !== "Phantom"){
                        this.resetCooldown()
                        this.changeState("Phantom")
                    }
                }
            })
        }
    }

    public isCooldownReady(){
        return this.cooldown.isFinished
    }

    public resetCooldown(){
        this.cooldown.reset()
    }

    public getDuration(){
        return this.duration
    }
}