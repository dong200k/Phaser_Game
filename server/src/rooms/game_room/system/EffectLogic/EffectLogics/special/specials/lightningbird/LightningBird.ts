import { Body } from "matter-js"
import WeaponUpgradeTree from "../../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../../schemas/gameobjs/Player"
import GameManager from "../../../../../GameManager"
import { GameEvents, IProjectileConfig } from "../../../../../interfaces"
import { SpecialEffectLogic } from "../../SpecialEffectLogic"
import LightningBirdController from "./LightningBirdController"

export default class LightningBird extends SpecialEffectLogic{
    effectLogicId = "LightningBird"
    // protected area: number = 3
    protected duration: number = 20

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        let amount = this.getAmount(playerState.stat)
        for(let i=0;i<amount;i++){
            this.spawnProjectile(playerState, gameManager)
        }
    }

    private spawnProjectile(playerState: Player, gameManager: GameManager){
        let width = this.getFinalWidth()
        let height = this.getFinalHeight()
        let {x, y} = playerState.getBody().position

        // let offsetX = (width/2 + playerState.width/2)
        // let playerVelocityX = playerState.getBody().velocity.x 
        // if(playerVelocityX < 0) offsetX *= -1
        // let velocityX = playerVelocityX > 0 ? 1 : -1
        
        let projectileConfig: IProjectileConfig = {
            sprite: "lightning_bird",
            stat: playerState.stat,
            spawnX: x + Math.random()*25 * Math.random()<0.5? 1 : -1,
            spawnY: y + Math.random()*25 * Math.random()<0.5? 1 : -1,
            width,
            height,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "lightning_bird",
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            activeTime: this.getDuration() * 1000,
            // repeatAnimation: true,
            // spawnSound: "flame_dash",
            classType: "Projectile",
            originEntityId: playerState.getId(),
            data: {
                owner: playerState,
            },
            // onCollideCallback: (projectile, entity)=>{
            //     this.spawnLightning(projectile.getOriginEntity() as Player, gameManager, entity.getBody().position.x, entity.getBody().position.y)
            // },   
            projectileSpeed: 75,
            projectileControllerCtor: LightningBirdController,
            dontRotate: true,
            repeatAnimation: true
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
            dontRotate: true,
        }

        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }
}