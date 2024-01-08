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

export default class Experience extends CooldownGodUpgrade{
    effectLogicId: string = "Experience"
    private expGain = 25
    protected cooldown?: Cooldown | undefined = new Cooldown(1)
    public initUpgradeFunctions(): void {
        this.upgradeFunctions.concat([this.upgrade1, this.upgrade1, this.upgrade1, this.upgrade1, this.upgrade1])
    }
    
    public upgrade1(): void {
        this.expGain += 25
    }

    public update(deltaT: number): void {
        if(!this.cooldown) return
        this.cooldown.tick(deltaT)

        if(this.cooldown.isFinished && this.playerState){
            this.cooldown.reset()
            this.playerState.xp += (this.playerState.stat.expRate + 1) * this.expGain
        }
    }
}