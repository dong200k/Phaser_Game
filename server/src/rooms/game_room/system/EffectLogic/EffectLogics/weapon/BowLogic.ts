import MathUtil from "../../../../../../util/MathUtil";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectLogic from "../../EffectLogic";

export default class BowLogic extends EffectLogic{
    effectLogicId = "BowLogic"

    public useEffect(playerState: Player, gameManager: GameManager, playerBody: Matter.Body, mouseData: {mouseX: number, mouseY: number}){
        // Grab Mouse Data and Player weapon
        let {mouseX, mouseY} = mouseData
        let weapon = playerState.weapon
        
        let projectileName = weapon.projectile
        let playerX = playerBody.position.x
        let playerY = playerBody.position.y
        let velocity = MathUtil.getNormalizedSpeed(mouseX - playerX, mouseY - playerY, 10)

        let body = gameManager.projectileManager.spawnProjectile(projectileName, playerState, playerX, playerY, velocity)
    }
}