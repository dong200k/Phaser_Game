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

    private playerController!: PlayerController;
    private player!: Player;
    
    /** Total attack time. Including windup(for animations) time and trigger time. */
    private attackDuration: number = 1;
    /** A percentage of attackDuration that passes before the attack triggers. E.g. if attackDuration=1 and 
     * triggerPercent=0.7, the attack will trigger at 0.7 seconds.
     */
    private triggerPercent: number = 0.3;

    /** Has the attack been triggered or not. */
    private triggered: boolean = false;

    /** Can the player move when attacking. */
    private canMove: boolean = false;

    private timePassed: number = 0;
    
    private mouseX: number = 0;
    private mouseY: number = 0;
    /**
     * Initialize this attack with some values.
     * @param config The AttackConfig.
     */
    public setConfig(config?: SpecialConfig) {
        if(config) {
            this.attackDuration = config.attackDuration ?? 1;
            this.triggerPercent = config.triggerPercent ?? 0.3;
            this.canMove = config.canMove ?? false;
            this.mouseX = config.mouseX ?? this.mouseX;
            this.mouseY = config.mouseY ?? this.mouseY;
        }
    }

    public onEnter(): void {
        this.playerController = this.getStateMachine<PlayerController>();
        this.player = this.playerController.getPlayer();
        this.attackDuration = this.player.stat.attackSpeed/2;
        this.timePassed = 0;
        this.player.canMove = this.canMove;
        this.triggered = false;

        // Checks if the player's sprite should flip or not.
        let flip = (this.player.x - this.mouseX) > 0;
        console.log("playing special animation")
        if(this.player.role === "Ranger"){
             this.player.animation.playAnimation("2_atk", {
                duration: this.attackDuration,
                flip: flip,
            });
        }
       
        if(this.player.role === "Warrior"){
            this.player.animation.playAnimation("2_atk", {
                duration: this.attackDuration,
                flip: flip,
            })
        }
        // console.log("Flip", flip);
    }

    public onExit(): void {
        this.player.canMove = true;
    }

    public update(deltaT: number): void {
        this.timePassed += deltaT;

        // Trigger a skill if it hasn't been triggered and the timePassed is at the triggerPercent.
        if(!this.triggered && this.timePassed >= this.triggerPercent * this.attackDuration) {
            this.triggered = true;
            // Trigger skills.
            EffectManager.useTriggerEffectsOn(this.player, "player skill", this.player.getBody(), {mouseX: this.mouseX, mouseY: this.mouseY})
        }

        // End attack once we pass the attackDuration.
        if(this.timePassed >= this.attackDuration) {
            this.playerController.changeState("Idle");
        }
    }
    
}