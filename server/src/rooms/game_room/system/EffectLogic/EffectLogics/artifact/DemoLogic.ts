import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import ContinuousEffectUntimed from "../../../../schemas/effects/continuous/ContinuousEffectUntimed";
import Player from "../../../../schemas/gameobjs/Player";
import { CategoryType } from "../../../Collisions/Category";
import DatabaseManager from "../../../Database/DatabaseManager";
import GameManager from "../../../GameManager";
import { ITriggerType } from "../../../interfaces";
import EffectLogic from "../../EffectLogic";

/** triggered automatically,
 * TODO: show cool animations 
*/
export class DemoLogic extends EffectLogic{
    effectLogicId = "demo2" 
    triggerType: ITriggerType = "none"

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        let artifact = tree
        let collisionCategory: CategoryType =  "PLAYER_PROJECTILE"
        let poolType = "Horizontal-Glaive"

        let xVelocity = Math.random() * 100 + 10
        if(Math.random()<0.5) xVelocity *= -1

        gameManager.getProjectileManager().spawnProjectile({
            sprite: DatabaseManager.getManager().getWeaponProjectile(artifact?.weaponId as string),
            stat: playerState.stat,
            spawnX: playerState.x,
            spawnY: playerState.y,
            width: 10,
            height: 10,
            initialVelocity: {x: xVelocity, y: 0},
            collisionCategory: collisionCategory,
            poolType: poolType,
            entity: playerState,
            range: 500,
            activeTime: 3000
        }, "Projectile")
    }
}


/** triggered by adventurer skill when cooldown is done
 * TODO: show cool animations
*/
export class DemoLogicSkill extends EffectLogic{
    effectLogicId = "demo" 
    triggerType: ITriggerType = "player skill"

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        let artifact = tree
        let collisionCategory: CategoryType =  "PLAYER_PROJECTILE"
        let poolType = "Horizontal-Glaive"

        let yVelocity = Math.random() * 100 + 10
        if(Math.random()<0.5) yVelocity *= -1

        // Find the demo2 horizontal shuriken effect
        let effect = playerState.effects.find((effect)=>{
            if("effectLogicId" in effect){
                return effect.effectLogicId === "demo2"
            }else{
                return false
            }
        })

        let tickRate = 1
        if(effect && effect instanceof ContinuousEffectUntimed){
            tickRate = effect.getTickRate()
            effect.setTickRate(0.1)
            effect.setTimeUntilNextTick(0)
        }

        let duration = 2000
        setTimeout(()=>{
            if(effect && effect instanceof ContinuousEffectUntimed){
                effect.setTickRate(tickRate)
                effect.setTimeUntilNextTick(tickRate)
            }
        }, duration)
        

        // gameManager.getProjectileManager().spawnProjectile({
        //     sprite: DatabaseManager.getManager().getWeaponProjectile(artifact?.weaponId as string),
        //     stat: playerState.stat,
        //     spawnX: playerState.x,
        //     spawnY: playerState.y,
        //     width: 10,
        //     height: 10,
        //     initialVelocity: {x: 0, y: yVelocity},
        //     collisionCategory: collisionCategory,
        //     poolType: poolType,
        //     entity: playerState,
        //     range: 50000,
        // }, "Projectile")    
    }
}