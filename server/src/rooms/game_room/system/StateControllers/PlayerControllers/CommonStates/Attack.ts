import EffectFactory from "../../../../schemas/effects/EffectFactory";
import SpeedMultiEffect from "../../../../schemas/effects/temp/SpeedMultiEffect";
import Player from "../../../../schemas/gameobjs/Player";
import Stat from "../../../../schemas/gameobjs/Stat";
import Projectile from "../../../../schemas/projectiles/Projectile";
import { getFinalAttackSpeed } from "../../../Formulas/formulas";
import StateMachine from "../../../StateMachine/StateMachine";
import StateNode from "../../../StateMachine/StateNode";
import EffectManager from "../../../StateManagers/EffectManager";
import { GameEvents, IProjectileConfig } from "../../../interfaces";
import PlayerController from "../PlayerController";

interface AttackConfig {
    /** Total attack time. Including windup(for animations) time and trigger time. */
    attackDuration?: number;

    /** A percentage of attackDuration that passes before the attack triggers. E.g. if attackDuration=1 and 
     * triggerPercent=0.7, the attack will trigger at 0.7 seconds.
     */
    triggerPercent?: number;

    /** Can the player move when attacking. */
    canMove?: boolean;

    mouseX?: number;
    
    mouseY?: number;
}

export default class Attack extends StateNode {

    protected playerController!: PlayerController;
    protected player!: Player;
    
    /** Total attack time. Including windup(for animations) time and trigger time. */
    protected attackDuration: number = 1;
    protected originalAttackDuration = 1;
    /** A percentage of attackDuration that passes before the attack triggers. E.g. if attackDuration=1 and 
     * triggerPercent=0.7, the attack will trigger at 0.7 seconds.
     */
    protected triggerPercent: number = 0.3;

    /** Has the attack been triggered or not. */
    protected triggered: boolean = false;

    /** Can the player move when attacking. */
    protected canMove: boolean = false;

    protected timePassed: number = 0;
    
    protected mouseX: number = 0;
    protected mouseY: number = 0;
    protected animationKey = "1_atk"
    protected slowFactor = 0.5
    protected speedEffect?: SpeedMultiEffect
    /**
     * Initialize this attack with some values.
     * @param config The AttackConfig.
     */
    public setConfig(config?: AttackConfig) {
        if(config) {
            this.attackDuration = config.attackDuration ?? 1;
            this.originalAttackDuration = this.attackDuration
            this.triggerPercent = config.triggerPercent ?? 0.3;
            this.canMove = config.canMove ?? false;
            this.mouseX = config.mouseX ?? this.mouseX;
            this.mouseY = config.mouseY ?? this.mouseY;
        }
    }

    public onEnter(): void {
        // console.log("player controller attack state on enter")
        this.playerController = this.getStateMachine<PlayerController>();
        this.player = this.playerController.getPlayer();
        this.timePassed = 0;
        // this.player.canMove = this.canMove; // Uncommented so player wont move when attacking.
        this.triggered = false;

        // Checks if the player's sprite should flip or not.
        let flip = (this.player.x - this.mouseX) > 0;

        this.attackDuration = this.originalAttackDuration / getFinalAttackSpeed(this.player.stat) // duration lowered based on player attack speed
        this.player.animation.playAnimation(this.animationKey, {
            duration: this.attackDuration,
            flip: flip,
        });

        this.speedEffect = EffectFactory.createSpeedMultiplierEffectTimed(this.slowFactor, this.attackDuration)
        EffectManager.addEffectsTo(this.player, this.speedEffect)
        // console.log("Flip", flip);
    }

    public onExit(): void {
        this.player.canMove = true;
        if(this.speedEffect) EffectManager.removeEffectFrom(this.player, this.speedEffect)
    }

    public update(deltaT: number): void {
        this.timePassed += deltaT;
        // Trigger an attack if it hasn't been triggered and the timePassed is at the triggerPercent.
        if(!this.triggered && this.timePassed >= this.triggerPercent * this.attackDuration) {
            this.triggered = true;
            // Trigger the attack.
            EffectManager.useTriggerEffectsOn(this.player, "player attack", this.player.getBody(), {mouseX: this.mouseX, mouseY: this.mouseY})            
        }

        // End attack once we pass the attackDuration.
        if(this.timePassed >= this.attackDuration) {
            this.playerController.changeState("Idle");
        }
    }
}