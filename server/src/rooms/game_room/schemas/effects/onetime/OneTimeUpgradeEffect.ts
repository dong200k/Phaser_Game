import EffectLogic from "../../../system/EffectLogic/EffectLogic";
import WeaponUpgradeTree from "../../Trees/WeaponUpgradeTree";
import Entity from "../../gameobjs/Entity";
import Effect from "../Effect";

/**
 * A weapon or artifact effect that will only get called once.
 */
export default class OneTimeUpgradeEffect extends Effect {
    
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

    constructor(effectLogicId: string, doesStack: boolean, collisionGroup: number) {
        super();
        this.setName("OneTimeEffect Upgrade Effect");
        this.setDescription("One Time Upgrade Effect");
        this.effectLogicId = effectLogicId
        this.doesStack = doesStack
        this.collisionGroup = collisionGroup
    }

    public update(deltaT: number): number {
        let entity = this.getEntity();
        if(deltaT > 0 && entity && this.applyEffect(entity))
            this.setAsCompleted();
        return deltaT;
    }

    public applyEffect(entity: Entity){
        // console.log("applying onetime upgrade effect")
        let gameManager = this.tree?.getGameManager()
        try{
            // use effect that effectLogicId references
            // console.log("piercing effect's effect logic", this.effectLogic)
            if(gameManager) this.effectLogic?.useEffect(entity, gameManager, this.tree)
            return true
        }catch(e: any){
            console.log(e?.message)
            return false
        }
    }

    public setTree(tree: WeaponUpgradeTree){
        this.tree = tree
        this.createEffectLogic()
    }

    public createEffectLogic(){
        let gameManager = this.tree?.getGameManager()
        let effectLogicManager = gameManager?.getEffectLogicManager()
        if(gameManager && effectLogicManager){
            let temp = effectLogicManager.getEffectLogicCtorAndConfig(this.effectLogicId)
            if(temp){
                let {config, ctor} = temp
                this.effectLogic = new ctor(config) 
            }
        }
    }

    public toString(): string {
        return `${this.effectLogicId}, ds: ${this.doesStack}, cg : ${this.collisionGroup}`
    }

    protected onComplete(): void {}
    protected onAddToEntity(entity: Entity): void {}
    protected onRemoveFromEntity(): void {}
    protected onReset(): void {}
}