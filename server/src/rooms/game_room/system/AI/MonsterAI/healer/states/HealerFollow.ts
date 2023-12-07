import Matter from "matter-js";
import MathUtil from "../../../../../../../util/MathUtil";
import { getFinalAttackSpeed } from "../../../../Formulas/formulas";
import Follow from "../../simplemonster/Follow";
import MonsterController from "../../simplemonster/MonsterController";
import HealerMonsterController from "../HealerMonsterController";

export default class HealerFollow extends Follow{
    protected follow(deltaT: number): void {
        let stateMachine = (this.getStateMachine() as HealerMonsterController);
        let monster = stateMachine.getMonster();
        let aggroTarget = monster.getAggroTarget();
        if(!aggroTarget) return

        // Follow monster but stay opposite from where they are moving
        let body = monster.getBody();
        let healRange = stateMachine.getHealRange()
        let aggroTargetVelocity = MathUtil.getNormalizedSpeed(aggroTarget.velocity.x, aggroTarget.velocity.y, 1)
        let offsetX = (aggroTarget.width/2 + healRange/2) * aggroTargetVelocity.x * (aggroTargetVelocity.x > 0? -1 : 1)
        let offsetY = (aggroTarget.height/2 + healRange/2) * aggroTargetVelocity.y * (aggroTargetVelocity.y > 0? -1 : 1)
        let aggroX = aggroTarget.x + offsetX
        let aggroY = aggroTarget.y + offsetY
        let speed = getFinalAttackSpeed(monster.stat) * deltaT;
        let velocity = MathUtil.getNormalizedSpeed(aggroX - monster.x, aggroY - monster.y, speed);
        if(body) Matter.Body.setVelocity(body, velocity);
    }
}