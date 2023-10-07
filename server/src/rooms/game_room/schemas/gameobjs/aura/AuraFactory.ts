import GameManager from "../../../system/GameManager";
import StatAuraController from "../../../system/StateControllers/AuraController/ContactAura/StatAuraController";
import Aura from "./Aura";


// credits goes to https://stackoverflow.com/a/50375286
// function intersection producec - functin overloads
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;

type Values<T> = T[keyof T]

/**
 * Generate all possible combinations of allowed arguments
 */
type AllOverloads<Mappings, Keys extends string> = {
    [Prop in Keys]:
    Prop extends keyof Mappings
    ? (gameManager: GameManager, key: Prop, data: Mappings[Prop]) => any
    : (gameManager: GameManager, key: Prop) => any
}

/**
 * Convert all allowed combinations to function overload
 */
type Overloading<Mappings, Keys extends string> =
    keyof Mappings extends Keys
    ? UnionToIntersection<Values<AllOverloads<Mappings, Keys>>>
    : never


// const myCoolGeneric: Overloading<DataParams, MyKeys> = (
//     key: string,
//     data?: unknown
// ) => null as any

// myCoolGeneric('lorem', { year: 2021 }); // ok
// myCoolGeneric('ipsum', { to: '2021' }); // typescript error
// myCoolGeneric('dolor'); // ok


type MyKeys = 'Default' | 'ArmorAura' | 'SpeedAura';

interface DataParams {
    /** ArmorAura */
    ArmorAura: { armor?: number, collisionTargets?: string[], radius?: number };
    SpeedAura: { speed?: number };
}


/** The aura factory can be used to create predefined auras. */
export default class AuraFactory {
    
   
    static createAura: Overloading<DataParams, MyKeys> = (
        gameManager: GameManager,
        auraName: string,
        data?: any
    ) => {
        switch(auraName) {
            case "ArmorAura": return AuraFactory.createArmorAura(gameManager, data?.armor ?? 0, data?.collisionTargets, data?.raduis);
            default: return AuraFactory.createArmorAura(gameManager, data?.armor ?? 0, data?.collisionTargets, data?.raduis);
        }
    }

    /**
     * Creates and returns an aura that increases the armor
     * of the entity that is inside it.
     * @param gameManager The gameManager.
     * @param armor The armor amount.
     * @param collisionTargets The an array of targets that this aura should affect. Default to ["PLAYER", "MONSTER"].
     * @param radius The radius of the aura. Defaults to 100.
     */
    public static createArmorAura(gameManager: GameManager, armor: number, collisionTargets = ["PLAYER", "MONSTER"], radius = 100) {
        // Create the aura
        let aura = new Aura(gameManager, {
            color: 0xe6c78e,
            name: "Armor Aura",
            radius: radius,
            timed: false,
            x: 0,
            y: 0,
            controller: "Stat"
        });

        // Initialize controller config
        if(aura.auraController instanceof StatAuraController) {
            aura.auraController.setStatConfig({armor: armor});
            aura.auraController.setCollisionTargets(collisionTargets);
        } else {
            throw new Error("Error when creating ArmorAura. The auraController is not StatAuraController");
        }

        // Set pool type
        aura.poolType = "ArmorAura";

        return aura;
    }

    // public static createAura(gameManager: GameManager, auraName: string, data:any): Aura {
    //     switch(auraName) {
    //         case "ArmorAura": return AuraFactory.createArmorAura(gameManager, data?.armor ?? 0, data?.collisionTargets, data?.raduis);
    //         default: return AuraFactory.createArmorAura(gameManager, data?.armor ?? 0, data?.collisionTargets, data?.raduis);
    //     }
    // }

    // /**
    //  * WE
    //  * @param name 
    //  */
    // static createAuraFromName(gameManager: GameManager, name: "Default", data: Values<DataParams>): Aura

    // /**
    //  * Who
    //  * @param name 
    //  */
    // static createAuraFromName(gameManager: GameManager, name: "ArmorAura", data: any): Aura

    // static createAuraFromName(gameManager: GameManager, name: string) {
    //     switch(auraName) {
    //         case "ArmorAura": return AuraFactory.createArmorAura(gameManager, data?.armor ?? 0, data?.collisionTargets, data?.raduis);
    //         default: return AuraFactory.createArmorAura(gameManager, data?.armor ?? 0, data?.collisionTargets, data?.raduis);
    //     }
    // }
}
