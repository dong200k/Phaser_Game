import EffectLogic from "../../../system/EffectLogic/EffectLogic";
import { getRealTimeAfterCooldownReduction, getTimeAfterCooldownReduction } from "../../../system/Formulas/formulas";
import GameManager from "../../../system/GameManager";
import WeaponUpgradeTree from "../../Trees/WeaponUpgradeTree";
import Entity from "../../gameobjs/Entity";
import Stat from "../../gameobjs/Stat";
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
    effectLogic?: EffectLogic
    private cooldown: number

    constructor(effectLogicId: string, cooldown: number, type: string, doesStack: boolean, collisionGroup: number){
        super(cooldown/1000)
        this.cooldown = cooldown
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
            this.effectLogic?.useEffect(entity, this.gameManager, this.tree)
            return true
        }catch(e: any){
            console.log(e?.message)
            return false
        }
    }

    public update(deltaT: number){
        let owner = this.tree?.owner
        let newDeltaT = deltaT
        if(owner) newDeltaT = getTimeAfterCooldownReduction(owner.stat, newDeltaT)
        
        this.effectLogic?.update(newDeltaT)
        return super.update(newDeltaT)
    }

    public setTree(tree: WeaponUpgradeTree){
        this.tree = tree
        this.createEffectLogic()
    }

    public createEffectLogic(){
        let gameManager = this.tree?.getGameManager()
        let effectLogicManager = gameManager?.getEffectLogicManager()
        if(effectLogicManager){
            this.gameManager = gameManager as GameManager
            let temp = effectLogicManager.getEffectLogicCtorAndConfig(this.effectLogicId)
            if(temp){
                let {config, ctor} = temp
                this.effectLogic = new ctor(config) 
            }
        }
    }

    protected onRemoveFromEntity(): void {
        let entity = this.getEntity()
        let gameManager = this.tree?.getGameManager()
        if(entity && this.effectLogic && gameManager) {
            this.effectLogic.removeEffect(entity, gameManager)
        }
    }

    public setGameManager(gameManager: GameManager){
        this.gameManager = gameManager
    }

    public toString(): string {
        return `${this.effectLogicId}, ds: ${this.doesStack}, cg : ${this.collisionGroup}`
        // return super.toString() + `(effectLogicId: ${this.effectLogicId}, does stack?: ${this.doesStack}, collisionGroup: ${this.collisionGroup})`;
    }

    /**
     * 
     * @returns the max cooldown of this effect in seconds after accounting player stat
     */
    public getCooldown(stat: Stat){
        return getRealTimeAfterCooldownReduction(stat, this.cooldown/1000)
    }
}