import Entity from "../../schemas/gameobjs/Entity";
import GameManager from "../GameManager";

/** Holds game logic for things such as a weapon attack or an artifact upgrade etc. Make sure to iniialize all new EffectLogics inside the EffectLogicManager or else they will be undefined.*/
export default abstract class EffectLogic{
    /** Unqiue id used to identify effect logics. These are set manually whenever a new EffectLogic is created. Make sure its unique by running the jest test
     *  after adding a new EffectLogic to the EffectLogicManager's initEffectLogics.
    */
    effectLogicId = "EffectLogic-bow"

    /** EffectLogic that could a weapon/artifact/skill/monster game logic such as a weapon's attack or an artifact's effect */
    public abstract useEffect(entity: Entity, gameManager: GameManager, ...args: any): void
}