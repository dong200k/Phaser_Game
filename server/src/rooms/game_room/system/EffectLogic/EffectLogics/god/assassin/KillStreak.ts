import { Body } from "matter-js";
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import GodUpgrade from "../GodUpgrade";
import Cooldown from "../../../../../schemas/gameobjs/Cooldown";

export default class KillStreak extends GodUpgrade{
    effectLogicId: string = "KillStreak"
    private firstTime = true
    private gameManager?: GameManager
    private playerState?: Player
    protected cooldown = new Cooldown(3)
    private monstersSlainInitially = 0
    private critDamageGain = 0.01
    private monsterThreshold = 10
    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        if(this.firstTime){
            this.firstTime = false
            this.gameManager = gameManager
            this.playerState = playerState
            this.monstersSlainInitially = playerState.monstersKilled
        }

        // Compute attack speed bonus
        let monstersSlain = playerState.monstersKilled - this.monstersSlainInitially
        let count = Math.floor(monstersSlain/this.monsterThreshold)
        if(count >= 1){
            this.monstersSlainInitially += this.monsterThreshold * count
            playerState.stat.critDamage += this.critDamageGain * count
        }
    }

    public initUpgradeFunctions(): void {
        this.upgradeFunctions = [this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this), this.upgrade1.bind(this)]
    }

    public update(deltaT: number): void {
        this.cooldown.tick(deltaT)
        if(this.cooldown.isFinished && this.playerState){
            
        }
    }

    public upgrade1(): void {
        this.critDamageGain += 0.01
    }
}