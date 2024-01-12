import { Body } from "matter-js";
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import GodUpgrade from "../GodUpgrade";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectLogic from "../../../EffectLogic";

export default class BloodCollection extends GodUpgrade{
    effectLogicId: string = "BloodCollection"
    private healAmount = 0.01
    protected attackSound = "water_drop"

    public initUpgradeFunctions(): void {
        this.upgradeFunctions = [this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this)]
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        let stateffect = EffectFactory.createStatEffect({hp: playerState.stat.maxHp * this.healAmount})
        EffectManager.addEffectsTo(playerState, stateffect)
        playerState.sound.playSoundEffect("health_pickup")
    }
    
    public upgrade1(): void {
        this.healAmount += 0.01
    }
}