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

export default class EffectLogicManager{

    /** effectLogic replaces the old weaponLogic. It holds a logic that could be used as a weapon or artifacts or any entity's effect/attack.*/
    private effectLogics: Map<string, IEffectLogicClass> = new Map()
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
    }

    private addEffectLogic(effectLogic: IEffectLogicClass){
        let effectLogicId = new effectLogic().effectLogicId
        this.effectLogics.set(effectLogicId, effectLogic)
    }

    /**
     * Returns the constructor of the Effect Logic associated with effectLogicId
     * @param effectLogicId 
     * @returns 
     */
    public getEffectLogicConstructor(effectLogicId: string): IEffectLogicClass | undefined{
        return this.effectLogics.get(effectLogicId)
    }
}