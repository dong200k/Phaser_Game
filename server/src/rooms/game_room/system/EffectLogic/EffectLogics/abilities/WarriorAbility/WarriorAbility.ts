import Matter from "matter-js";
import MathUtil from "../../../../../../../util/MathUtil";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Entity from "../../../../../schemas/gameobjs/Entity";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import WarriorController from "../../../../StateControllers/WarriorController/WarriorController";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectLogic from "../../../EffectLogic";


export default class WarriorAbility extends EffectLogic {

    effectLogicId: string = "warrior-ability";

    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        // The Warrior Ability is inside the special state of the WarriorController.
    }

}
