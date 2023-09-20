import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import EffectLogic from "../../../EffectLogic";

export default class DemoAbility extends EffectLogic{
    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        throw new Error("Method not implemented.");
    }
    
}