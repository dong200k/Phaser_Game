import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import EffectLogic from "../../../EffectLogic";

export default class HeartSacrifice extends EffectLogic{
    effectLogicId: string = "HeartSacrifice"
    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        let newMaxHp = entity.stat.maxHp/2
        let newHp = entity.stat.hp > newMaxHp? newMaxHp : entity.stat.hp
        entity.stat.maxHp = newMaxHp
        entity.stat.hp = newHp
        entity.stat.cooldownReduction += 0.5
        // let statEffect = EffectFactory.createStatEffect({hp: newHp, maxHp: newMaxHp, cooldownReduction: 0.5})
    }
}