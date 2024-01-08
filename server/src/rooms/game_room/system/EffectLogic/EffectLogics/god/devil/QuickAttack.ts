import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectLogic from "../../../EffectLogic";

export default class QuickAttack extends EffectLogic{
    effectLogicId: string = "QuickAttack"
    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        let statEffect = EffectFactory.createStatEffect({attackSpeedPercent: 1, attack: -2/3 * entity.stat.attack})
        EffectManager.addEffectsTo(entity, statEffect)
    }
}