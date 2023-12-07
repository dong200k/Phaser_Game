import MathUtil from "../../../../../../../util/MathUtil";
import Player from "../../../../../schemas/gameobjs/Player";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import Idle from "../../simplemonster/Idle";
import HealerMonsterController from "../HealerMonsterController";

export default class HealerIdle extends Idle{
    /** Find monster with most maximum health. In case there are many find closest one */
    protected getAggroTarget() {
        let stateMachine = (this.getStateMachine() as HealerMonsterController);
        let monster = stateMachine.getMonster();
        let monsters: Monster[] = []
        let maxHpSoFar = 0

        // Find monsters with most maxHp
        stateMachine.getPlayerManager().getGameManager().gameObjects.forEach(obj=>{
            if(obj instanceof Monster && obj.isActive() && obj.controller.stateName !== "Death" && obj !== stateMachine.getMonster()){
                let maxHp = obj.stat.maxHp
                // console.log(`maxHpSoFar: ${maxHpSoFar}, maxHp: ${maxHp}, name: ${obj?.getMonsterName()}`)
                if(maxHp > maxHpSoFar){
                    monsters = [obj]
                    maxHpSoFar = maxHp
                }
                else if(maxHp === maxHpSoFar){
                    monsters.push(obj)
                }
            }
        })
        
        // Get monster with closest distance
        monsters.sort((a, b)=>{
            let distanceToA = MathUtil.distance(a.x, a.y, monster.x, monster.y)
            let distanceToB = MathUtil.distance(b.x, b.y, monster.x, monster.y)
            if(distanceToA < distanceToB) return -1
            else if(distanceToA > distanceToB) 1
            return 0
        })

        console.log(`healer is healing: ${monsters[0]?.getMonsterName()}`)
        return monsters[0]
    }
}