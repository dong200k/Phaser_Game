import { Body } from "matter-js"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import GameManager from "../../../../GameManager"
import { DashEffectLogic } from "../DashEffectLogic"
import { GameEvents, IProjectileConfig } from "../../../../interfaces"

export default class FlameDash extends DashEffectLogic{
    effectLogicId = "FlameDash"
    // protected area: number = 3

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        this.spawnFlame(playerState, gameManager)        
    }

    private spawnFlame(playerState: Player, gameManager: GameManager){
        let width = this.getFinalWidth()
        let height = this.getFinalHeight()
        let {x, y} = playerState.getBody().position

        let offsetX = (width/2 + playerState.width/2)
        let playerVelocityX = playerState.getBody().velocity.x 
        if(playerVelocityX < 0) offsetX *= -1
        let velocityX = playerVelocityX > 0 ? 1 : -1
        
        let projectileConfig: IProjectileConfig = {
            sprite: "flame_dash",
            stat: playerState.stat,
            spawnX: x,
            spawnY: y,
            width,
            height,
            initialVelocity: {x: velocityX, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "FlameDash",
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            activeTime: 800,
            repeatAnimation: false,
            spawnSound: "flame_dash",
            classType: "FollowingMeleeProjectile",
            originEntityId: playerState.getId(),
            data: {
                owner: playerState,
                offsetX,
            }
        }
        
        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }
}