import MathUtil from "../../../../../../util/MathUtil";
import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../schemas/gameobjs/Player";
import { CategoryType } from "../../../Collisions/Category";
import DatabaseManager from "../../../Database/DatabaseManager";
import { getFinalAttackRange } from "../../../Formulas/formulas";
import GameManager from "../../../GameManager";
import EffectLogic from "../../EffectLogic";

export default class DoubowLogic extends EffectLogic{
    effectLogicId = "Doubow"

    /** Shoots two projectiles at -30 and 30 degrees */
    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Matter.Body, mouseData: {mouseX: number, mouseY: number}){
        // Grab Mouse Data and Player weapon
        let {mouseX, mouseY} = mouseData
        let baseRange = 300
        
        let range = getFinalAttackRange(playerState.stat, baseRange)
        let activeTime = 3000
        let weaponId = playerState.weaponUpgradeTree.weaponId
        let projectileName = DatabaseManager.getManager().getWeaponProjectile(weaponId as string)
        let playerX = playerBody.position.x
        let playerY = playerBody.position.y
        let collisionCategory: CategoryType =  "PLAYER_PROJECTILE"
        let poolType = "Bow"

        // direction of player to player mouse position
        let x = mouseX - playerX
        let y = mouseY - playerY

        let projectileSpeed = 5

        // spawn projectile with direction rotated 30 degrees from player to player mouse
        let directionRotated30 = MathUtil.getRotatedSpeed(x, y, projectileSpeed, 5)
        gameManager.getProjectileManager().spawnProjectile({
            sprite: projectileName,
            stat: playerState.stat,
            spawnX: playerX,
            spawnY: playerY,
            width: 10,
            height: 10,
            initialVelocity: directionRotated30,
            collisionCategory: collisionCategory,
            range: range,
            activeTime: activeTime,
            poolType: poolType,
            attackMultiplier: 1,
            magicMultiplier: 0,
            originEntityId: playerState.getId(),
        })

        // spawn projectile with direction rotated -30 degrees from player to player mouse
        let directionRotatedMinus30 = MathUtil.getRotatedSpeed(x, y, projectileSpeed, -5)
        gameManager.getProjectileManager().spawnProjectile({
            sprite: projectileName,
            stat: playerState.stat,
            spawnX: playerX,
            spawnY: playerY,
            width: 10,
            height: 10,
            initialVelocity: directionRotatedMinus30,
            collisionCategory: "PLAYER_PROJECTILE",
            range: range,
            activeTime: activeTime,
            poolType: "BowLogic",
            attackMultiplier: 1,
            magicMultiplier: 0,
            originEntityId: playerState.getId(),
        })
    }
}