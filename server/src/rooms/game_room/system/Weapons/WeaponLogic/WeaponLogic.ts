import Player from "../../../schemas/gameobjs/Player"
import GameManager from "../../GameManager"

export type IWeaponLogic = {
    weaponId: string,
    // update(deltaT: number): void,
    useAttack(playerState: Player, gameManager: GameManager, data?: any): void
}