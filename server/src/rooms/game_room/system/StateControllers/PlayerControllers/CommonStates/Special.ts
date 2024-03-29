import EffectFactory from "../../../../schemas/effects/EffectFactory";
import SpeedMultiEffect from "../../../../schemas/effects/temp/SpeedMultiEffect";
import Player from "../../../../schemas/gameobjs/Player";
import StateMachine from "../../../StateMachine/StateMachine";
import StateNode from "../../../StateMachine/StateNode";
import EffectManager from "../../../StateManagers/EffectManager";
import PlayerController from "../PlayerController";

interface SpecialConfig {
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

export default class Special extends StateNode {

    protected playerController!: PlayerController;
    protected player!: Player;
    
    /** Total attack time. Including windup(for animations) time and trigger time. */
    protected attackDuration: number = 1;
    /** A percentage of attackDuration that passes before the attack triggers. E.g. if attackDuration=1 and 
     * triggerPercent=0.7, the attack will trigger at 0.7 seconds.
     */
    protected triggerPercent: number = 0;

    /** Has the attack been triggered or not. */
    protected triggered: boolean = false;

    /** Can the player move when attacking. */
    protected canMove: boolean = false;

    protected timePassed: number = 0;
    
    protected mouseX: number = 0;
    protected mouseY: number = 0;
    protected slowFactor = 0.5
    protected speedEffect?: SpeedMultiEffect
    /**
     * Initialize this attack with some values.
     * @param config The AttackConfig.
     */
    public setConfig(config?: SpecialConfig) {
        if(config) {
            this.attackDuration = config.attackDuration ?? this.attackDuration;
            this.triggerPercent = config.triggerPercent ?? this.triggerPercent;
            this.canMove = config.canMove ?? this.canMove;
            this.mouseX = config.mouseX ?? this.mouseX;
            this.mouseY = config.mouseY ?? this.mouseY;
        }
    }

    public onEnter(): void {
        this.playerController = this.getStateMachine<PlayerController>();
        this.player = this.playerController.getPlayer();
        // this.attackDuration = this.player.stat.attackSpeed/2;
        this.timePassed = 0;
        // this.player.canMove = this.canMove;
        this.triggered = false;

        // Checks if the player's sprite should flip or not.
        let flip = (this.player.x - this.mouseX) > 0;
        // console.log("playing special animation")
        if(this.player.role === "Ranger" || this.player.role === "Warrior"){
             this.player.animation.playAnimation("2_atk", {
                duration: this.attackDuration,
                flip: flip,
            });
        }

        this.speedEffect = EffectFactory.createSpeedMultiplierEffectTimed(this.slowFactor, this.attackDuration)
        EffectManager.addEffectsTo(this.player, this.speedEffect)
       
        // if(this.player.role === "Warrior"){
        //     this.player.animation.playAnimation("2_atk", {
        //         duration: this.attackDuration,
        //         flip: flip,
        //     })
        // }
        // console.log("Flip", flip);
    }

    public onExit(): void {
        this.player.canMove = true;
        if(this.speedEffect) EffectManager.removeEffectFrom(this.player, this.speedEffect)
    }

    /** Called to change states to the exit state */
    protected changeToExitState(){
        this.playerController.changeState("Idle");
    }

    public update(deltaT: number): void {
        this.timePassed += deltaT;

        // Trigger a skill if it hasn't been triggered and the timePassed is at the triggerPercent.
        if(!this.triggered && this.timePassed >= this.triggerPercent * this.attackDuration) {
            this.triggered = true;
            // Trigger skills.
            // console.log("trigger skill")
            EffectManager.useTriggerEffectsOn(this.player, "player skill", this.player.getBody(), {mouseX: this.mouseX, mouseY: this.mouseY})
        }

        // End attack once we pass the attackDuration.
        if(this.timePassed >= this.attackDuration) {
            this.changeToExitState()
        }
    }
    
}