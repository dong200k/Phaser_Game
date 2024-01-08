import { Body } from "matter-js";
import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import GodUpgrade from "./GodUpgrade";
import { getTimeAfterCooldownReduction } from "../../../Formulas/formulas";

/** Effect is triggered based on a cooldown */
export default class CooldownGodUpgrade extends GodUpgrade{
    protected firstTime = true
    protected gameManager?: GameManager
    protected playerState?: Player
    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        if(this.firstTime){
            this.firstTime = false
            this.gameManager = gameManager
            this.playerState = playerState
        }
    }

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        
    }

    public update(deltaT: number): void {
        if(!this.cooldown || !this.playerState) return
        let time = getTimeAfterCooldownReduction(this.playerState.stat, deltaT)
        this.cooldown.tick(time)
        if(this.cooldown.isFinished) {
            this.cooldown.reset()
            if(this.playerState && this.gameManager) this.useSpecial(this.playerState, this.gameManager)
        }
    }
}