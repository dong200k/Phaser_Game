import Matter from "matter-js"
import MathUtil from "../../../../../../../util/MathUtil"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import EffectFactory from "../../../../../schemas/effects/EffectFactory"
import Player from "../../../../../schemas/gameobjs/Player"
import Projectile from "../../../../../schemas/projectiles/Projectile"
import GameManager from "../../../../GameManager"
import EffectManager from "../../../../StateManagers/EffectManager"
import { GameEvents, IProjectileConfig, ITriggerType } from "../../../../interfaces"
import EffectLogic from "../../../EffectLogic"

interface IQiArmorConfig {
    effectLogicId?: string,
    knockback?: number,
    /** Multiplies the coverage radius which determines if monster is in range */
    radiusMult?: number,
    /** Multiplies the knockback */
    knockbackMult?: number,
}

/** 
 * Artifact that drops down lightning on player occasionally
*/
export class QiArmor extends EffectLogic{
    effectLogicId = "QiArmor" 
    triggerType: ITriggerType = "none"

    private width = 50
    private height = 50
    private knockback = 100
    private radius = 50
    private radiusMult = 1
    private knockbackMult = 1

    constructor(config?: IQiArmorConfig){
        super(config)

        this.effectLogicId = config?.effectLogicId ?? this.effectLogicId
        this.knockback = config?.knockback ?? this.knockback
        this.radiusMult = config?.radiusMult ?? this.radiusMult
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree){
        // console.log("qi armor activating")
        this.spawnArmor(playerState, gameManager)

        // Apply knock back
        gameManager.getDungeonManager().getAllActiveMonsters().forEach((monster) => {
            let {x: playerX, y: playerY} = playerState.getBody().position
            let distance = MathUtil.distance(playerX, playerY, monster.x, monster.y)

            // Handle knockback.
            if(distance < this.radius * this.radiusMult){
                let direction = MathUtil.normalize({x: monster.x - playerX, y: monster.y - playerY});
                Matter.Body.setPosition(monster.getBody(), {
                    x: monster.x + this.knockback * this.knockbackMult * direction.x,
                    y: monster.y + this.knockback * this.knockbackMult * direction.y,
                })
            }
        });
    }

    private spawnArmor(playerState: Player, gameManager: GameManager){
        let {x: playerX, y: playerY} = playerState.getBody().position

        let projectileConfig: IProjectileConfig = {
            sprite: "QiRotation",
            stat: playerState.stat,
            spawnX: playerX,
            spawnY: playerY,
            width: this.radius * 2,
            height: this.radius * 2,
            initialVelocity: {x: 0, y:0},
            collisionCategory: "NONE",
            poolType: "QiArmor",
            attackMultiplier: 0,
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            activeTime: 300,
            repeatAnimation: true,
            spawnSound: "qi_rotation",
            classType: "FollowingMeleeProjectile",
            data:{
                owner: playerState
            }
        }

        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }
}

