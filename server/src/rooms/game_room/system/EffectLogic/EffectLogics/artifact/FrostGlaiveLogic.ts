import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../schemas/gameobjs/Player";
import { CategoryType } from "../../../Collisions/Category";
import DatabaseManager from "../../../Database/DatabaseManager";
import GameManager from "../../../GameManager";
import { ITriggerType } from "../../../interfaces";
import EffectLogic from "../../EffectLogic";

/** triggered automatically, spawns frost glaive spinning around player
 * TODO: show cool animations and use frost glaive sprite
*/
export class FrostGlaive extends EffectLogic{
    effectLogicId = "Frost-glaive" 
    triggerType: ITriggerType = "none"

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        let artifact = tree
        let collisionCategory: CategoryType =  "PLAYER_PROJECTILE"
        let poolType = "Frost-glaive"

        gameManager.getProjectileManager().spawnProjectile({
            sprite: DatabaseManager.getManager().getWeaponProjectile(artifact?.weaponId as string),
            stat: playerState.stat,
            spawnX: playerState.x,
            spawnY: playerState.y,
            width: 10,
            height: 10,
            initialVelocity: {x: 1, y: 1},
            collisionCategory: collisionCategory,
            poolType: poolType,
            entity: playerState,
            activeTime: 5000,
            data: {
                radius: 50,
                startDegree: 30,
                cycleTime: 500,
            },
        }, "CircularFollowProjectile")
    }
}


/** triggered by adventurer skill when cooldown is done
 * TODO: show cool animations
*/
export class FrostGlaiveFrenzy extends EffectLogic{
    effectLogicId = "Frost-glaive-frenzy" 
    triggerType: ITriggerType = "player skill"

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        let artifact = tree
        let collisionCategory: CategoryType =  "PLAYER_PROJECTILE"
        let poolType = "Frost-glaive"
        let sprite = DatabaseManager.getManager().getWeaponProjectile(artifact?.weaponId as string)

        function spawnGlaive(radius: number, startDegree: number, cycleTime: number){
            gameManager.getProjectileManager().spawnProjectile({
                sprite: sprite,
                stat: playerState.stat,
                spawnX: playerState.x,
                spawnY: playerState.y,
                width: 10,
                height: 10,
                initialVelocity: {x: 1, y: 1},
                collisionCategory: collisionCategory,
                poolType: poolType,
                entity: playerState,
                activeTime: 5000,
                data: {
                    radius: radius,
                    startDegree: startDegree,
                    cycleTime: cycleTime,
                },
            }, "CircularFollowProjectile")
        }

        // Spawn random glaives
        let count = Math.floor(Math.random()* 10) + 3
        for(let i=0;i<=count;i++){
            let radius = Math.random() * 100 + 50
            let startDegree = Math.round(Math.random() * 360)
            let cycleTime = Math.random() * 2000 + 300
            spawnGlaive(radius, startDegree, cycleTime)
        }
    }
}