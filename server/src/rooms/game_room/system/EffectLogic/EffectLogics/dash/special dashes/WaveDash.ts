import { Body } from "matter-js"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import GameManager from "../../../../GameManager"
import { DashEffectLogic } from "../DashEffectLogic"
import { GameEvents, IProjectileConfig } from "../../../../interfaces"

export default class WaveDash extends DashEffectLogic{
    effectLogicId = "WaveDash"

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        this.spawnWave(playerState, gameManager)        
    }
    
    private spawnWave(playerState: Player, gameManager: GameManager){
        let width = this.getFinalWidth()
        let height = this.getFinalHeight()
        let {x, y} = playerState.getBody().position
        
        let projectileConfig: IProjectileConfig = {
            sprite: "WaveCrash",
            stat: playerState.stat,
            spawnX: x,
            spawnY: y,
            width,
            height,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "WaveDash",
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            // activeTime: 1000,
            repeatAnimation: false,
            // spawnSound: "lightningrod",
            classType: "MeleeProjectile",
            originEntityId: playerState.getId(),
        }
        
        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }
}