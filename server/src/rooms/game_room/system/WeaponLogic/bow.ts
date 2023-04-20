import MathUtil from "../../../../util/MathUtil";
import Player from "../../schemas/gameobjs/Player";
import GameManager from "../GameManager";
import { IWeaponLogic } from "./WeaponLogic";

const bow: IWeaponLogic = {
    weaponId: "bow",
    useAttack(playerState: Player, gameManager: GameManager, data?: any){
        let {mouseX, mouseY, playerBody} = data 

        // ***TODO*** grab projectile info from weapon player is using
        let spriteName = "demo_hero"
        let playerX = playerBody.position.x
        let playerY = playerBody.position.y
        let velocity = MathUtil.getNormalizedSpeed(mouseX - playerX, mouseY - playerY, 10)

        let body = gameManager.projectileManager.spawnProjectile(spriteName, playerState, playerX, playerY, velocity)
    }
}

export default bow