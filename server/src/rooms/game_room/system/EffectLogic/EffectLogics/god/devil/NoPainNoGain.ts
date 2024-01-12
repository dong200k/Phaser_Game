import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectLogic from "../../../EffectLogic";

export default class NoPainNoGain extends EffectLogic{
    effectLogicId: string = "NoPainNoGain"
    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        let statEffect = EffectFactory.createStatEffect({damagePercent: 1, extraDamageTakenPercent: 1})
        EffectManager.addEffectsTo(entity, statEffect)
    }
}