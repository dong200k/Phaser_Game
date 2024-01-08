import { Body } from "matter-js";
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import GodUpgrade from "../GodUpgrade";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectLogic from "../../../EffectLogic";
import Cooldown from "../../../../../schemas/gameobjs/Cooldown";

export default class HeavyWeight extends GodUpgrade{
    effectLogicId: string = "HeavyWeight"
    private firstTime = true
    private gameManager?: GameManager
    private playerState?: Player
    protected cooldown = new Cooldown(3)
    private bonusCount = 0
    private speedChange = 0.5
    private attackSpeedChange = 0.01
    private damageChange = 0.02
    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        if(this.firstTime){
            this.firstTime = false
            this.gameManager = gameManager
            this.playerState = playerState
        }
    }

    public initUpgradeFunctions(): void {
        this.upgradeFunctions.concat([this.upgrade1, this.upgrade1, this.upgrade1, this.upgrade1, this.upgrade1])
    }

    public update(deltaT: number): void {
        this.cooldown.tick(deltaT)
        // Grants player damage but lowers attack speed and speed. Can't go below 10% of attack speed or speed
        if(this.cooldown.isFinished && this.playerState){
            let bonusCount = Math.floor((this.playerState.stat.maxHp + this.playerState.stat.armor)/10)
            let diff = bonusCount - this.bonusCount
            if(diff > 0) {
                let maxDiffForSpeed = (this.playerState.stat.attackSpeed * 0.9)/this.speedChange
                let maxDiffForattackSpeed = (this.playerState.stat.attackSpeed * 0.9)/this.attackSpeedChange
                diff = Math.min(maxDiffForSpeed, maxDiffForattackSpeed, diff)
            }
            this.bonusCount += diff
            let speedChange = -diff * this.speedChange
            let damageChange = diff * this.damageChange
            let attackSpeedChange = -diff * this.attackSpeedChange
            let statEffect = EffectFactory.createStatEffect({
                damagePercent: damageChange,
                attackSpeedPercent: attackSpeedChange,
                speed: speedChange
            })
            EffectManager.addEffectsTo(this.playerState, statEffect)
        }
    }

    public upgrade1(): void {
        if(this.playerState){
            let upgradeAmount = 0.01
            this.damageChange += upgradeAmount
            let statEffect = EffectFactory.createStatEffect({
                damagePercent: upgradeAmount * this.bonusCount,
            })
            EffectManager.addEffectsTo(this.playerState, statEffect)
        }
    }
}