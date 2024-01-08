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

export default class Knowledge extends CooldownGodUpgrade{
    effectLogicId: string = "Knowledge"
    private attackGain = 0.1
    protected cooldown?: Cooldown | undefined = new Cooldown(2)
    protected initialLevel = 0
    public initUpgradeFunctions(): void {
        this.upgradeFunctions.concat([this.upgrade1, this.upgrade1, this.upgrade1, this.upgrade1, this.upgrade1])
    }
    
    public upgrade1(): void {
        this.attackGain += 0.1
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
            this.playerState.stat.attack += this.attackGain * diff
        }
    }
}