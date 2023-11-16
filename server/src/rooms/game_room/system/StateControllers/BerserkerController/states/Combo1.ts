import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import StateNode from "../../../StateMachine/StateNode";
import { GameEvents, IProjectileConfig } from "../../../interfaces";
import BerserkerComboController from "../BerserkerComboController";

interface Combo1Config {
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

    /** Animation duration in seconds */
    animationDuration?: number;

    /** Whether to flip animation or not */
    flip?: boolean
}

export default class Combo1 extends StateNode {

    protected berserkerComboController!: BerserkerComboController;
    protected player!: Player;
    protected gameManager!: GameManager;
    
    /** Total attack time. Including windup(for animations) time and trigger time. */
    protected attackDuration: number = 1;
    /** A percentage of attackDuration that passes before the attack triggers. E.g. if attackDuration=1 and 
     * triggerPercent=0.7, the attack will trigger at 0.7 seconds.
     */
    protected triggerPercent: number = 0.1;

    /** Has the attack been triggered or not. */
    protected triggered: boolean = false;

    /** Can the player move when attacking. */
    protected canMove: boolean = false;

    protected timePassed: number = 0;

    protected mouseX: number = 0
    protected mouseY: number = 0

    protected animationDuraction: number = 1
    protected flip: boolean = false
    protected attackMultiplier: number = 5

    /**
     * Initialize this attack with some values.
     * @param config The AttackConfig.
     */
    public setConfig(config?: Combo1Config) {
        if(config) {
            this.attackDuration = config.attackDuration ?? 1;
            this.triggerPercent = config.triggerPercent ?? 0.1;
            this.canMove = config.canMove ?? false;
            this.mouseX = config.mouseX ?? 0;
            this.mouseY = config.mouseY ?? 0;
            this.animationDuraction = config.animationDuration ?? 1
            this.flip = config.flip ?? this.flip
        }
    }

    public onEnterHelper(){
        this.berserkerComboController = this.getStateMachine<BerserkerComboController>();
        this.player = this.berserkerComboController.getPlayer();
        this.gameManager = this.berserkerComboController.getGameManager();
        this.timePassed = 0;
        this.player.canMove = this.canMove;
        this.triggered = false;
        // So that the attack animation does not get flipped by client side prediction when arrow keys are pressed
        this.player.setOverwriteClientMoveFlip(true)
        this.berserkerComboController.resetTimeBetweenCombo()
    }

    public onEnter(): void {
        this.onEnterHelper()
        this.player.animation.playAnimation("1_atk", {
            duration: this.animationDuraction,
            flip: this.flip
        });
    }

    public onExit(): void {
        this.player.canMove = true;
        this.player.setOverwriteClientMoveFlip(false)
    }

    /**
     * Logic for spawning the projectiles and hitboxes for this combo.
     */
    protected attack(){
        // Figure out hit boxes and projectile spawn locations
        let playerX = this.player.getBody().position.x
        let playerY = this.player.getBody().position.y
        let offsetX = 25
        let offsetY = -20

        if(this.mouseX - this.player.getBody().position.x < 0) offsetX *= -1

        let projectileConfig: IProjectileConfig = {
            sprite: "invisible",
            stat: this.player.stat,
            spawnX: playerX + offsetX,
            spawnY: playerY + offsetY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "Berserker Combo 1",
            activeTime: Math.max(this.animationDuraction * 1000, 300),
            attackMultiplier: this.attackMultiplier,
            magicMultiplier: 0,
            originEntityId: this.player.getId(),
            // spawnSound: this.spawnSound,
            width: 90,
            height: 80,
            visible: false,
            classType: "MeleeProjectile",
            spawnSound: "clean_fast_slash"
        }

        this.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
    }

    public update(deltaT: number): void {
        this.timePassed += deltaT;

        // This state is finished, increment the current combo count and change to idle state
        if(this.timePassed >= this.attackDuration) {
            this.berserkerComboController.incrementCurrentCombo()
            this.berserkerComboController.changeState("Idle")
        }

        // Trigger an attack if it hasn't been triggered and the timePassed is at the triggerPercent.
        if(!this.triggered && this.timePassed >= this.triggerPercent * this.attackDuration) {
            this.triggered = true;
            this.attack()
        }
    }
    
}