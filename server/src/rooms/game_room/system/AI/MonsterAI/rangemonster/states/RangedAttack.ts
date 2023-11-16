import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import MonsterController from "../../simplemonster/MonsterController";
import { getFinalAttackCooldown, getFinalAttackRange, getFinalAttackSpeed } from "../../../../Formulas/formulas";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import MathUtil from "../../../../../../../util/MathUtil";
import Attack from "../../simplemonster/Attack";
import RangedMonsterController from "../RangedMonsterController";

/**
 * The Attack state is entered when the monster is in attackRange of its aggroTarget.
 * The monster will then perform its attack on its aggroTarget.
 */
export default class RangedAttack extends Attack{

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.5;
    private projectileSpeed = 3

    onEnter(){
        super.onEnter()
        this.getStateMachine()
        let stateMachine = this.getStateMachine<MonsterController>();
        let monster = stateMachine.getMonster();
        monster.animation.playAnimation("attack", {
            duration: getFinalAttackCooldown(monster.stat)
        })
    }
    
    protected attack(): void {
        let stateMachine = this.getStateMachine<RangedMonsterController>();
        let monster = stateMachine.getMonster();
        let target = monster.getAggroTarget();

        if(target) {
            let projectileConfig: IProjectileConfig;
            projectileConfig = {
                sprite: "purple_arrow",
                stat: monster.stat,
                spawnX: monster.x,
                spawnY: monster.y,
                width: 15,
                height: 15,
                initialVelocity: MathUtil.getNormalizedSpeed(target.x - monster.x, target.y - monster.y, this.projectileSpeed),
                collisionCategory: "MONSTER_PROJECTILE",
                // range: 100,
                activeTime: 1500,
                poolType: "purple_arrow",
                attackMultiplier: 1,
                magicMultiplier: 0,
                classType: "Projectile",
            }
            // console.log(`spawning monster projectile at: (${projectileConfig.spawnX}, ${projectileConfig.spawnY})`);
            stateMachine.getPlayerManager().getGameManager().getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
        }

        this.getStateMachine().changeState("Follow")
    }
}