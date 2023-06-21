import Player from "../../../../schemas/gameobjs/Player";
import { CategoryType } from "../../../Collisions/Category";
import DatabaseManager from "../../../Database/DatabaseManager";
import GameManager from "../../../GameManager";
import { ITriggerType } from "../../../interfaces";
import EffectLogic from "../../EffectLogic";

/** triggered automatically 
 * TODO: show cool animations
*/
export class FrostGlaive extends EffectLogic{
    effectLogicId = "Frost-Glaive" 
    triggerType: ITriggerType = "none"

    public useEffect(playerState: Player, gameManager: GameManager){
        let artifact = playerState.artifacts.find(artifact=>artifact.name === "Frost-Glaive")
        let collisionCategory: CategoryType =  "PLAYER_PROJECTILE"
        let poolType = "Frost-Glaive"

        gameManager.getProjectileManager().spawnProjectile({
            sprite: DatabaseManager.getManager().getWeaponProjectile(artifact?.weaponId as string),
            stat: playerState.stat,
            spawnX: playerState.x,
            spawnY: playerState.y,
            width: 10,
            height: 10,
            initialVelocity: {x: 1, y: 1},
            collisionCategory: collisionCategory,
            poolType: poolType
        })
    }
}
