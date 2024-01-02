import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import NecromancerController from "../NecromancerController";
import Entity from "../../../../../schemas/gameobjs/Entity";

/** In this state the monster will not move.
 * It will ocasionally look for a new aggroTarget to follow.
 */
export default class Teleport extends StateNode {

    /** The time it takes for a attack to complete. */ 
    protected defaultAttackCooldown: number = 1;

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.95;

    /** The attack cooldown. Goes from defaultAttackCooldown to 0. */
    protected attackCooldown: number = 1;

    /** Has the attack been triggered. */
    protected attackTriggered: boolean = false;

    public onEnter(): void {
        let stateMachine = (this.getStateMachine() as NecromancerController);
        let monster = stateMachine.getMonster();
        monster.animation.playAnimation("teleport", {
            loop: true
        })
        let body = monster.getBody();
        if(body) Matter.Body.setVelocity(body, {x: 0, y: 0});
    }
    public onExit(): void {
        
    }
    protected getAggroTarget(): Entity | undefined{
        let stateMachine = (this.getStateMachine() as NecromancerController);
        let monster = stateMachine.getMonster();
        let aggroTarget = stateMachine.getPlayerManager().getNearestAlivePlayer(monster.x, monster.y);
        return aggroTarget
    }
    protected teleport(){
        let target = this.getAggroTarget()
        if(target){
            let stateMachine = (this.getStateMachine() as NecromancerController);
            let monster = stateMachine.getMonster();
            let body = monster.getBody()
            let offsetX = (Math.random() * 200 + 50) * Math.random()<0.5? 1 : -1
            let offsetY = (Math.random() * 200 + 50) * Math.random()<0.5? 1 : -1
            monster.setAggroTarget(target)

            Matter.Body.setPosition(body, {x: target.x + offsetX, y: target.y + offsetY})
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