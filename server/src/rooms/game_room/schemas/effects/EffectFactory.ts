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

}
