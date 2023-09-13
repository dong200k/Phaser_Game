import MathUtil from "../../../../../../../../util/MathUtil";
import Player from "../../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../../GameManager";
import StateNode from "../../../../../StateMachine/StateNode";
import { GameEvents, IProjectileConfig } from "../../../../../interfaces";
import RangerAbilityController from "../RangerAbilityController";

interface ArrowRainConfig {
    projectileSpeed?: number;
    attackMultiplier?: number;
    spawnSound?: string;
    arrowCount?: number;
    arrowWaves?: number;
    timeBetweenWaves?: number;
    /** Width (horizontal) around the location arrows were shot that arrows could start falling from */
    width?: number;

    /** Offset from player position where arrows begin falling */
    fallHeightOffset?: number;

    /** Radius of each arrow's explosion */
    explosionRadius?: number;

    /** Y range around the origin location where arrows can explode  */
    impactRangeY?: number;
}

export default class ArrowRain extends StateNode {

    private rangerAbilityController!: RangerAbilityController;
    private player!: Player;
    private gameManager!: GameManager;

    private width = 100
    private projectileSpeed = 5
    private attackMultiplier = 3
    private spawnSound = "shoot_arrow"
    private arrowCount = 50
    private arrowWaves = 5
    private currentWave = 0
    private timeBetweenWaves = 100
    private timePassedSinceWave = 0
    private fallHeightOffset = 200
    private explosionRadius = 20
    private impactRangeY = 200

    /**
     * Initialize this attack with some values.
     * @param config The AttackConfig.
     */
    public setConfig(config?: ArrowRainConfig) {
        if(config) {
            this.projectileSpeed = config.projectileSpeed ?? 20
            this.attackMultiplier = config.attackMultiplier ?? 2
            this.spawnSound = config.spawnSound ?? "shoot_arrow"
            this.arrowCount = config.arrowCount ?? 50
            this.width = config.width ?? 100
            this.timeBetweenWaves = config.timeBetweenWaves ?? 100
            this.fallHeightOffset = config.fallHeightOffset ?? 200
            this.explosionRadius = config.explosionRadius ?? 20
            this.impactRangeY = config.impactRangeY ?? 200
        }
    }

    public onEnter(): void {
        this.rangerAbilityController = this.getStateMachine<RangerAbilityController>();
        this.player = this.rangerAbilityController.getPlayer();
        this.gameManager = this.rangerAbilityController.getGameManager();
        this.currentWave = 0
        this.timePassedSinceWave = this.timeBetweenWaves
        /** TODO: Play special animation */
        // this.player.animation.playAnimation("attack", {
        //     duration: this.attackDuration,
        // });
    }

    public onExit(): void {
        this.player.canMove = true;
    }

    public update(deltaT: number): void {
        if(this.currentWave >= this.arrowWaves) return this.rangerAbilityController.changeState("Inactive")

        this.timePassedSinceWave += deltaT
        if(this.timePassedSinceWave >= this.timeBetweenWaves){
            this.timePassedSinceWave = 0
            this.currentWave += 1
            let arrowCount = this.arrowCount/this.arrowWaves
            let {x, y} = this.rangerAbilityController.getArrowFlyOrigin()

            // Spawn arrows and make them drop down
            for(let i=0;i<arrowCount;i++){
                // Calculate where arrows start falling from
                let xOffset = Math.random() * this.width
                let spawnX = x + (Math.random() < 0.5? xOffset: -xOffset)
                let spawnY = this.player.getBody().position.y  - this.fallHeightOffset

                // Calculate y line where arrow will explode upon passing
                let yOffset = this.impactRangeY * Math.random()
                let explodeThresholdY = y + (Math.random() < 0.5? yOffset: -yOffset)

                let projectileConfig: IProjectileConfig = {
                    sprite: "RangerArrow",
                    stat: this.player.stat,
                    spawnX: spawnX,
                    spawnY: spawnY,
                    width: 100,
                    height: 100,
                    initialVelocity: MathUtil.getNormalizedSpeed(0, 1, Math.random()*5 + this.projectileSpeed),
                    collisionCategory: "NONE",
                    poolType: "Arrow Rain",
                    range: 500,
                    activeTime: 2000,
                    attackMultiplier: this.attackMultiplier,
                    magicMultiplier: 0,
                    originEntityId: this.player.getId(),
                    spawnSound: this.spawnSound,
                    data: {
                        config: {
                            player: this.player,
                            gameManager: this.gameManager,
                            explosionRadius: this.explosionRadius,
                            explodeThresholdY,
                        }
                    },
                    classType: "ArrowRainProjectile"
                }

                this.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
            }
        }
    }
    
}