import Effect from "./Effect";
import ChainEffect from "./combo/ChainEffect";
import ContinuousHPEffect from "./continuous/ContinuousHPEffect";
import ContinuousHPEffectUntimed from "./continuous/ContinuousHPEffectUntimed";
import InstantHPEffect from "./onetime/InstantHPEffect";
import SpeedMultiEffect from "./temp/SpeedMultiEffect";
import StatEffect, { StatConfig } from "./temp/StatEffect";
import CompoundEffect from "./combo/CompoundEffect";
import TriggerUpgradeEffect from "./trigger/TriggerUpgradeEffect";
import UpgradeEffect from "../gameobjs/UpgradeEffect";
import ContinuousUpgradeEffect from "./continuous/ContinuousUpgradeEffect";
import CollisionImmuneEffect from "./temp/CollisionImmuneEffect";
import Entity from "../gameobjs/Entity";
import PiercingEffect from "./temp/PiercingEffect";
import OneTimeUpgradeEffect from "./onetime/OneTimeUpgradeEffect";
import WeaponUpgradeTree from "../Trees/WeaponUpgradeTree";


export default class EffectFactory {

    /**
     * Creates an effect that will provide a one time healing effect.
     * @param healAmount The amount of hp to heal (non negative).
     * @returns An InstantHPEffect.
     */
    public static createHealEffect(healAmount: number): InstantHPEffect {
        if(healAmount < 0) healAmount = 0;
        return new InstantHPEffect(healAmount);
    }

    /**
     * Creates an effect that will provide a one time damage effect.
     * @param damageAmount The amount of hp to damage (non negative).
     * @param originEntityId The id of the entity that created this damage/ did the damage.
     * @returns An InstantHPEffect.
     */
    public static createDamageEffect(damageAmount: number, originEntityId?: string): InstantHPEffect {
        if(damageAmount < 0) damageAmount = 0;
        return new InstantHPEffect(-damageAmount, originEntityId);
    }

    /**
     * Creates an effect that will heal the entity over time. Note: Make sure the totalTime is more than and a multiple of tickRate.
     * @param totalRegenAmount The total amount of hp that will be regenerated. (non negative)
     * @param totalTimeToRegen The total time in seconds that it will take to regen this amount of hp. Must be an positive integer (decimals will be rounded).
     * @param tickCount The amount of times this effect will tick. Must be an positve integer (decimals will be rounded).
     */
    public static createRegenEffect(totalRegenAmount: number, totalTimeToRegen: number, tickCount:number) {
        return new ContinuousHPEffect(totalTimeToRegen, tickCount, totalRegenAmount);
    }

    /**
     * Creates an effect that will heal the entity over time. This effect will only stop when setAsCompleted() is called on the effect.
     * @param tickRate The time in seconds it will take to apply the effect once. This number must be at least 0.05. 
     * @param regenPerTick The hp regen that will be applied to an entity per tick.
     */
    public static createRegenEffectUntimed(tickRate:number, regenPerTick:number) {
        return new ContinuousHPEffectUntimed(tickRate, regenPerTick);
    }

    /**
     * Creates an effect that will apply DOT(damage over time) to the entity. Note: Make sure the totalTime is more than and a multiple of tickRate.
     * @param totalDamageAmount The total amount of damage taken.
     * @param totalTime The total time in seconds that it will take to deal the damage. Must be an positive integer (decimals will be rounded).
     * @param tickCount The amount of times this effect will tick. Must be an positve integer (decimals will be rounded).
     */
    public static createDamageOverTimeEffect(totalDamageAmount: number, totalTime:number, tickCount:number) {
        return new ContinuousHPEffect(totalTime, tickCount, -totalDamageAmount);
    }

    /**
     * Creates an effect that will heal the entity over time. This effect will only stop when setAsCompleted() is called on the effect.
     * @param tickRate The time in seconds it will take to apply the effect once. This number must be at least 0.05. 
     * @param damagePerTick The damage will be applied to an entity per tick.
     */
    public static createDamageOverTimeEffectUntimed(tickRate:number, damagePerTick:number) {
        return new ContinuousHPEffectUntimed(tickRate, -damagePerTick);
    }

    /**
     * Creates a chain effect that runs effects sequentially.
     * @param effect and effect or an array of effect to run sequentually.
     * @returns A ChainEffect.
     */
    public static createChainEffect(effect?: Effect | Effect[]) {
        return new ChainEffect(effect);
    }

