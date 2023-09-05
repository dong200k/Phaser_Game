import MathUtil from "../../../../../../../util/MathUtil"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import { CategoryType } from "../../../../Collisions/Category"
import { getFinalAttackRange } from "../../../../Formulas/formulas"
import GameManager from "../../../../GameManager"
import EffectLogic from "../../../EffectLogic"

export default class HomingMissile1 extends EffectLogic{
    effectLogicId = "Homing-Missile-1"

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Matter.Body, mouseData: {mouseX: number, mouseY: number}){
        
        // Grab Mouse Data and Player weapon
        let {mouseX, mouseY} = mouseData
        let baseRange = 300
        
        let range = getFinalAttackRange(playerState.stat, baseRange)
        let activeTime = 3000
        let weaponId = playerState.weaponUpgradeTree.weaponId
        //let projectileName = DatabaseManager.getManager().getWeaponProjectile(weaponId as string);
        let projectileName = "demo_hero";
        //console.log(weaponId, projectileName);
        let playerX = playerBody.position.x
        let playerY = playerBody.position.y
        
        let collisionCategory: CategoryType =  "PLAYER_PROJECTILE"
        let poolType = "Tome"

        let projectileSpeed = 2
        let velocity = MathUtil.getNormalizedSpeed(mouseX - playerX, mouseY - playerY, projectileSpeed)

        gameManager.getProjectileManager().spawnProjectile({
            sprite: projectileName,
            stat: playerState.stat,
            spawnX: playerX,
            spawnY: playerY,
            width: 10,
            height: 10,
            initialVelocity: velocity,
            collisionCategory: collisionCategory,
            range: range,
            activeTime: activeTime,
            poolType: poolType,
            attackMultiplier: 1,
            magicMultiplier: 0,
            originEntityId: playerState.getId(),
            projectileSpeed: projectileSpeed,
            data: {
                position: playerBody.position
            }
        }, "HomingProjectile")
    }
}