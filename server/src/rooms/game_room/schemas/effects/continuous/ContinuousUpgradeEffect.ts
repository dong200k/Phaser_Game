import EffectLogicManager from "../../../system/EffectLogic/EffectLogicManager";
import GameManager from "../../../system/GameManager";
import WeaponUpgradeTree from "../../Trees/WeaponUpgradeTree";
import Entity from "../../gameobjs/Entity";
import ContinuousEffectUntimed from "./ContinuousEffectUntimed";

/** Extends ContinuousEffectUntimed, it is connected to an effectLogic through effectLogicId with the purpose of
 *  continously calling the effectLogic's effect. This is similar to the old weaponLogic and can be used in artifact/weapon ugprades trees and even 
 *  for monsters.
 */
export default class ContinuousUpgradeEffect extends ContinuousEffectUntimed{
    
    /** id that references an effectLogic which replaces the old weapon logic */
    effectLogicId: string
    /** Whether the UpgradeTriggerEffect stacks with other UpgradeTriggerEffects on a single Entity with the same collisionGroup besides a collisionGroup of -1*/
    doesStack: boolean
    /** holds collision info, if any pair of UpgradeTriggerEffect on a single Entity has doesStack = false,
     * if either collisionGroup === -1 or they are different nothing happens,
     * if their collisionGroups are the same the old one is removed from the Entity if they came from the same tree*/
    collisionGroup: number
    tree?: WeaponUpgradeTree
    gameManager!: GameManager

    constructor(effectLogicId: string, cooldown: number, type: string, doesStack: boolean, collisionGroup: number){
        super(cooldown/100)
        this.setName("Continuous Upgrade Effect")
        this.setDescription("Type of ContinuousEffecftUntime that repeatedly calls the effectLogic referenced by effectLogicId")
        this.effectLogicId = effectLogicId
        this.doesStack = doesStack
        this.collisionGroup = collisionGroup
    }

    public applyEffect(entity: Entity): boolean {
        // console.log(`using continuous effect for ${this.effectLogicId}`)
        try{
            // use effect that effectLogicId references
            let used = this.tree?.getGameManager()?.getEffectLogicManager().useEffect(this.effectLogicId, entity, this.tree)
            return used? true : false
        }catch(e: any){
            console.log(e?.message)
            return false
        }
    }

    public setTree(tree: WeaponUpgradeTree){
        this.tree = tree
    }

    public setGameManager(gameManager: GameManager){
        this.gameManager = gameManager
    }

    public toString(): string {
        return super.toString() + `(effectLogicId: ${this.effectLogicId}, does stack?: ${this.doesStack}, collisionGroup: ${this.collisionGroup})`;
    }
}