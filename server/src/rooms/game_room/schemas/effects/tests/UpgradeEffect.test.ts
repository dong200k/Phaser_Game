import GameManager from "../../../system/GameManager";
import EffectManager from "../../../system/StateManagers/EffectManager";
import WeaponUpgradeTree from "../../Trees/WeaponUpgradeTree";
import Entity from "../../gameobjs/Entity";
import Player from "../../gameobjs/Player";
import UpgradeEffect from "../../gameobjs/UpgradeEffect";
import Effect from "../Effect";
import EffectFactory from "../EffectFactory";
import ContinuousUpgradeEffect from "../continuous/ContinuousUpgradeEffect";
import TriggerUpgradeEffect from "../trigger/TriggerUpgradeEffect";


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
            "player attack": TriggerUpgradeEffect,
            "player skill": TriggerUpgradeEffect,
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
        let effect = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect) as TriggerUpgradeEffect
        expect(effect instanceof TriggerUpgradeEffect).toBe(true)

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
        let effect2 = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect) as TriggerUpgradeEffect
        expect(effect2 instanceof TriggerUpgradeEffect).toBe(true)

        // Create a 2nd UpgradeTriggerEffect of the same type
        upgradeEffect = new UpgradeEffect(triggerType, effectLogicId)
        let effect3 = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect) as TriggerUpgradeEffect
        expect(effect3 instanceof TriggerUpgradeEffect).toBe(true)

        // Create a 3rd UpgradeTriggerEffect of a different type
        triggerType = "player skill"
        upgradeEffect = new UpgradeEffect(triggerType, effectLogicId)
        let effect4 = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect) as TriggerUpgradeEffect
        expect(effect4 instanceof TriggerUpgradeEffect).toBe(true)

        let effects = [effect, effect2, effect3, effect4]

        // Check effects are properly added
        EffectManager.addUpgradeEffectsTo(entity, effects)
        expect(entity.effects.length).toBe(4)

        // For each effect we added to entity, make sure that we can find the effect on entity.effects
        effects.forEach(effect=>
                expect(entity.effects.find(effectOnPlayer=>effect===effectOnPlayer)).not.toBe(undefined))
            
        // Check that all 3 UgpradeTriggerEffects and the ContinuousUpgradeEffect cooldown are up
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
    test("Effect Collision Test", ()=>{
        let tree1 = new WeaponUpgradeTree(new Player("p1"))
        let tree2 = new WeaponUpgradeTree(new Player("p2"))

        /** list of a few rules/expected collision results */
        let collisionRules = [
            {   // collisionGroups both = -1, both doesStack = true and collisionGroup = -1 so definitely no collision
                collides: false,
                effect1Rules: {collisionGroup: -1, doesStack: true, tree: tree1},
                effect2Rules: {collisionGroup: -1, doesStack: true, tree: tree2}
            },
            {   // collisionGroup different and 1 is -1 so no collision
                collides: false,
                effect1Rules: {collisionGroup: -1, doesStack: true, tree: tree1},
                effect2Rules: {collisionGroup: 2, doesStack: false, tree: tree1}
            },
            {   // collisionGroup different so no collision
                collides: false,
                effect1Rules: {collisionGroup: 3, doesStack: true, tree: tree1},
                effect2Rules: {collisionGroup: 2, doesStack: false, tree: tree1}
            },
            {   // different tree no collision
                collides: false,
                effect1Rules: {collisionGroup: 2, doesStack: true, tree: tree1},
                effect2Rules: {collisionGroup: 2, doesStack: false, tree: tree2}
            },
            {   // does stack both true so no collision
                collides: false,
                effect1Rules: {collisionGroup: 2, doesStack: true, tree: tree1},
                effect2Rules: {collisionGroup: 2, doesStack: true, tree: tree1}
            },
            {   // collision because same non -1 collisionGroup, one doesn't stack and tree is the same
                collides: true,
                effect1Rules: {collisionGroup: 2, doesStack: true, tree: tree1},
                effect2Rules: {collisionGroup: 2, doesStack: false, tree: tree1}
            },
        ]

        // For each rule make sure that entity has correct effects based on collides
        collisionRules.forEach(collisionRule=>{
            let {collides, effect1Rules: e1, effect2Rules: e2} = collisionRule

            // Create effect1, a ContinuousUpgradeEffect
            let upgradeEffect1 = new UpgradeEffect("none","", 1000, e1.doesStack, e1.collisionGroup)
            let effect1 = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect1) as ContinuousUpgradeEffect
            effect1.setTree(e1.tree)

            // Create effect2, a TriggerUpgradeEffect
            let upgradeEffect2 = new UpgradeEffect("player attack","", 1000, e2.doesStack, e2.collisionGroup)
            let effect2 = EffectFactory.createEffectFromUpgradeEffect(upgradeEffect2) as TriggerUpgradeEffect
            effect2.setTree(e2.tree)

            // Clear effects on entity
            while(entity.effects.length!==0) entity.effects.pop()

            EffectManager.addUpgradeEffectsTo(entity, [effect1, effect2])

            if(collides){
                // check only effect2 remains
                expect(entity.effects.length).toBe(1)
                expect(entity.effects[0]).toBe(effect2)
            }else{
                // check both effects are there
                expect(entity.effects.length).toBe(2)
                expect(entity.effects).toContain(effect1)
                expect(entity.effects).toContain(effect2)
            }
        })
    })
})

