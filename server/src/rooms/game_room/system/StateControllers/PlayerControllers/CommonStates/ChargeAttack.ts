import TriggerUpgradeEffect from "../../../../schemas/effects/trigger/TriggerUpgradeEffect";
import Player from "../../../../schemas/gameobjs/Player";
import ChargeAttackLogic from "../../../EffectLogic/EffectLogics/common/ChargeAttackLogic";
import StateMachine from "../../../StateMachine/StateMachine";
import StateNode from "../../../StateMachine/StateNode";
import EffectManager from "../../../StateManagers/EffectManager";
import PlayerController from "../PlayerController";

interface ChargeAttackConfig {
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
    
    chargeRatio?: number;
}

export default class ChargeAttack extends StateNode {

    private playerController!: PlayerController;
    private player!: Player;
    
    /** Total attack time. Including windup(for animations) time and trigger time. */
    protected attackDuration: number = 1;
    /** A percentage of attackDuration that passes before the attack triggers. E.g. if attackDuration=1 and 
     * triggerPercent=0.7, the attack will trigger at 0.7 seconds.
     */
    protected triggerPercent: number = 0;

    /** Has the attack been triggered or not. */
    private triggered: boolean = false;

    /** Can the player move when attacking. */
    private canMove: boolean = false;

    private timePassed: number = 0;
    
    private mouseX: number = 0;
    private mouseY: number = 0;
    private chargeRatio: number = 0;
    /**
     * Initialize this attack with some values.
     * @param config The AttackConfig.
     */
    public setConfig(config?: ChargeAttackConfig) {
        if(config) {
            this.attackDuration = config.attackDuration ?? this.attackDuration;
            this.triggerPercent = config.triggerPercent ?? this.attackDuration;
            this.canMove = config.canMove ?? this.canMove;
            this.mouseX = config.mouseX ?? this.mouseX;
            this.mouseY = config.mouseY ?? this.mouseY;
            this.chargeRatio = config.chargeRatio ?? this.chargeRatio;
        }
    }

    public onEnter(): void {
        this.playerController = this.getStateMachine<PlayerController>();
        this.player = this.playerController.getPlayer();
        // this.attackDuration = this.player.stat.attackSpeed/2;
        this.timePassed = 0;
        // this.player.canMove = this.canMove;
        this.triggered = false;
    }

    public onExit(): void {
        this.player.canMove = true;
    }

    public update(deltaT: number): void {
        this.timePassed += deltaT;

        // Trigger a charge attack if it hasn't been triggered and the timePassed is at the triggerPercent.
        if(!this.triggered && this.timePassed >= this.triggerPercent * this.attackDuration) {
            this.triggered = true;
            EffectManager.useTriggerEffectsOn(this.player, "player charge attack", this.player.getBody(), {mouseX: this.mouseX, mouseY: this.mouseY}, this.chargeRatio)
        }

        // End attack once we pass the attackDuration.
        if(this.timePassed >= this.attackDuration) {
            this.playerController.changeState("Idle");
        }
    }
    
}