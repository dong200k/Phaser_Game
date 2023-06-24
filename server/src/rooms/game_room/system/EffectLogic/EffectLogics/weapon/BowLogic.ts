import MathUtil from "../../../../../../util/MathUtil";
import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../schemas/gameobjs/Player";
import { CategoryType } from "../../../Collisions/Category";
import DatabaseManager from "../../../Database/DatabaseManager";
import GameManager from "../../../GameManager";
import EffectLogic from "../../EffectLogic";

export default class BowLogic extends EffectLogic{
    effectLogicId = "BowLogic"

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Matter.Body, mouseData: {mouseX: number, mouseY: number}){
        // Grab Mouse Data and Player weapon
        let {mouseX, mouseY} = mouseData
        
        let range = 300
        let activeTime = 3000
        let weaponId = playerState.weaponUpgradeTree.weaponId
        let playerX = playerBody.position.x
        let playerY = playerBody.position.y
        let velocity = MathUtil.getNormalizedSpeed(mouseX - playerX, mouseY - playerY, 10)
        let collisionCategory: CategoryType =  "PLAYER_PROJECTILE"
        let poolType = "Bow"

        gameManager.getProjectileManager().spawnProjectile({
            sprite: DatabaseManager.getManager().getWeaponProjectile(weaponId as string),
            stat: playerState.stat,
            spawnX: playerX,
            spawnY: playerY,
            width: 10,
            height: 10,
            initialVelocity: velocity,
            collisionCategory: collisionCategory,
            range: range,
            activeTime: activeTime,
            poolType: poolType
        })
    }
}