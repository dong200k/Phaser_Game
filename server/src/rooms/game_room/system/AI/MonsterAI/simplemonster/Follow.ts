import Matter from "matter-js";
import StateNode from "../../../StateMachine/StateNode";
import MonsterController from "./MonsterController";
import MathUtil from "../../../../../../util/MathUtil";

export default class Follow extends StateNode {

    public onEnter(): void {
        
    }
    public onExit(): void {
        
    }
    public update(deltaT: number): void {
        let stateMachine = (this.getStateMachine() as MonsterController);
        let monster = stateMachine.getMonster();
        let aggroTarget = monster.getAggroTarget();
        if(aggroTarget === null) {
            this.getStateMachine().changeState("Idle");
        } else {
            let body = monster.getBody();
            let speed = monster.stat.speed;
            let velocity = MathUtil.getNormalizedSpeed(aggroTarget.x - monster.x, aggroTarget.y - monster.y, speed);
            if(body) Matter.Body.setVelocity(body, velocity);
        }
    }

}