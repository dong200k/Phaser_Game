import MathUtil from "../../../../../util/MathUtil";
import Player from "../../../schemas/gameobjs/Player";
import GameManager from "../../GameManager";
import { IWeaponLogic } from "./WeaponLogic"; 

const weaponId = "bow-id"
// const weapon = 

const bow: IWeaponLogic = {
    weaponId: weaponId,
    useAttack(playerState: Player, gameManager: GameManager, data?: any){
        let {mouseX, mouseY, playerBody} = data 
        let weapon = playerState.weapon
        
        let projectileName = weapon.projectile
        let playerX = playerBody.position.x
        let playerY = playerBody.position.y
        let velocity = MathUtil.getNormalizedSpeed(mouseX - playerX, mouseY - playerY, 10)

        let body = gameManager.projectileManager.spawnProjectile(projectileName, playerState, playerX, playerY, velocity)
    }
}

export default bow