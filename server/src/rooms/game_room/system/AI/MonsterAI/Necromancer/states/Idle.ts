import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import NecromancerController from "../NecromancerController";
import Entity from "../../../../../schemas/gameobjs/Entity";

/** In this state the monster will not move.
 * It will ocasionally look for a new aggroTarget to follow.
 */
export default class Idle extends StateNode {

    private searchForNewTargetDefaultCooldown: number = 2;
    private searchForNewTargetCooldown: number = 2;

    public onEnter(): void {
        this.searchForNewTargetCooldown = this.searchForNewTargetDefaultCooldown;
        let stateMachine = (this.getStateMachine() as NecromancerController);
        let monster = stateMachine.getMonster();
        monster.animation.playAnimation("idle", {
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
    public update(deltaT: number): void {
        this.searchForNewTargetCooldown -= deltaT;
        let stateMachine = (this.getStateMachine() as NecromancerController);
        let monster = stateMachine.getMonster();
    }

}