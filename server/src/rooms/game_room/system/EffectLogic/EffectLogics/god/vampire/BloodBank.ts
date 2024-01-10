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

export default class BloodBank extends CooldownGodUpgrade{
    effectLogicId: string = "BloodBank"
    private healAmount = 0.01
    protected cooldown?: Cooldown | undefined = new Cooldown(1)
    public initUpgradeFunctions(): void {
        this.upgradeFunctions = [this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this)]
    }
    
    public upgrade1(): void {
        this.healAmount += 0.01
    }

    public update(deltaT: number): void {
        if(!this.cooldown) return
        this.cooldown.tick(deltaT)

        if(this.cooldown.isFinished && this.playerState && this.playerState.stat.hp < this.playerState.stat.maxHp * 0.3){
            this.cooldown.reset()
            let stateffect = EffectFactory.createStatEffect({hp: this.playerState.stat.maxHp * this.healAmount})
            EffectManager.addEffectsTo(this.playerState, stateffect)
        }
    }
}