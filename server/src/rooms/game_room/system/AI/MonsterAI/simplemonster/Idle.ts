import Matter from "matter-js";
import StateNode from "../../../StateMachine/StateNode";
import MonsterController from "./MonsterController";

export default class Idle extends StateNode {

    private searchForNewTargetDefaultCooldown: number = 5;
    private searchForNewTargetCooldown: number = 5;

    public onEnter(): void {
        this.searchForNewTargetCooldown = this.searchForNewTargetDefaultCooldown;
    }
    public onExit(): void {
        
    }
    public update(deltaT: number): void {
        this.searchForNewTargetCooldown -= deltaT;
        let stateMachine = (this.getStateMachine() as MonsterController);
        let monster = stateMachine.getMonster();

        // Search for a new aggro target every 
        if(this.searchForNewTargetCooldown <= 0) {
            this.searchForNewTargetCooldown = this.searchForNewTargetDefaultCooldown;
            let aggroTarget = stateMachine.getPlayerManager().getNearestPlayer(monster.x, monster.y);
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

}