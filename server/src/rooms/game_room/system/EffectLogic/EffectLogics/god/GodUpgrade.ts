import { Body } from "matter-js";
import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import { SpecialEffectLogic } from "../special/SpecialEffectLogic";
import Cooldown from "../../../../schemas/gameobjs/Cooldown";

/** Effect Logic that can be upgraded easily by calling the upgrade method */
export default class GodUpgrade extends SpecialEffectLogic{
    upgradeFunctions: Function[] = []
    /** Indicates which upgrade function to call when upgrade is given */
    protected currentUpgrade = 0
    protected amountCap: number = 12
    protected amount: number = 1

    constructor(config: any){
        super(config)
        this.initUpgradeFunctions()
    }

    /** Initialize upgrade functions here */
    public initUpgradeFunctions(){
        this.currentUpgrade = 0
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        
    }

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        
    }

    public upgrade(){
        let upgradeFunction = this.upgradeFunctions[this.currentUpgrade]
        if(upgradeFunction) upgradeFunction()
        this.currentUpgrade++
    }

    /**
     * 
     * @returns The total attack multiplier
     */
    public getAttackMult(playerState?: Player){
        return this.attackMultiplier * this.bonusAttackMultiplier
    }

    /**
     * 
     * @returns The total magic attack multiplier
     */
    public getMagicMult(playerState?: Player){
        return 0
    }

    protected getTarget(player: Player, gameManager: GameManager){
        let target = gameManager.getDungeonManager().getClosestActiveMonster({x: player.x, y: player.y})
        if(!target) return player
        return target
    }
}