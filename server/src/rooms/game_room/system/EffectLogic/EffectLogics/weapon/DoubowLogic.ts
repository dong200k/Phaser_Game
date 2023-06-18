import MathUtil from "../../../../../../util/MathUtil";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectLogic from "../../EffectLogic";

export default class DoubowLogic extends EffectLogic{
    effectLogicId = "Doubow"

    /** Shoots two projectiles at -30 and 30 degrees */
    public useEffect(playerState: Player, gameManager: GameManager, playerBody: Matter.Body, mouseData: {mouseX: number, mouseY: number}){
        // Grab Mouse Data and Player weapon
        let {mouseX, mouseY} = mouseData
        let weapon = playerState.weapon
        
        let projectileName = weapon.projectile
        let playerX = playerBody.position.x
        let playerY = playerBody.position.y

        // direction of player to player mouse position
        let x = mouseX - playerX
        let y = mouseY - playerY

        let projectileSpeed = 10

        // rotate that 30 degrees
        let directionRotated30 = MathUtil.getRotatedSpeed(x, y, projectileSpeed, 30)

        // rotate that -30 degrees
        let directionRotatedMinus30 = MathUtil.getRotatedSpeed(x, y, projectileSpeed, -30)

        gameManager.projectileManager.spawnProjectile(projectileName, playerState, playerX, playerY, directionRotated30)
        gameManager.projectileManager.spawnProjectile(projectileName, playerState, playerX, playerY, directionRotatedMinus30)
    }
}