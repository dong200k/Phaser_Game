import Effect from "./Effect";
import ChainEffect from "./combo/ChainEffect";
import ContinuousHPEffect from "./continuous/ContinuousHPEffect";
import InstantHPEffect from "./onetime/InstantHPEffect";


export default class EffectFactory {

    /**
     * Creates an effect that will provide a one time healing effect.
     * @param healAmount The amount of hp to heal.
     * @returns An InstantHPEffect.
     */
    public static createHealEffect(healAmount: number): InstantHPEffect {
        return new InstantHPEffect(healAmount);
    }

    /**
     * Creates an effect that will provide a one time damage effect.
     * @param damageAmount The amount of hp to damage.
     * @returns An InstantHPEffect.
     */
    public static createDamageEffect(damageAmount: number): InstantHPEffect {
        return new InstantHPEffect(-damageAmount);
    }

    /**
     * Creates an effect that will heal the entity over time. Note: Make sure the totalTime is more than and a multiple of tickRate.
     * @param totalRegenAmount The total amount of hp that will be regenerated.
     * @param totalTimeToRegen The total time in seconds that it will take to regen this amount of hp.
     * @param tickRate How often the regen is applied in seconds. Changing this wont change the total amount regenerated in the end. Defaults to one second.
     */
    public static createRegenEffect(totalRegenAmount: number, totalTimeToRegen: number, tickRate:number = 1) {
        return new ContinuousHPEffect(totalTimeToRegen, totalRegenAmount / (totalTimeToRegen / tickRate), tickRate);
    }

    /**
     * Creates an effect that will apply DOT(damage over time) to the entity. Note: Make sure the totalTime is more than and a multiple of tickRate.
     * @param totalDamageAmount The total amount of damage taken.
     * @param totalTime The total time in seconds that it will take to deal the damage.
     * @param tickRate How often the DOT is applied in seconds. Changing this wont change the total damage in the end. Defaults to one second.
     */
    public static createDamageOverTimeEffect(totalDamageAmount: number, totalTime:number, tickRate:number = 1) {
        return new ContinuousHPEffect(totalTime, -(totalDamageAmount / (totalTime / tickRate)), tickRate);
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
