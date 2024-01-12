import { Body } from "matter-js";
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import GodUpgrade from "../GodUpgrade";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectLogic from "../../../EffectLogic";

export default class DeadlyStrike extends EffectLogic{
    effectLogicId: string = "DeadlyStrike"
    private playerState?: Player
    private attackGain = 2
    private critRateGain = 0.02
    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        let stateffect = EffectFactory.createStatEffect({attack: this.attackGain, critRate: this.critRateGain})
        EffectManager.addEffectsTo(playerState, stateffect)
    }
}