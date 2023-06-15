import GameManager from "../../../system/GameManager";
import EffectManager from "../../../system/StateManagers/EffectManager";
import State from "../../State";
import Entity from "../../gameobjs/Entity";
import UpgradeEffect from "../../gameobjs/UpgradeEffect";
import EffectFactory from "../EffectFactory";
import ContinuousUpgradeEffect from "../continuous/ContinuousUpgradeEffect";
import UpgradeTriggerEffect from "../trigger/TriggerUpgradeEffect";


describe('Upgrade Effect Tests', () => {
    let gameManager: GameManager
    let entity: Entity

    beforeEach(async ()=>{
        // gameManager = new GameManager(new State())
        // await gameManager.preload()

        entity = new Entity()
    })
    test("EffectManager properly identifies creating UpgradeTriggerEffect or ContinuousUpgradeEffect properly based on an UpgradeEffect",()=>{
        // Effect (val) that should be created based on types(key)
        let types = {
            "player attack": UpgradeTriggerEffect,
            "none": ContinuousUpgradeEffect
        }

        // Check that EffectManager properly creates the right instance of effect based on the type
        Object.entries(types).forEach(([key, val])=>{
            let type = key
            let upgradeEffect = new UpgradeEffect(type)
            let effect = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect)        
            
            // check effect is correct instance
            expect(effect instanceof val).toBe(true)
        })
    })
    test("EffectManager can trigger, add, and update a UpgradeTriggerEffect on an Entity",()=>{
        let triggerType = "player attack"
        let effectLogicId = "" // EffectLogicId that maps to an undefined EffectLogic
        let upgradeEffect = new UpgradeEffect(triggerType, effectLogicId)
        let effect = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect) as UpgradeTriggerEffect
        expect(effect instanceof UpgradeTriggerEffect).toBe(true)

        // Check effect is properly added
        EffectManager.addUpgradeEffectsTo(entity, effect)
        expect(entity.effects.length).toBe(1)
        expect(entity.effects[0]).toBe(effect)

        // Check the Effect's cooldown is finished at the start
        expect(effect.cooldown.isFinished).toBe(true)
        
        // Trigger the Effect and check that the effect is on cooldown
        EffectManager.useTriggerEffectsOn(entity, triggerType)
        expect(effect.cooldown.isFinished).toBe(false)

        // Update the Effect and check cooldown is up again
        EffectManager.updateEffectsOn(entity, 1000)
        expect(effect.cooldown.isFinished).toBe(true)
    })
    test("EffectManager can properly add and update a ContinuousUpgradeEffect on an Entity", ()=>{
        let triggerType = "none"
        let effectLogicId = "" // EffectLogicId that maps to an undefined EffectLogic
        let upgradeEffect = new UpgradeEffect(triggerType, effectLogicId)
        let effect = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect) as ContinuousUpgradeEffect
        expect(effect instanceof ContinuousUpgradeEffect).toBe(true)

        // Check effect is properly added
        EffectManager.addUpgradeEffectsTo(entity, effect)
        expect(entity.effects.length).toBe(1)
        expect(entity.effects[0]).toBe(effect)
    })
    test("EffectManager can properly add, trigger, and update multiple ContinuousUpgradeEffects/UpgradeTriggerEffects", ()=>{
        // Create a ContinuousUpgradeEffect
        let triggerType = "none"
        let effectLogicId = "" // EffectLogicId that maps to an undefined EffectLogic
        let upgradeEffect = new UpgradeEffect(triggerType, effectLogicId)
        let effect = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect) as ContinuousUpgradeEffect
        expect(effect instanceof ContinuousUpgradeEffect).toBe(true)

        // Create a UpgradeTriggerEffect
        triggerType = "player attack"
        upgradeEffect = new UpgradeEffect(triggerType, effectLogicId)
        let effect2 = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect) as UpgradeTriggerEffect
        expect(effect2 instanceof UpgradeTriggerEffect).toBe(true)

        // Create a 2nd UpgradeTriggerEffect of the same type
        upgradeEffect = new UpgradeEffect(triggerType, effectLogicId)
        let effect3 = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect) as UpgradeTriggerEffect
        expect(effect3 instanceof UpgradeTriggerEffect).toBe(true)

        // Create a 3rd UpgradeTriggerEffect of a different type
        triggerType = "player skill"
        upgradeEffect = new UpgradeEffect(triggerType, effectLogicId)
        let effect4 = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect) as UpgradeTriggerEffect
        expect(effect4 instanceof UpgradeTriggerEffect).toBe(true)

        let effects = [effect, effect2, effect3, effect4]

        // Check effects are properly added
        EffectManager.addUpgradeEffectsTo(entity, effects)
        expect(entity.effects.length).toBe(4)

        // For each effect we added to entity, make sure that we can find the effect on entity.effects
        effects.forEach(effect=>
                expect(entity.effects.find(effectOnPlayer=>effect===effectOnPlayer)).not.toBe(undefined))
            
        // Check that all 3 UgpradeTriggerEffects cooldown are up
        expect(effect2.cooldown.isFinished).toBe(true)
        expect(effect3.cooldown.isFinished).toBe(true)
        expect(effect4.cooldown.isFinished).toBe(true)

        // Trigger the UpgradeTriggerEffects with type == "player attack" so now they are on cooldown
        EffectManager.useTriggerEffectsOn(entity, "player attack")
        expect(effect2.cooldown.isFinished).toBe(false)
        expect(effect3.cooldown.isFinished).toBe(false)

        // Check that the UpgradeTriggerEffect with a different type == "none" is not on cooldown
        expect(effect4.cooldown.isFinished).toBe(true)
    })
})

