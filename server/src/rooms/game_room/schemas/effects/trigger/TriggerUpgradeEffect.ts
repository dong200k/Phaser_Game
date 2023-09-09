import Cooldown from "../../gameobjs/Cooldown";
import Entity from "../../gameobjs/Entity";
import TriggerEffect from "./TriggerEffect";
import EffectLogicManager from "../../../system/EffectLogic/EffectLogicManager";
import WeaponUpgradeTree from "../../Trees/WeaponUpgradeTree";
import GameManager from "../../../system/GameManager";
import EffectLogic from "../../../system/EffectLogic/EffectLogic";

/** TriggerEffect, but with cooldown. Used for Weapon Upgrade and Artifact Upgrade trees logics that are triggered by player input. */
export default class TriggerUpgradeEffect extends TriggerEffect {
    
    /** Cooldown of the effectLogic */
    cooldown: Cooldown
    /** Id of effectLogic to use */
    effectLogicId: string
    /** Whether the UpgradeTriggerEffect stacks with other UpgradeTriggerEffects on a single Entity with the same collisionGroup besides a collisionGroup of -1*/
    doesStack: boolean
    /** holds collision info, if any pair of UpgradeTriggerEffect on a single Entity has doesStack = false,
     * if either collisionGroup === -1 or they are different nothing happens,
     * if their collisionGroups are the same the old one is removed from the Entity if they came from the same tree */
    collisionGroup: number
    tree?: WeaponUpgradeTree
    effectLogic?: EffectLogic

    constructor(effectLogicId: string, cooldown:number=1000, type: string, doesStack: boolean, collisionGroup: number) {
        super(type);
        this.setName("UpgradeTriggerEffect");
        this.setDescription("TriggerEffect but with a cooldown. Used for Weapon/Artifact Upgrade logic that are triggered by player input. ");
        this.cooldown = new Cooldown(cooldown)
        this.effectLogicId = effectLogicId
        this.doesStack = doesStack
        this.collisionGroup = collisionGroup
    }

    /**
     * Updates this UpgradeTriggerEffect's cooldown
     */
    public update(deltaT: number): number {
        this.cooldown.tick(deltaT * 1000) // pass in miliseconds
        return 0
    }

    public setTree(tree: WeaponUpgradeTree){
        this.tree = tree
        this.createEffectLogic()
    }

    public createEffectLogic(){
        let gameManager = this.tree?.getGameManager()
        let effectLogicManager = gameManager?.getEffectLogicManager()
        if(gameManager && effectLogicManager){
            let ctor = effectLogicManager.getEffectLogicConstructor(this.effectLogicId)
            if(ctor) this.effectLogic = new ctor()
        }
    }

    /** Uses the effect referenced by effectLogicId if cooldown is finished */
    public onTrigger(entity: Entity, ...args: any): boolean {
        // console.log(`using trigger effect for ${this.effectLogicId}`)

        // cooldown not finished return
        if(!this.cooldown.isFinished) return false

        // restart cooldown and use corresponding effect logic
        this.cooldown.reset()
        let gameManager = this.tree?.getGameManager()
        try{
            // use effect that effectLogicId references
            if(gameManager) this.effectLogic?.useEffect(entity, gameManager, this.tree, ...args)
            return true
        }catch(e: any){
            console.log(e?.message)
            return false
        }
    }

    public onRemoveFromEntity(){
        let entity = this.getEntity()
        let gameManager = this.tree?.getGameManager()
        if(entity && this.effectLogic && gameManager) {
            this.effectLogic.removeEffect(entity, gameManager)
        }
    }
    
    public toString(): string {
        return `${this.effectLogicId}, ds: ${this.doesStack}, cg : ${this.collisionGroup}`
    //    return `${super.toString()}(effectLogicId: ${this.effectLogicId}, does stack?: ${this.doesStack}, collisionGroup: ${this.collisionGroup}, cooldown finished?: ${this.cooldown.isFinished}, original time: ${this.cooldown.time}, time remaining: ${this.cooldown.remainingTime})`;
    }

    public applyEffect(entity: Entity): boolean {
        // throw new Error("Method not implemented.");
        return true
    }
    
}