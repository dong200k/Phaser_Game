import { Body } from "matter-js";
import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import GodUpgrade from "./GodUpgrade";

/** Effect is triggered based attacking a certain amount of times and based on a trigger percentage */
export default class AttackTriggeredUpgrade extends GodUpgrade{
    protected attackRequired: number = 1
    /** Chance to trigger effect whenever attacks required is met */
    protected triggerChance: number = 1
    private attacksSoFar = 0
    private timeBetweenAttacks: number = 0

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        this.attacksSoFar++
        let i = 0
        while(this.attackRequired <= this.attacksSoFar){
            this.attacksSoFar -= this.attackRequired
            if(Math.random()>this.triggerChance) continue
            setTimeout(()=>{
                this.useSpecial(playerState, gameManager)
            }, i * this.timeBetweenAttacks)
            i++
        }
    }

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        
    }

    public update(deltaT: number): void {
        this.cooldown?.tick(deltaT)
    }
}