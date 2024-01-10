import { Body } from "matter-js";
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import GodUpgrade from "../GodUpgrade";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectLogic from "../../../EffectLogic";
import CooldownGodUpgrade from "../CooldownGodUpgrade";
import Cooldown from "../../../../../schemas/gameobjs/Cooldown";

export default class Journey extends GodUpgrade{
    effectLogicId: string = "Journey"
    private expGainPercent = 0.01
    public initUpgradeFunctions(): void {
        this.upgradeFunctions = [this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this)]
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        playerState.xp += this.expGainPercent * playerState.maxXp
        gameManager.getPlayerManager().checkPlayerCanLevel(playerState)
    }
    
    public upgrade1(): void {
        this.expGainPercent += 0.1
    }

}