import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectLogic from "../../../EffectLogic";

export default class CriticalDeal extends EffectLogic{
    effectLogicId: string = "CriticalDeal"
    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        let critRateToConvert = entity.stat.critRate / 2
        let critDamage = entity.stat.critDamage + critRateToConvert * 10
        let statEffect = EffectFactory.createStatEffect({critRate: -critRateToConvert, critDamage})
        EffectManager.addEffectsTo(entity, statEffect)
    }
}