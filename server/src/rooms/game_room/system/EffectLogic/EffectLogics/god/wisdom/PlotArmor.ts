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

export default class PlotArmor extends CooldownGodUpgrade{
    effectLogicId: string = "PlotArmor"
    private armorGain = 5
    private healAmount = 0.1
    protected cooldown?: Cooldown | undefined = new Cooldown(1)
    protected initialLevel = 0
    public initUpgradeFunctions(): void {
        this.upgradeFunctions.concat([this.upgrade1, this.upgrade1, this.upgrade1, this.upgrade1, this.upgrade1])
    }
    
    public upgrade1(): void {
        this.armorGain += 5
        this.healAmount += 0.1
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        if(this.firstTime){
            this.firstTime = false
            this.gameManager = gameManager
            this.playerState = playerState
            this.initialLevel = playerState.level
        }
    }

    public update(deltaT: number): void {
        if(!this.cooldown) return
        this.cooldown.tick(deltaT)

        if(this.cooldown.isFinished && this.playerState && this.initialLevel < this.playerState.level){
            this.cooldown.reset()
            let diff = this.playerState.level - this.initialLevel
            this.initialLevel = this.playerState.level
            let statEffect = EffectFactory.createStatEffect({
                hp: this.healAmount * this.playerState.stat.maxHp * diff,
                armor: this.armorGain * diff
            })
            EffectManager.addEffectsTo(this.playerState, statEffect)
        }
    }
}