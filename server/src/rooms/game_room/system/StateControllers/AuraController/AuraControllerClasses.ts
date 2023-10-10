import AuraController from "./AuraController"
import StatAuraController from "./ContactAura/StatAuraController";

// Constructors for controllers (used for initializing aura controllers at the moment)
let ctors = {
    "Aura": AuraController,
    "Stat": StatAuraController,
}

export default ctors;

export type IAuraControllerClasses = keyof typeof ctors;