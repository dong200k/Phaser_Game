import MathUtil from "../../../../../../../../util/MathUtil";
import Player from "../../../../../../schemas/gameobjs/Player";
import Projectile from "../../../../../../schemas/projectiles/Projectile";
import { getTimeAfterCooldownReduction } from "../../../../../Formulas/formulas";
import GameManager from "../../../../../GameManager";
import StateNode from "../../../../../StateMachine/StateNode";
import { GameEvents, IProjectileConfig } from "../../../../../interfaces";
import RuneGuardController from "../RuneGuardController";

export default class Attack extends StateNode {

    private controller!: RuneGuardController
    private projectile!: Projectile
    private gameManager!: GameManager
    private width = 30
    private height = 200
    private attackMultiplier = 1
    private cooldown = 1
    private timeSoFar = 0
    private projectileSpeed = 0.1

    private baseCooldown = 1

    public onEnter(): void {
        this.controller = this.getStateMachine()
        this.gameManager = this.controller.getGameManager()
        this.projectile = this.controller.getProjectile()

        this.timeSoFar = 0
        console.log(this.projectile.getOriginEntity()?.stat.cooldownReduction)
    }

    public onExit(): void {
        
    }

    public update(deltaT: number): void {
        let player = this.projectile.getOriginEntity() as Player
        if(!player || player.playerController.stateName === "Dead") return

        this.timeSoFar += getTimeAfterCooldownReduction(player.stat, deltaT)
        if(this.timeSoFar >= this.cooldown){
            this.timeSoFar = 0
            this.updateParameters()
            this.shootLaser()
        }
    }

    private updateParameters(){
        this.attackMultiplier = this.controller.runeGuardEffectLogic.getAttackMultiplier()
        this.cooldown = this.baseCooldown * this.controller.runeGuardEffectLogic.getCooldownReduction()
    }

    private shootLaser(){
        let direction = {x: 0, y: -1}
        let velocity = MathUtil.getNormalizedSpeed(direction.x, direction.y, this.projectileSpeed)
        
        let projectileConfig: IProjectileConfig = {
            sprite: "laser",
            stat: this.projectile.getOriginEntity()!.stat,
            spawnX: this.projectile.x,
            spawnY: this.projectile.y,
            width: this.width,
            height: this.height,
            initialVelocity: velocity,
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "Laser",
            attackMultiplier: this.attackMultiplier,
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            activeTime: 500,
            repeatAnimation: false,
            spawnSound: "laser_pew",
            classType: "MeleeProjectile",
            originEntityId: this.projectile.getOriginEntity()!.getId(),
            // data: {
            //     owner: this.projectile,
            //     offsetX: this.width/2 + this.projectile.width/2
            // },
        }

        this.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }
}

