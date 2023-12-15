import { Body } from "matter-js"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import GameManager from "../../../../GameManager"
import { DashEffectLogic } from "../DashEffectLogic"
import { GameEvents, IProjectileConfig } from "../../../../interfaces"
import MathUtil from "../../../../../../../util/MathUtil"

export default class SwordDash extends DashEffectLogic{
    effectLogicId = "SwordDash"

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        let amount = this.getAmount(playerState.stat)
        let timeBetweenSpawns = 150
        // Spawn lightning
        for(let i=0; i<amount; i++){
            setTimeout(()=>{
                this.spawnLightning(playerState, gameManager)
            }, timeBetweenSpawns * i);
        }
    }

    private spawnLightning(playerState: Player, gameManager: GameManager){
        let width = this.getFinalWidth()
        let height = this.getFinalHeight()
        let {x, y} = playerState.getBody().position
        let velocity = playerState.getBody().velocity
        let initialVelocity = MathUtil.getNormalizedSpeed(velocity.x, velocity.y, 0.1)

        let projectileConfig: IProjectileConfig = {
            sprite: "sword_dash",
            stat: playerState.stat,
            spawnX: x,
            spawnY: y,
            width,
            height,
            initialVelocity,
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "SwordDash",
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            // activeTime: 1000,
            repeatAnimation: false,
            spawnSound: "sword_dash",
            classType: "MeleeProjectile",
            originEntityId: playerState.getId(),
        }
        
        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }
}