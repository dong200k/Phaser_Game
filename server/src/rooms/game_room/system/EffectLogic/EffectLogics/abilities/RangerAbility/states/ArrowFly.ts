import MathUtil from "../../../../../../../../util/MathUtil";
import Player from "../../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../../GameManager";
import StateNode from "../../../../../StateMachine/StateNode";
import { GameEvents, IProjectileConfig } from "../../../../../interfaces";
import RangerAbilityController from "../RangerAbilityController";

interface ArrowFlyConfig {
    /** Total attack time. Including windup(for animations) time and trigger time. */
    attackDuration?: number;

    /** A percentage of attackDuration that passes before the attack triggers. E.g. if attackDuration=1 and 
     * triggerPercent=0.7, the attack will trigger at 0.7 seconds.
     */
    triggerPercent?: number;

    /** Can the player move when attacking. */
    canMove?: boolean;

    /** Time after the arrows are shot/flew up that we should change to the next state arrow rain */
    timeTilChangeState?: number;

    projectileSpeed?: number;
    spawnSound?: string;
    arrowCount?: number;
    /** X offset that arrows flies from around player */
    width?: number;
}

export default class ArrowFly extends StateNode {

    private rangerAbilityController!: RangerAbilityController;
    private player!: Player;
    private gameManager!: GameManager;
    
    /** Total attack time. Including windup(for animations) time and trigger time. */
    private attackDuration: number = 1000;
    /** A percentage of attackDuration that passes before the attack triggers. E.g. if attackDuration=1 and 
     * triggerPercent=0.7, the attack will trigger at 0.7 seconds.
     */
    private triggerPercent: number = 0.3;

    /** Has the attack been triggered or not. */
    private triggered: boolean = false;

    /** Can the player move when attacking. */
    private canMove: boolean = false;

    private timePassed: number = 0;

    private timeTilChangeState = 500
    private timePassedAfterArrowFly = 0
    private projectileSpeed = 20
    private spawnSound = "shoot_arrow"
    private arrowCount = 20
    private width = 50

    /**
     * Initialize this attack with some values.
     * @param config The AttackConfig.
     */
    public setConfig(config?: ArrowFlyConfig) {
        if(config) {
            this.attackDuration = config.attackDuration ?? 1000;
            this.triggerPercent = config.triggerPercent ?? 0.3;
            this.canMove = config.canMove ?? false;
            this.timeTilChangeState = config.timeTilChangeState ?? 500;
            this.projectileSpeed = config.projectileSpeed ?? 20
            this.spawnSound = config.spawnSound ?? "shoot_arrow"
            this.arrowCount = config.arrowCount ?? 20
            this.width = config.width ?? 50
        }
    }

    public onEnter(): void {
        this.rangerAbilityController = this.getStateMachine<RangerAbilityController>();
        this.player = this.rangerAbilityController.getPlayer();
        this.gameManager = this.rangerAbilityController.getGameManager();
        this.timePassed = 0;
        this.timePassedAfterArrowFly = 0
        // this.player.canMove = this.canMove;
        this.triggered = false;
        /** TODO: Play special animation */
        // this.player.animation.playAnimation("attack", {
        //     duration: this.attackDuration,
        // });
    }

    public onExit(): void {
        this.player.canMove = true;
    }

    public update(deltaT: number): void {
        this.timePassed += deltaT;

        // Start counting time after arrows flew up
        if(this.timePassed > this.attackDuration) this.timePassedAfterArrowFly += deltaT
        // If time since arrows arrows were shot reaches threshold then change state
        if(this.timePassedAfterArrowFly >= this.timeTilChangeState) this.rangerAbilityController.changeState("Arrow Rain")

        // Trigger an attack if it hasn't been triggered and the timePassed is at the triggerPercent.
        if(!this.triggered && this.timePassed >= this.triggerPercent * this.attackDuration) {
            this.triggered = true;
            
            // Spawn arrows and make them fly up
            let arrowCount = this.arrowCount
            let playerX = this.player.getBody().position.x
            let playerY = this.player.getBody().position.y
            this.rangerAbilityController.setArrowFlyOrigin(playerX, playerY)
            for(let i=0;i<arrowCount;i++){
                let offSetX = Math.random() * this.width
                if(Math.random() < 0.5) offSetX *= -1

                let projectileConfig: IProjectileConfig = {
                    sprite: "RangerArrow",
                    stat: this.player.stat,
                    spawnX: playerX + offSetX,
                    spawnY: playerY + Math.random() * 100 - 50,
                    initialVelocity: MathUtil.getNormalizedSpeed(0, -1, Math.random()*5 + this.projectileSpeed),
                    collisionCategory: "NONE",
                    poolType: "Arrow Fly",
                    range: 500,
                    activeTime: 2000,
                    attackMultiplier: 0,
                    magicMultiplier: 0,
                    originEntityId: this.player.getId(),
                    spawnSound: this.spawnSound,
                }

                this.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
            }
        }
    }
    
}