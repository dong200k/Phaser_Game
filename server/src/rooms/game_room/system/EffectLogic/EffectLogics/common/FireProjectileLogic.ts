import MathUtil from "../../../../../../util/MathUtil"
import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../schemas/gameobjs/Player"
import { CategoryType } from "../../../Collisions/Category"
import { getFinalAttackRange } from "../../../Formulas/formulas"
import GameManager from "../../../GameManager"
import { IProjectileConfig, ITriggerType } from "../../../interfaces"
import EffectLogic from "../../EffectLogic"

/**
 * Fires projectile(s), triggers based on player attack. Extend this class to create similar logic.
 * If it needs to be trigger elsewhere by other triggers then just make sure to pass the correct arguments and change the variables.
 */
export default class FireProjectileLogic extends EffectLogic{
    effectLogicId = "FireProjectileLogic"
    triggerType: ITriggerType = "player attack"
    /** Distance from spawn origin until the projectile goes inactive. Set undefined so distance has no effect */
    baseRange = 300
    /** Miliseconds until projectile goes inactive. Set undefined if intension is to not have it timed */
    activeTime = 3000 
    /** Speed projectile travels */
    projectileSpeed = 5
    /** Projectiles that are shot */
    projectileCount = 1
    /** Name of projctile being fired */
    projectileName = "demo_hero"
    /** Dimensions of projectile */
    width = 10
    height = 10
    /** Determines what the projectile collides with */
    collisionCategory: CategoryType =  "PLAYER_PROJECTILE"
    /** Pool type determines how projectiles are group to be reused when they go inactive */
    poolType = "RangerArrow"
    /** Sound that play when this projectile is fired */
    spawnSound = "shoot_arrow"
    /** Multipliers for damage calculation */
    attackMultiplier = 1
    magicMultiplier = 0
    /** Targets each projectile can pierce, by default it uses the piercing of the weapon upgrade. */
    piercing?: number

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Matter.Body, {mouseX, mouseY}: {mouseX: number, mouseY: number}){
        let playerX = playerBody.position.x
        let playerY = playerBody.position.y

        let projectileConfig = {
            sprite: this.projectileName,
            stat: playerState.stat,
            spawnX: playerX + playerState.projectileSpawnOffsetX,
            spawnY: playerY + playerState.projectileSpawnOffsetY,
            width: this.width,
            height: this.height,
            initialVelocity: MathUtil.getNormalizedSpeed(mouseX - playerX, mouseY - playerY, this.projectileSpeed),
            collisionCategory: this.collisionCategory,
            range: getFinalAttackRange(playerState.stat, this.baseRange),
            activeTime: this.activeTime,
            poolType: this.poolType,
            attackMultiplier: this.attackMultiplier,
            magicMultiplier: this.magicMultiplier,
            originEntityId: playerState.getId(),
            spawnSound: this.spawnSound,
            piercing: this.piercing ?? playerState.weaponUpgradeTree.getPiercing(),
        }

        this.fireProjectile(playerState, gameManager, tree, playerBody, {mouseX, mouseY}, projectileConfig)
    }

    /** 
     * Overwrite this to spawn projectiles differently
     */
    protected fireProjectile(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Matter.Body, {mouseX, mouseY}: {mouseX: number, mouseY: number}, projectileConfig: IProjectileConfig){
        let maximumProjectileCount = Math.min(60, this.projectileCount)
        let rotationIncrement = 6
        let evenStartDeg = rotationIncrement * 0.5 + rotationIncrement * (maximumProjectileCount/2 - 1)
        let oddStartDeg = rotationIncrement * Math.floor(maximumProjectileCount/2)
        let rotationDeg = maximumProjectileCount %2 === 0? evenStartDeg : oddStartDeg
        let velX = mouseX - playerBody.position.x
        let velY = mouseY - playerBody.position.y

        // Spawns 1 or multiple projectiles
        for(let i=0;i<maximumProjectileCount;i++){
            // console.log(rotationDeg) 
            gameManager.getProjectileManager().spawnProjectile({
                ...projectileConfig,
                initialVelocity: MathUtil.getRotatedSpeed(velX, velY, this.projectileSpeed, rotationDeg)
            })
            
            rotationDeg -= rotationIncrement
        }
    }
}