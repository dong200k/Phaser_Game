import GameManager from "../../../system/GameManager";
import EffectManager from "../../../system/StateManagers/EffectManager";
import EffectFactory from "../../effects/EffectFactory";
import { StatConfig } from "../../effects/temp/StatEffect";
import Player from "../../gameobjs/Player";
import MerchantItem, { IMerchantItemConfig } from "../MerchantItem";

export type IStatItemConfig = {
    statConfig: StatConfig
} & IMerchantItemConfig

export default class StatItem extends MerchantItem{
    private statConfig: StatConfig

    constructor(gameManager: GameManager, config: IStatItemConfig,){
        super(gameManager, config)
        this.statConfig = config.statConfig
        
    }

    public consumeItem(player: Player): void {
        let statEffect = EffectFactory.createStatEffect(this.statConfig)
        EffectManager.addStatEffectsTo(player, statEffect)
    }
}