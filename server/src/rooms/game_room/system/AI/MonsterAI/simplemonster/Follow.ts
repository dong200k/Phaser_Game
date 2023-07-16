import Matter from "matter-js";
import StateNode from "../../../StateMachine/StateNode";
import MonsterController from "./MonsterController";
import MathUtil from "../../../../../../util/MathUtil";
import { getFinalAttackRange, getFinalSpeed } from "../../../Formulas/formulas";

/**
 * In this state the monster will follow its aggroTarget.
 */
export default class Follow extends StateNode {

    public onEnter(): void {
        
    }
    public onExit(): void {
        let body = this.getStateMachine<MonsterController>().getMonster().getBody();
        Matter.Body.setVelocity(body, {x: 0, y: 0});
    }
    public update(deltaT: number): void {
        let stateMachine = (this.getStateMachine() as MonsterController);
        let monster = stateMachine.getMonster();
        let aggroTarget = monster.getAggroTarget();
        if(aggroTarget === null) {
            this.getStateMachine().changeState("Idle");
        } else {
            let body = monster.getBody();
            let speed = getFinalSpeed(monster.stat) * deltaT;
            let velocity = MathUtil.getNormalizedSpeed(aggroTarget.x - monster.x, aggroTarget.y - monster.y, speed);
            if(body) Matter.Body.setVelocity(body, velocity);

            let attackRange = getFinalAttackRange(monster.stat);
            if(MathUtil.distance(monster.x, monster.y, aggroTarget.x, aggroTarget.y) <= attackRange) {
                this.getStateMachine().changeState("Attack");
            }
        }
    }

}