import { Body } from "matter-js"
import WeaponUpgradeTree from "../../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../../schemas/gameobjs/Player"
import GameManager from "../../../../../GameManager"
import { GameEvents, IProjectileConfig } from "../../../../../interfaces"
import { SpecialEffectLogic } from "../../SpecialEffectLogic"
import LightningBirdController from "./MeteorController"
import Projectile from "../../../../../../schemas/projectiles/Projectile"
import Entity from "../../../../../../schemas/gameobjs/Entity"
import MeteorController from "./MeteorController"

export default class Meteor extends SpecialEffectLogic{
    effectLogicId = "Meteor"
    // protected area: number = 3
    // protected duration: number = 1
    protected amountCap: number = 30
    protected amount: number = 5

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        let amount = this.getAmount(playerState.stat)
        let timeBetween = 100
        for(let i=0;i<amount;i++){
            setTimeout(()=>{
                this.spawnProjectile(playerState, gameManager)
            }, timeBetween * i);
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
            sprite: "meteor",
            stat: playerState.stat,
            spawnX: x + 300,
            spawnY: y - 300,
            width,
            height,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "NONE",
            poolType: "meteor",
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            // activeTime: this.getDuration() * 1000,
            // repeatAnimation: true,
            // spawnSound: "flame_dash",
            classType: "Projectile",
            originEntityId: playerState.getId(),
            data: {
                owner: playerState,
            },
            projectileControllerCtor: MeteorController,
            dontRotate: true,
            repeatAnimation: true,
            projectileSpeed: 200
        }
        
        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }
}