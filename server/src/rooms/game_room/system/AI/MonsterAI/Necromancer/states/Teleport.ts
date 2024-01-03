import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import NecromancerController from "../NecromancerController";
import Entity from "../../../../../schemas/gameobjs/Entity";

/** In this state the monster will not move.
 * It will ocasionally look for a new aggroTarget to follow.
 */
export default class Teleport extends StateNode {

    /** The time it takes for a attack to complete. */ 
    protected defaultAttackCooldown: number = 0.5;

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.5;

    /** The attack cooldown. Goes from defaultAttackCooldown to 0. */
    protected attackCooldown: number = 1;

    /** Has the attack been triggered. */
    protected attackTriggered: boolean = false;

    public onEnter(): void {
        let stateMachine = (this.getStateMachine() as NecromancerController);
        let monster = stateMachine.getMonster();
        this.attackCooldown = this.defaultAttackCooldown
        monster.animation.playAnimation("teleport", {
            duration: this.defaultAttackCooldown - this.defaultAttackCooldown * this.attackTriggerPercent
        })
        let body = monster.getBody();
        if(body) Matter.Body.setVelocity(body, {x: 0, y: 0});
        console.log("necromancer teleport")
    }
    public onExit(): void {
        this.attackTriggered = false
    }
    protected getAggroTarget(): Entity | undefined{
        let stateMachine = (this.getStateMachine() as NecromancerController);
        let monster = stateMachine.getMonster();
        let aggroTarget = stateMachine.getPlayerManager().getNearestAlivePlayer(monster.x, monster.y);
        console.log(`teleport aggro target is undefined: ${aggroTarget === undefined}`)
        return aggroTarget
    }
    protected teleport(){
        let stateMachine = (this.getStateMachine() as NecromancerController);
        let monster = stateMachine.getMonster();
        let target = this.getAggroTarget()
        if(target){
            let body = monster.getBody()
            let offsetX = (Math.random() * 50 + 200) * Math.random()<0.5? 1 : -1
            let offsetY = (Math.random() * 50 + 200) * Math.random()<0.5? 1 : -1
            monster.setAggroTarget(target)
            // console.log(`necromancer teleporting to: ${target.x + offsetX}, ${target.y+offsetY}`)
            Matter.Body.setPosition(body, {x: target.x + offsetX, y: target.y + offsetY})
            monster.sound.playSoundEffect("teleport")
        }
    }
    public update(deltaT: number): void {
        let stateMachine = this.getStateMachine<NecromancerController>();

        this.attackCooldown -= deltaT;

        if(!this.attackTriggered) {
            if(this.attackCooldown <= this.defaultAttackCooldown * (this.attackTriggerPercent)) {
                // Trigger an attack.
                // monster.animation.playAnimation("death", false);
                this.teleport()                
                this.attackTriggered = true;
            }
        }
        
        if(this.attackCooldown <= 0) {
            stateMachine.changeState("Idle");
        }
    }

}