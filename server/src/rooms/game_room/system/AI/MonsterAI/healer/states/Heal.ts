
import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import { getFinalAttackCooldown, getFinalAttackRange } from "../../../../Formulas/formulas";
import MathUtil from "../../../../../../../util/MathUtil";
import { SpawnPoint } from "../../../../../schemas/dungeon/Dungeon";
import HealerMonsterController from "../HealerMonsterController";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";

/**
 * The Heal state is entered periodically. In this state the monster will heal nearby monsters
 */
export default class Heal extends StateNode {

    /** The time it takes for a attack to complete. */ 
    protected defaultAttackCooldown: number = 1;

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.95;

    /** The attack cooldown. Goes from defaultAttackCooldown to 0. */
    protected attackCooldown: number = 1;

    /** Has the attack been triggered. */
    protected attackTriggered: boolean = false;

    public onEnter(): void {
        // Setting the default attack cooldown for this monster.
        let stateMachine = this.getStateMachine<HealerMonsterController>();
        let monster = stateMachine.getMonster();
        // this.defaultAttackCooldown = getFinalAttackCooldown(monster.stat);
        // this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
        // Stop movement
        Matter.Body.setVelocity(monster.getBody(), {x: 0, y: 0});

        monster.animation.playAnimation("death")
    }

    public onExit(): void {
        
    }

    protected heal() {
        let stateMachine = this.getStateMachine<HealerMonsterController>();
        let monster = stateMachine.getMonster();
        let healRange = stateMachine.getHealRange();

        stateMachine.getPlayerManager().getGameManager().gameObjects.forEach(obj=>{
            if(obj instanceof Monster){
                // Heal monster if they are within healRange of healer
                let distance = MathUtil.distance(monster.x, monster.y, obj.x, obj.y)
                if(distance <= healRange){
                    let healEffect = EffectFactory.createHealEffect(stateMachine.getHealAmount())
                    EffectManager.addEffectsTo(obj, healEffect)
                }
            }
        })
    }

    public update(deltaT: number): void {
        let stateMachine = this.getStateMachine<HealerMonsterController>();
        let monster = stateMachine.getMonster();

        this.attackCooldown -= deltaT;

        if(!this.attackTriggered) {
            if(this.attackCooldown <= this.defaultAttackCooldown * (this.attackTriggerPercent)) {
                this.heal()                
                this.attackTriggered = true;
            }
        }
        
        if(this.attackCooldown <= 0) {
            let aggroTarget = monster.getAggroTarget() as Monster;

            // if(aggroTarget == null || aggroTarget.controller.stateName === "Death" || !aggroTarget.isActive()) {
            //     stateMachine.changeState("Idle");
            // } else {
                // stateMachine.changeState("Follow");
            // }
            monster.setAggroTarget(null)
            stateMachine.changeState("Idle");

        }
    }

    private resetAttack() {
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
    }

}