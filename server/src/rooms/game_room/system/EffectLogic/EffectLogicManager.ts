import Entity from "../../schemas/gameobjs/Entity";
import Player from "../../schemas/gameobjs/Player";
import GameManager from "../GameManager";
import EffectLogic, { IEffectLogicClass } from "./EffectLogic";
import RangerAbilityLogic from "./EffectLogics/abilities/RangerAbility/RangerAbility";
import { DemoLogic, DemoLogicSkill } from "./EffectLogics/artifact/DemoLogic";
import { FrostGlaive, FrostGlaiveFrenzy } from "./EffectLogics/artifact/FrostGlaiveLogic";
import { HermesBoots } from "./EffectLogics/artifact/HermesBootLogic";
import BowLogic from "./EffectLogics/weapon/RangerBow/MultiShot/BowLogic";
import DoubowLogic from "./EffectLogics/weapon/RangerBow/MultiShot/DoubowLogic";
import HomingMissile1 from "./EffectLogics/weapon/PriestTome/HomingMissile1";
import HomingMissile2 from "./EffectLogics/weapon/PriestTome/HomingMissile2";
import TribowLogic from "./EffectLogics/weapon/RangerBow/MultiShot/TribowLogic";
import Piercing1Logic from "./EffectLogics/common/Piercing1Logic";
import Piercing2Logic from "./EffectLogics/weapon/RangerBow/Piercing/Piercing2Logic";
import PentabowLogic from "./EffectLogics/weapon/RangerBow/MultiShot/PentabowLogic";
import SexagintibowLogic from "./EffectLogics/weapon/RangerBow/MultiShot/SexagintibowLogic";
import Piercing10Logic from "./EffectLogics/common/Piercing10Logic";
import ChargeAttackLogic1 from "./EffectLogics/weapon/RangerBow/ChargeShot/ChargeAttackLogic1";
import AddComboLogic from "./EffectLogics/weapon/BerserkerBlade/ComboUpgrades/AddComboLogic";
import BerserkerChargeAttackLogic from "./EffectLogics/weapon/BerserkerBlade/ChargeAttack/BerserkerChargeAttackLogic";
import BerserkerAbilityLogic from "./EffectLogics/abilities/BerserkerAbility/BerserkerAbility";
import AddChargeAttackLogic from "./EffectLogics/weapon/BerserkerBlade/ChargeAttack/AddChargeAttackLogic";
import DoubleFlameAuraLogic from "./EffectLogics/weapon/BerserkerBlade/SpecialUpgrades/DoubleFlameAuraLogic";
import FlameAuraChargeBoostLogic from "./EffectLogics/weapon/BerserkerBlade/SpecialUpgrades/FlameAuraChargeBoost";
import FlameAuraStatBoostLogic from "./EffectLogics/weapon/BerserkerBlade/SpecialUpgrades/FlameAuraStatBoostLogic";
import DoubleGetsugaLogic from "./EffectLogics/weapon/BerserkerBlade/ChargeAttack/DoubleGetsugaLogic";
import WarriorAbilityLogic from "./EffectLogics/abilities/WarriorAbility/WarriorAbility";
import WarriorShieldAttackLogic from "./EffectLogics/weapon/WarriorShield/WarriorShieldAttackLogic";
import WarriorShieldUpgradeAbilityLogic from "./EffectLogics/weapon/WarriorShield/WarriorShieldUpgradeAbilityLogic";
import WarriorKnockbackLogic from "./EffectLogics/weapon/WarriorShield/WarriorKnockbackLogic";
import WarriorProtectLogic from "./EffectLogics/weapon/WarriorShield/WarriorProtectLogic";
import { AncientGuard } from "./EffectLogics/artifact/AncientGuard";
import { TurboSkate } from "./EffectLogics/artifact/TurboSkate";
import { AncientBattery } from "./EffectLogics/artifact/AncientBattery";

export default class EffectLogicManager{

    /** effectLogic replaces the old weaponLogic. It holds a logic that could be used as a weapon or artifacts or any entity's effect/attack.*/
    private effectLogics: Map<string, {ctor: IEffectLogicClass, config: any}> = new Map()
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
        this.addEffectLogic(BowLogic)
        this.addEffectLogic(DoubowLogic)
        this.addEffectLogic(TribowLogic)
        this.addEffectLogic(PentabowLogic)
        this.addEffectLogic(SexagintibowLogic)

        this.addEffectLogic(HermesBoots)
        this.addEffectLogic(FrostGlaive)
        this.addEffectLogic(FrostGlaiveFrenzy)
        this.addEffectLogic(DemoLogic)
        this.addEffectLogic(DemoLogicSkill)
        this.addEffectLogic(HomingMissile1)
        this.addEffectLogic(HomingMissile2)

        this.addEffectLogic(RangerAbilityLogic)

        this.addEffectLogic(Piercing1Logic)
        this.addEffectLogic(Piercing2Logic)
        this.addEffectLogic(Piercing10Logic)

        this.addEffectLogic(ChargeAttackLogic1)

        this.addEffectLogic(AddComboLogic)
        this.addEffectLogic(BerserkerChargeAttackLogic)
        this.addEffectLogic(BerserkerAbilityLogic)
        this.addEffectLogic(AddChargeAttackLogic)
        this.addEffectLogic(DoubleFlameAuraLogic)
        this.addEffectLogic(FlameAuraChargeBoostLogic)
        this.addEffectLogic(FlameAuraStatBoostLogic)
        this.addEffectLogic(DoubleGetsugaLogic)

        this.addEffectLogic(WarriorAbilityLogic);
        this.addEffectLogic(WarriorShieldAttackLogic);
        this.addEffectLogic(WarriorShieldUpgradeAbilityLogic);
        this.addEffectLogic(WarriorKnockbackLogic);
        this.addEffectLogic(WarriorProtectLogic);

        this.addEffectLogic(AncientGuard)
        this.addEffectLogic(AncientGuard, {effectLogicId: "Ancient-Guard-5", shieldPercent: 15})
        this.addEffectLogic(AncientGuard, {effectLogicId: "Ancient-Guard-10", shieldPercent: 20})

        this.addEffectLogic(TurboSkate)
        this.addEffectLogic(TurboSkate, {effectLogicId: "Turbo-Skate-2", speedBoostPercent: 0.2, maxDistancePercent: 0})
        this.addEffectLogic(TurboSkate, {effectLogicId: "Turbo-Skate-3", speedBoostPercent: 0, maxDistancePercent: 0.3})
        this.addEffectLogic(TurboSkate, {effectLogicId: "Turbo-Skate-5", speedBoostPercent: 0, maxDistancePercent: 0.6})

        this.addEffectLogic(AncientBattery)
    }

    private addEffectLogic(effectLogic: IEffectLogicClass, config?: any){
        let effectLogicId = new effectLogic(config).effectLogicId
        this.effectLogics.set(effectLogicId, {ctor: effectLogic, config})
    }

    /**
     * Returns the constructor of the Effect Logic associated with effectLogicId
     * @param effectLogicId 
     * @returns 
     */
    public getEffectLogicCtorAndConfig(effectLogicId: string): {ctor: IEffectLogicClass, config: any} | undefined{
        return this.effectLogics.get(effectLogicId)
    }
}