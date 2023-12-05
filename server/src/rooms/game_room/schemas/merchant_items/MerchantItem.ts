import GameManager from "../../system/GameManager";
import GameObject from "../gameobjs/GameObject";
import Player from "../gameobjs/Player";
import { type } from '@colyseus/schema';

export interface IMerchantItemConfig {
    levelCost?: number,
    coinCost?: number,
    name?: string,
    description?: string,
    imageKey?: string,
    amount?: number
}

export default abstract class MerchantItem extends GameObject{
    @type('number') levelCost = 0
    @type('number') coinCost = 0
    @type('string') description
    @type('string') imageKey
    /** Amount of times the item can be purchased */
    @type('number') amount

    constructor(gameManager: GameManager, config?: IMerchantItemConfig){
        super(gameManager, 0, 0)
        this.levelCost = config?.levelCost ?? this.levelCost
        this.coinCost = config?.coinCost ?? this.coinCost
        this.name = config?.name ?? ""
        this.description = config?.description ?? ""
        this.imageKey = config?.imageKey ?? "demo_hero"
        this.amount = config?.amount ?? 1
    }
    
    /**
     * This method is used to apply the item's effect to the player who purchased it.
     * @param player 
     * @param item 
     */
    public abstract consumeItem(player: Player): void


    /**
     * This method will attempt to purchase an item.
     * @param player 
     * @returns true if the item was successfully purchased else returns the reason the item cannot be purchased.
     */
    public attemptPurchase(player: Player): boolean | string {
        if(player.level >= this.levelCost && player.coinsEarned >= this.coinCost){
            player.level -= this.levelCost
            player.coinsEarned -= this.coinCost
            this.amount--
            return true
        }else{
            return "Insufficient currency"
        }
    }
}