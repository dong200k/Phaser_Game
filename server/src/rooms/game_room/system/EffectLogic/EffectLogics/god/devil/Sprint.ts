import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Entity from "../../../../../schemas/gameobjs/Entity";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import EffectLogic from "../../../EffectLogic";

export default class Sprint extends EffectLogic{
    effectLogicId: string = "Sprint"
    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        if(entity instanceof Player) entity.playerController.devilRollUpgrade()
    }
}