    /**
     * Creates a speed multiplier effect that will change the player's speed by a multiplier.
     * @param speedMultiplier The multiplier.
     * @param activeTime The time the effect will last for.
     * @returns A SpeedMultiEffect
     */
    public static createSpeedMultiplierEffectTimed(speedMultiplier: number, activeTime: number) {
        return new SpeedMultiEffect(speedMultiplier, true, activeTime);
    }

    /**
     * Creates a effect to make entity immune to all collisions for a certain duration.
     * @param activeTime The time the effect will last for.
     * @returns A CollisionImmuneEffect
     */
    public static createCollisionImmuneEffectTimed(activeTime: number) {
        return new CollisionImmuneEffect(true, activeTime);
    }

    /**
     * Creates a speed multiplier effect that will change the player's speed by a multiplier.
     * This is untimed so the effect will have to be stopped manually by calling setAsCompleted().
     * @param speedMultiplier The multiplier.
     * @returns A SpeedMultiEffect.
     */
    public static createSpeedMultiplierEffectUntimed(speedMultiplier: number) {
        return new SpeedMultiEffect(speedMultiplier, false);
    }

    /**
     * Creates a stats effect that will apply flat value changes to an entity's stat object.
     * @param statConfig The stat to change. The values provided will be added to an entity's stat.
     * @returns A StatEffect.
     */
    public static createStatEffect(statConfig?: StatConfig) {
        return new StatEffect(statConfig);
    }

    /**
     * Creates a CompoundEffects that are used to group effects in a map with a string key.
     * @param name The name of the CompoundEffect.
     * @returns A CompoundEffect.
     */
    public static createCompoundEffect(name: string) {
        return new CompoundEffect(name);
    }

    /**
     * Creates a new UpgradeTriggerEffect or ContinuousUpgradeEffect from an UpgradeEffect
     * @param effectLogicId effect's logic to use, must be initialized in EffectLogicManager
     * @param ms cooldown in miliseconds
     * @param doesStack if two UpgradeEffects on one upgrade tree have the same collisionGroup and either one has doesStack === false, old one gets overwritten. Unless collisionGroup === -1 in that case no collision.
     * @param collisionGroup number that represents collision group, not the same collision logic as CollisionManager read does stack param for how it works.
     * @param type string that represents the type of the TriggerEffect. 
     * @returns 
     */
    static createEffectFromUpgradeEffect(upgradeEffect: UpgradeEffect){
        let effectLogicId = upgradeEffect.effectLogicId
        let cooldown = upgradeEffect.cooldown
        let type = upgradeEffect.type
        let doesStack = upgradeEffect.doesStack
        let collisionGroup = upgradeEffect.collisionGroup

        // console.log(type)

        // Creates appropriate effect based on type. To add types change logic here and also add a type to my-app/src/effectTypes.js
        switch(upgradeEffect.type){
            case "player attack":
            case "player charge attack":
                // Cooldown of charge attack and attack is 1000 ms. It is affected by attackSpeed etc. inside TriggerUpgradeEffect's update method
                return new TriggerUpgradeEffect(effectLogicId, 1000, type, doesStack, collisionGroup)
            case "player skill":
                // Creates a UpgradeTriggerEffect which uses the effect when the EffectManager.useOnTriggerEffectsOn is called with the corresponding type, "player skill" in this case
                return new TriggerUpgradeEffect(effectLogicId, cooldown, type, doesStack, collisionGroup)
            case "one time":
                // Creates a onetime upgrade effect that is used once
                return new OneTimeUpgradeEffect(effectLogicId, doesStack, collisionGroup)
            case "none":
                // Creates a ContinuousUpgradeEffect which uses the effect's logic automatically
                return new ContinuousUpgradeEffect(effectLogicId, cooldown, type, doesStack, collisionGroup)
            default:
                return new ContinuousUpgradeEffect(effectLogicId, cooldown, type, doesStack, collisionGroup)
        }
    }

    /**
     * Effect that modifies piercing of a player's artifact/weapon tree.
     * @param piercing number that represents how many targets the weapon can hit/pierce before despawning.
     * @param activeTime time the effect will last for.
     * @param isTimed boolean to determine whether to used active time or not
     */
    public static createPiercingEffect(piercing: number, tree: WeaponUpgradeTree, isTimed?: boolean, activeTime: number = 0){
        return new PiercingEffect(tree, isTimed, activeTime, piercing)
    }
}
