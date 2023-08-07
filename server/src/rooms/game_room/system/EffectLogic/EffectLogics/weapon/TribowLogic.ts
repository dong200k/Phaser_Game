import MathUtil from "../../../../../../util/MathUtil";
import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../schemas/gameobjs/Player";
import { CategoryType } from "../../../Collisions/Category";
import DatabaseManager from "../../../Database/DatabaseManager";
import GameManager from "../../../GameManager";
import EffectLogic from "../../EffectLogic";

export default class TribowLogic extends EffectLogic{
    effectLogicId = "Tribow"

    /** Shoots two projectiles at -30 and 30 degrees */
    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Matter.Body, mouseData: {mouseX: number, mouseY: number}){
        // Grab Mouse Data and Player weapon
        let {mouseX, mouseY} = mouseData

        let range = 300
        let activeTime = 3000
        let weaponId = playerState.weaponUpgradeTree.weaponId
        let projectileName = DatabaseManager.getManager().getWeaponProjectile(weaponId as string)
        let playerX = playerBody.position.x
        let playerY = playerBody.position.y
        let collisionCategory: CategoryType =  "PLAYER_PROJECTILE"
        let poolType = "Bow"
        let attackMultiplier = 1

        // direction of player to player mouse position
        let x = mouseX - playerX
        let y = mouseY - playerY

        let projectileSpeed = 5

        // Spawn projectile with direction from player to player mouse
        let direction = MathUtil.getNormalizedSpeed(mouseX - playerX, mouseY - playerY, projectileSpeed)
        gameManager.getProjectileManager().spawnProjectile({
            sprite: projectileName,
            stat: playerState.stat,
            spawnX: playerX,
            spawnY: playerY,
            width: 10,
            height: 10,
            initialVelocity: direction,
            collisionCategory: collisionCategory,
            range: range,
            activeTime: activeTime,
            poolType: poolType,
            attackMultiplier: attackMultiplier,
            magicMultiplier: 0,
            originEntityId: playerState.getId(),
            spawnSound: "shoot_arrow",
        })

        // spawn projectile with direction rotated 30 degrees from player to player mouse
        let directionRotated30 = MathUtil.getRotatedSpeed(x, y, projectileSpeed, 10)
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
            attackMultiplier: attackMultiplier,
            magicMultiplier: 0,
            originEntityId: playerState.getId(),
            spawnSound: "shoot_arrow",
        })

        // spawn projectile with direction rotated -30 degrees from player to player mouse
        let directionRotatedMinus30 = MathUtil.getRotatedSpeed(x, y, projectileSpeed, -10)
        gameManager.getProjectileManager().spawnProjectile({
            sprite: projectileName,
            stat: playerState.stat,
            spawnX: playerX,
            spawnY: playerY,
            width: 10,
            height: 10,
            initialVelocity: directionRotatedMinus30,
            collisionCategory: collisionCategory,
            range: range,
            activeTime: activeTime,
            poolType: poolType,
            attackMultiplier: attackMultiplier,
            magicMultiplier: 0,
            originEntityId: playerState.getId(),
            spawnSound: "shoot_arrow",
        })
    }
}