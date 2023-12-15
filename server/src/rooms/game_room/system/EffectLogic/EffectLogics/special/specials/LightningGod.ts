import { Body } from "matter-js"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import GameManager from "../../../../GameManager"
import { GameEvents, IProjectileConfig } from "../../../../interfaces"
import { SpecialEffectLogic } from "../SpecialEffectLogic"

export default class LightningGod extends SpecialEffectLogic{
    effectLogicId = "LightningGod"
    // protected area: number = 3
    protected duration: number = 2

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        this.spawnLightningGod(playerState, gameManager)
    }

    private spawnLightningGod(playerState: Player, gameManager: GameManager){
        let width = this.getFinalWidth()
        let height = this.getFinalHeight()
        let {x, y} = playerState.getBody().position

        // let offsetX = (width/2 + playerState.width/2)
        // let playerVelocityX = playerState.getBody().velocity.x 
        // if(playerVelocityX < 0) offsetX *= -1
        // let velocityX = playerVelocityX > 0 ? 1 : -1
        
        let projectileConfig: IProjectileConfig = {
            sprite: "lightning_god",
            stat: playerState.stat,
            spawnX: x,
            spawnY: y,
            width,
            height,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "LightningGod",
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            activeTime: this.getDuration() * 1000,
            // repeatAnimation: true,
            // spawnSound: "flame_dash",
            classType: "FollowingMeleeProjectile",
            originEntityId: playerState.getId(),
            data: {
                owner: playerState,
            },
            onCollideCallback: (projectile, entity)=>{
                this.spawnLightning(projectile.getOriginEntity() as Player, gameManager, entity.getBody().position.x, entity.getBody().position.y)
            }
        }
        
        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }

    private spawnLightning(playerState: Player, gameManager: GameManager, spawnX: number, spawnY: number){

        let projectileConfig: IProjectileConfig = {
            sprite: "Lightning",
            stat: playerState.stat,
            spawnX: spawnX,
            spawnY: spawnY,
            width: this.width,
            height: this.height,
            initialVelocity: {x: 0, y:0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "LightningRod",
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            // activeTime: 1000,
            repeatAnimation: false,
            spawnSound: "lightninggodlightning",
            classType: "MeleeProjectile",
            originEntityId: playerState.getId(),
        }

        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }
}