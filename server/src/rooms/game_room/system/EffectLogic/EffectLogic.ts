import Entity from "../../schemas/gameobjs/Entity";
import GameManager from "../GameManager";
import { ITriggerType } from "../interfaces";

export interface IEffectLogicClass {
    new (): EffectLogic;
} 
/** Holds game logic for things such as a weapon attack or an artifact upgrade etc. Make sure to iniialize all new EffectLogics inside the EffectLogicManager or else they will be undefined.*/
export default abstract class EffectLogic{
    /** Unqiue id used to identify effect logics. These are set manually whenever a new EffectLogic is created. Make sure its unique by running the jest test
     *  after adding a new EffectLogic to the EffectLogicManager's initEffectLogics.*/
    effectLogicId = "EffectLogic-bow"

    /** What the effect logic is triggered by.
     * Note: setting this doesn't do anything its just so that its clear what the effect should be triggered by.
     */
    triggerType: ITriggerType = "none"

    /**
     * If true removeEffect will be called when the logic is removed.
     */
    shouldCallRemoveEffect: boolean = false

    /** EffectLogic's effect which could be a weapon/artifact/skill/monster game logic such as a weapon's attack or an artifact's effect */
    public abstract useEffect(entity: Entity, gameManager: GameManager, ...args: any): void

    /** Called when the Effect is removed from the entity. Logic to remove side effects when the effect is removed from the entity 
    */
    public removeEffect(entity: Entity, gameManager: GameManager, ...args: any){
    }

    /** Use to update the effectLogic.
     * Note triggerType: one time effect logics do not get their update methods called.
    */
    public udpate(deltaT: number){
    }
}