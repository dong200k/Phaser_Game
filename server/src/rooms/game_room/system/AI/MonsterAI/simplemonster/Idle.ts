import Matter from "matter-js";
import StateNode from "../../../StateMachine/StateNode";
import MonsterController from "./MonsterController";
import Entity from "../../../../schemas/gameobjs/Entity";

/** In this state the monster will not move.
 * It will ocasionally look for a new aggroTarget to follow.
 */
export default class Idle extends StateNode {

    private searchForNewTargetDefaultCooldown: number = 2;
    private searchForNewTargetCooldown: number = 2;

    public onEnter(): void {
        this.searchForNewTargetCooldown = this.searchForNewTargetDefaultCooldown;
        let stateMachine = (this.getStateMachine() as MonsterController);
        let monster = stateMachine.getMonster();
        monster.animation.playAnimation(this.getAnimation(), {
            loop: true
        })
    }
    public onExit(): void {
        
    }
    protected getAggroTarget(): Entity | undefined{
        let stateMachine = (this.getStateMachine() as MonsterController);
        let monster = stateMachine.getMonster();
        let aggroTarget = stateMachine.getPlayerManager().getNearestAlivePlayer(monster.x, monster.y);
        return aggroTarget
    }
    public update(deltaT: number): void {
        this.searchForNewTargetCooldown -= deltaT;
        let stateMachine = (this.getStateMachine() as MonsterController);
        let monster = stateMachine.getMonster();

        // Search for a new aggro target every 
        if(this.searchForNewTargetCooldown <= 0) {
            this.searchForNewTargetCooldown = this.searchForNewTargetDefaultCooldown;
            let aggroTarget = this.getAggroTarget()
            if(aggroTarget !== undefined) monster.setAggroTarget(aggroTarget);
        }

        // If the monster has an aggro target, change state. Otherwise do nothing.
        if(monster.getAggroTarget() !== null) {
            this.getStateMachine().changeState("Follow");
        } else {
            let body = monster.getBody();
            if(body) Matter.Body.setVelocity(body, {x: 0, y: 0});
        }
    }

    protected getAnimation(){
        return "idle"
    }
}