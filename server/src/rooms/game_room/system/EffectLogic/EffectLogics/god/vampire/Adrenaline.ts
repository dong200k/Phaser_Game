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

export default class Adrenaline extends CooldownGodUpgrade{
    effectLogicId: string = "Adrenaline"
    private healthLost = 0.01
    private attackSpeedGain = 0.01
    private damageGain = 0.01
    private damageGainSoFar = 0
    private attackSpeedGainSoFar = 0
    protected cooldown?: Cooldown | undefined = new Cooldown(1)
    public initUpgradeFunctions(): void {
        this.upgradeFunctions = [this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this)]
    }
    
    public upgrade1(): void {
        this.healthLost += 0.01
        this.damageGain += 0.01
        this.attackSpeedGain += 0.01
    }

    public update(deltaT: number): void {
        if(!this.cooldown) return
        this.cooldown.tick(deltaT)

        if(this.cooldown.isFinished && this.playerState){
            this.cooldown.reset()
            if(this.playerState.stat.hp < this.playerState.stat.maxHp * 0.6){
                this.playerState.stat.damagePercent -= this.damageGainSoFar
                this.playerState.stat.attackPercent -= this.attackSpeedGainSoFar
            }else{
                this.playerState.stat.damagePercent += this.damageGain
                this.playerState.stat.attackSpeedPercent += this.attackSpeedGain
                this.playerState.stat.hp -= this.playerState.stat.maxHp * this.healthLost
            }
        }
    }
}