import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectLogic from "../../../EffectLogic";

export default class BigTarget extends EffectLogic{
    effectLogicId: string = "BigTarget"
    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        let newMaxHp = entity.stat.maxHp * 2
        entity.stat.maxHp = newMaxHp
        entity.stat.hp += newMaxHp
        entity.stat.extraDamageTakenPercent += 1
        // let statEffect = EffectFactory.createStatEffect({hp: newMaxHp, maxHp: newMaxHp, extraDamageTakenPercent: 1})
        // EffectManager.addEffectsTo(entity, statEffect)
    }
}