import Matter from "matter-js";
import MathUtil from "../../../../../../../../../util/MathUtil";
import { getFinalSpeed } from "../../../../../../Formulas/formulas";
import StateNode from "../../../../../../StateMachine/StateNode";
import Entity from "../../../../../../../schemas/gameobjs/Entity";
import Monster from "../../../../../../../schemas/gameobjs/monsters/Monster";
import Player from "../../../../../../../schemas/gameobjs/Player";
import MeteorController from "../MeteorController";

/** In this state the projectile will play the explode animation and also be collideable */
export default class Impact extends StateNode{    
    private duration = 1
    private timeSoFar = 0

    public onEnter(): void {
        // this.spawnExplodingProjectile()
        this.timeSoFar = 0
        let stateMachine = (this.getStateMachine() as MeteorController);
        let projectile = stateMachine.getProjectile()

        projectile.setCollision("PLAYER_PROJECTILE")
        Matter.Body.setVelocity(projectile.getBody(), {x: 0, y: 0})
        projectile.animation.playAnimation("explode", {
            duration: this.duration
        })
    }
    public onExit(): void {
        
    }

    public update(deltaT: number): void {
        this.timeSoFar += deltaT
        if(this.timeSoFar >= this.duration){
            this.getStateMachine().changeState("Finish")
        }
    }
}