import { Body } from "matter-js";
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import GodUpgrade from "../GodUpgrade";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectLogic from "../../../EffectLogic";

export default class Assassinate extends EffectLogic{
    effectLogicId: string = "Assassinate"
    private playerState?: Player
    private firstHitDamage = 20
    private firstHitCritRateBonus = 5
    private firstHitCritDamageBonus = 25
    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        let stateffect = EffectFactory.createStatEffect({
            firstHitDamage: this.firstHitDamage, 
            firstHitCritDamageBonus: this.firstHitCritDamageBonus, 
            firstHitCritRateBonus: this.firstHitCritRateBonus
        })
        EffectManager.addEffectsTo(playerState, stateffect)
    }
}