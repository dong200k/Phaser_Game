import Entity from "../../schemas/gameobjs/Entity";
import GameManager from "../GameManager";
import EffectLogic from "./EffectLogic";
import RangerAbilityLogic from "./EffectLogics/abilities/RangerAbility";
import { DemoLogic, DemoLogicSkill } from "./EffectLogics/artifact/DemoLogic";
import { FrostGlaive, FrostGlaiveFrenzy } from "./EffectLogics/artifact/FrostGlaiveLogic";
import { HermesBoots } from "./EffectLogics/artifact/HermesBootLogic";
import BowLogic from "./EffectLogics/weapon/BowLogic";
import DoubowLogic from "./EffectLogics/weapon/DoubowLogic";
import HomingMissile1 from "./EffectLogics/weapon/PriestTome/HomingMissile1";
import HomingMissile2 from "./EffectLogics/weapon/PriestTome/HomingMissile2";
import TribowLogic from "./EffectLogics/weapon/TribowLogic";

export default class EffectLogicManager{

    /** effectLogic replaces the old weaponLogic. It holds a logic that could be used as a weapon or artifacts or any entity's effect/attack.*/
    private effectLogics: Map<string, EffectLogic> = new Map()
    private gameManager: GameManager

    constructor(gameManager: GameManager){
        this.gameManager = gameManager
        this.initEffectLogics()
    }

    /** Sets gameManager make sure to call this method inside the GameManager */
    public setGameManager(gameManager: GameManager){
        this.gameManager = gameManager
    }

    /** Initialize all EffectLogics that will be used in the game here. */
    private initEffectLogics(){
        this.addEffectLogic(new BowLogic())
        this.addEffectLogic(new DoubowLogic())
        this.addEffectLogic(new TribowLogic())
        this.addEffectLogic(new HermesBoots())
        this.addEffectLogic(new FrostGlaive())
        this.addEffectLogic(new FrostGlaiveFrenzy())
        this.addEffectLogic(new DemoLogic())
        this.addEffectLogic(new DemoLogicSkill())
        this.addEffectLogic(new HomingMissile1())
        this.addEffectLogic(new HomingMissile2())

        this.addEffectLogic(new RangerAbilityLogic())
    }

    private addEffectLogic(effectLogic: EffectLogic){
        this.effectLogics.set(effectLogic.effectLogicId, effectLogic)
    }

    /**
     * Uses effect corresponding to effectLogicId.
     * @param effectLogicId id of effectLogic to use
     * @param entity origin entity using the effectLogic
     * @param args any other arguments that may be needed such as mouse data
     * @returns true if the effect is used else false
     */
    public useEffect(effectLogicId: string, entity: Entity, ...args: any): boolean{
        let effectLogic = this.effectLogics.get(effectLogicId)
        
        // Effect does not exist return
        if(!effectLogic) return false

        // Effect does exist so try to use it
        try{
            effectLogic.useEffect(entity, this.gameManager, ...args)
            return true
        }catch(e: any){
            console.log(e.message)
            return false
        }
    }
}   