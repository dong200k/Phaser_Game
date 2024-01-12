import { type, Schema, ArraySchema } from '@colyseus/schema';
import { UpgradeItem } from './gameobjs/Player';

/** Forge Upgrades for a single player */
export default class ForgeUpgrade extends Schema{
    /** Upgrades forge offers */
    @type([UpgradeItem]) upgradeItems = new ArraySchema<UpgradeItem>()
    /** Chances remaining for the player to pick upgrades */
    @type('number') chancesRemaining: number

    constructor(upgradeItems: UpgradeItem[], chancesRemaining = 1){
        super()
        this.upgradeItems.push(...upgradeItems)
        this.chancesRemaining = chancesRemaining
    }
    
    setChancesRemaining(chancesRemaining: number = 1){
        this.chancesRemaining = chancesRemaining
    }
    
    setUpgradeItems(upgradeItems: UpgradeItem[]){
        this.upgradeItems = new ArraySchema<UpgradeItem>(...upgradeItems)
    }
}