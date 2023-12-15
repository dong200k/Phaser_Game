import { Body } from "matter-js"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import GameManager from "../../../../GameManager"
import { DashEffectLogic } from "../DashEffectLogic"
import { GameEvents, IProjectileConfig } from "../../../../interfaces"
import MathUtil from "../../../../../../../util/MathUtil"

export default class WaveDash extends DashEffectLogic{
    effectLogicId = "WaveDash"
    // area = 10
    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        this.spawnWave(playerState, gameManager)        
    }
    
    private spawnWave(playerState: Player, gameManager: GameManager){
        let width = this.getFinalWidth()
        let height = this.getFinalHeight()
        let {x, y} = playerState.getBody().position
        let playerVelocity = playerState.getBody().velocity
        let velocity = MathUtil.getNormalizedSpeed(playerVelocity.x, playerVelocity.y, 8)
        
        let projectileConfig: IProjectileConfig = {
            sprite: "wave_dash",
            stat: playerState.stat,
            spawnX: x,
            spawnY: y,
            width,  
            height,
            initialVelocity: velocity,
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "WaveDash",
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            // activeTime: 1000,
            repeatAnimation: false,
            spawnSound: "wave_dash",
            classType: "MeleeProjectile",
            originEntityId: playerState.getId(),
            dontRotate: true,
            flipX: velocity.x < 0
        }
        
        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }
}