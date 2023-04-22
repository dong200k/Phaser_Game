import Effect from "./Effect";
import ChainEffect from "./combo/ChainEffect";
import ContinuousHPEffect from "./continuous/ContinuousHPEffect";
import ContinuousHPEffectUntimed from "./continuous/ContinuousHPEffectUntimed";
import InstantHPEffect from "./onetime/InstantHPEffect";


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
     * @returns An InstantHPEffect.
     */
    public static createDamageEffect(damageAmount: number): InstantHPEffect {
        if(damageAmount < 0) damageAmount = 0;
        return new InstantHPEffect(-damageAmount);
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

}
