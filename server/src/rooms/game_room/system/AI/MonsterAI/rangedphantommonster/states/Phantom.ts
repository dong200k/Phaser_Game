
import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import { getFinalAttackCooldown, getFinalAttackRange } from "../../../../Formulas/formulas";
import MathUtil from "../../../../../../../util/MathUtil";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import RangedPhantomMonster from "../RangedPhantomMonster";

/**
 * The Phantom state is entered periodically. In this state the monster will gain a phantom effect becoming immune to collisions.
 */
export default class Phantom extends StateNode {

    /** The time it takes for a attack to complete. */ 
    protected defaultAttackCooldown: number = 0.5;

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.95;

    /** The attack cooldown. Goes from defaultAttackCooldown to 0. */
    protected attackCooldown: number = 0.5;

    /** Has the attack been triggered. */
    protected attackTriggered: boolean = false;

    public onEnter(): void {
        // Setting the default attack cooldown for this monster.
        let stateMachine = this.getStateMachine<RangedPhantomMonster>();
        let monster = stateMachine.getMonster();
        this.defaultAttackCooldown = getFinalAttackCooldown(monster.stat);
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
        // Stop movement
        Matter.Body.setVelocity(monster.getBody(), {x: 0, y: 0});

        // monster.animation.playAnimation("death")
    }

    public onExit(): void {
        
    }

    private enterPhantomState(){
        let stateMachine = this.getStateMachine<RangedPhantomMonster>();
        let monster = stateMachine.getMonster();

        let phantomEffect = EffectFactory.createPhantomEffectTimed(stateMachine.getDuration())
        EffectManager.addEffectsTo(monster, phantomEffect)
    }

    public update(deltaT: number): void {
        let stateMachine = this.getStateMachine<RangedPhantomMonster>();
        let monster = stateMachine.getMonster();

        this.attackCooldown -= deltaT;

        if(!this.attackTriggered) {
            if(this.attackCooldown <= this.defaultAttackCooldown * (this.attackTriggerPercent)) {
                this.enterPhantomState()                
                this.attackTriggered = true;
            }
        }
        
        if(this.attackCooldown <= 0) {
            let aggroTarget = monster.getAggroTarget();

            // If the aggroTarget is null change to the Idle state.
            if(aggroTarget == null) {
                stateMachine.changeState("Idle");
            } else {
                stateMachine.changeState("Follow");
            }
        }
    }

    private resetAttack() {
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
    }

}