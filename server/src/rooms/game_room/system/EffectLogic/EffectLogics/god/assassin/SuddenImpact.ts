import { Body } from "matter-js";
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import GodUpgrade from "../GodUpgrade";
import Cooldown from "../../../../../schemas/gameobjs/Cooldown";

export default class SuddenImpact extends GodUpgrade{
    effectLogicId: string = "SuddenImpact"
    private critRateGain = 0.05
    protected duration = 1
    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        playerState.stat.critRate += this.critRateGain
        setTimeout(()=>{
            playerState.stat.critRate -= this.critRateGain
        }, this.duration * 1000)
    }

    public initUpgradeFunctions(): void {
        this.upgradeFunctions.concat([this.upgrade1, this.upgrade1, this.upgrade1, this.upgrade1, this.upgrade1])
    }

    public upgrade1(): void {
        this.critRateGain += 0.01
        this.duration += 0.5
    }
}