import { Body } from "matter-js"
import { SpecialEffectLogic } from "../SpecialEffectLogic"
import Player from "../../../../../schemas/gameobjs/Player"
import GameManager from "../../../../GameManager"
import { GameEvents, IProjectileConfig } from "../../../../interfaces"
import { start } from "repl"

export default class LightningOrb extends SpecialEffectLogic{
    effectLogicId = "LightningOrb"
    // protected area: number = 3
    // protected duration: number = 1
    protected amountCap: number = 30
    protected duration: number = 5
    protected amount: number = 1

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        let amount = this.getAmount(playerState.stat)
        for(let i=0;i<amount;i++){
            this.spawnProjectile(playerState, gameManager, i * 360/amount)
        }
    }

    private spawnProjectile(playerState: Player, gameManager: GameManager, startAngle: number){
        let width = this.getFinalWidth()
        let height = this.getFinalHeight()
        let {x, y} = playerState.getBody().position

        // let offsetX = (width/2 + playerState.width/2)
        // let playerVelocityX = playerState.getBody().velocity.x 
        // if(playerVelocityX < 0) offsetX *= -1
        // let velocityX = playerVelocityX > 0 ? 1 : -1
        
        let projectileConfig: IProjectileConfig = {
            sprite: "lightning_orb",
            stat: playerState.stat,
            spawnX: x,
            spawnY: y,
            width,
            height,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "lightning_orb",
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            activeTime: this.getDuration() * 1000,
            // repeatAnimation: true,
            // spawnSound: "flame_dash",
            classType: "CircularFollowProjectile",
            originEntityId: playerState.getId(),
            data: {
                radius: playerState.width + width/2,
                startAngle
            },
            // dontRotate: true,
            repeatAnimation: true,
            projectileSpeed: 200
        }
        
        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }
}