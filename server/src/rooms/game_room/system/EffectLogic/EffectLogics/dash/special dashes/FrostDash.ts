import { Body } from "matter-js"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import GameManager from "../../../../GameManager"
import { DashEffectLogic } from "../DashEffectLogic"
import { GameEvents, IProjectileConfig } from "../../../../interfaces"

export default class FrostDash extends DashEffectLogic{
    effectLogicId = "FrostDash"

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        let amount = this.getAmount(playerState.stat)
        let timeBetweenSpawns = 150
        for(let i=0; i<amount; i++){
            setTimeout(()=>{
                this.spawnFrost(playerState, gameManager)
            }, timeBetweenSpawns * i);
        }
    }

    private spawnFrost(playerState: Player, gameManager: GameManager){
        let width = this.getFinalWidth()
        let height = this.getFinalHeight()
        let {x, y} = playerState.getBody().position
        
        let projectileConfig: IProjectileConfig = {
            sprite: "frost_ground",
            stat: playerState.stat,
            spawnX: x,
            spawnY: y,
            width,
            height,
            initialVelocity: {x: 0, y:0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "FrostDash",
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            // activeTime: 1000,
            repeatAnimation: false,
            spawnSound: "frost_walk",
            classType: "MeleeProjectile",
            originEntityId: playerState.getId(),
            data: {
                attackDuration: this.duration,
                triggerPercent: 1,
                unTriggerPercent: 0.1
            }
        }
        
        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }
}