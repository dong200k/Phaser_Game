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
import { Amplifier } from "./EffectLogics/artifact/Amplifier/Amplifier";
import { AmplifierBoost } from "./EffectLogics/artifact/Amplifier/AmplifierBoost";
import { PerseveranceStone } from "./EffectLogics/artifact/PerseveranceStone/PerseveranceStone";
import { PerseveranceBoost } from "./EffectLogics/artifact/PerseveranceStone/PerseveranceBoost";
import { PowerOfFriendship } from "./EffectLogics/artifact/PowerOfFriendship/PowerOfFriendship";
import { PowerOfFriendshipBoost } from "./EffectLogics/artifact/PowerOfFriendship/PowerOfFriendshipBoost";
import { Fireball } from "./EffectLogics/artifact/Fireball/Fireball";
import { LightningRod } from "./EffectLogics/artifact/LightningRod/LightningRod";
import { QiArmor } from "./EffectLogics/artifact/QiArmor/QiArmor";
import { FireballUpgrade } from "./EffectLogics/artifact/Fireball/FireballUpgrade";
import { Amount } from "./EffectLogics/artifact/Amount";
import { beets } from "./EffectLogics/artifact/Beets";
import { FrostWalker } from "./EffectLogics/artifact/FrostWalker/FrostWalker";
import { FrostWalkerUpgrade } from "./EffectLogics/artifact/FrostWalker/FrostWalkerUpgrade";
import { RuneGuard } from "./EffectLogics/artifact/RuneGuard/RuneGuard";
import { RuneGuardUpgrade } from "./EffectLogics/artifact/RuneGuard/RuneGuardUpgrade";
import { DashUpgrade, IDashUpgradeConfig } from "./EffectLogics/dash/DashUpgrade";
import LightningDash from "./EffectLogics/dash/special dashes/LightningDash";
import FlameDash from "./EffectLogics/dash/special dashes/FlameDash";
import FrostDash from "./EffectLogics/dash/special dashes/FrostDash";
import ShadowDash from "./EffectLogics/dash/special dashes/ShadowDash";
import PoisonDash from "./EffectLogics/dash/special dashes/PoisonDash";
import WaveDash from "./EffectLogics/dash/special dashes/WaveDash";
import SwordDash from "./EffectLogics/dash/special dashes/SwordDash";
import SomersaultDash from "./EffectLogics/dash/special dashes/SomersaultDash";
import { SpecialUpgrade } from "./EffectLogics/special/SpecialUpgrade";
import LightningGod from "./EffectLogics/special/specials/LightningGod";
import Kamehameha from "./EffectLogics/special/specials/Kamehameha";
import LightningBird from "./EffectLogics/special/specials/lightningbird/LightningBird";
import BladeTornado from "./EffectLogics/special/specials/BladeTorndao";
import Meteor from "./EffectLogics/special/specials/lightningbird copy/Meteor";
import LightningOrb from "./EffectLogics/special/specials/LightningOrb";
import UltimateFlameThrower from "./EffectLogics/special/specials/UltimateFlameThrower";
import BlackHoleGun from "./EffectLogics/weapons/BlackHoleGun";
import Dagger from "./EffectLogics/weapons/Dagger";
import FireballWand from "./EffectLogics/weapons/FireballWand";
import FlameThrower from "./EffectLogics/weapons/FlameThrower";
import Grenade from "./EffectLogics/weapons/Grenade";
import LightningSplitter from "./EffectLogics/weapons/LightningSplitter";
import MachineGun from "./EffectLogics/weapons/MachineGun";
import Pistol from "./EffectLogics/weapons/Pistol";
import Scythe from "./EffectLogics/weapons/Scythe";
import Sniper from "./EffectLogics/weapons/Sniper";
import GreatShuriken from "./EffectLogics/god/assassin/GreatShuriken";
import Shuriken from "./EffectLogics/god/assassin/Shuriken";
import ShurikenArrow from "./EffectLogics/god/assassin/ShurikenArrow";
import LightningBoltAttack from "./EffectLogics/god/lightning/LightningBoltAttack";
import LightningMovement from "./EffectLogics/god/lightning/LightningMovement";
import GiantFist from "./EffectLogics/god/giant/GiantFist";
import GiantHeartBeat from "./EffectLogics/god/giant/GiantHeartBeat";
import RockSmash from "./EffectLogics/god/giant/RockSmash";
import BloodBullet from "./EffectLogics/god/vampire/BloodBullet";
import BloodNova from "./EffectLogics/god/vampire/BloodNova";
import LifeDrain from "./EffectLogics/god/vampire/LifeDrain";
import UpgradeLogic from "./EffectLogics/god/UpgradeLogic";

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

        this.addEffectLogic(Amplifier)
        this.addEffectLogic(AmplifierBoost, {effectLogicId: "Amplifier-Boost-2", bonusIncrease: 0.02})
        this.addEffectLogic(AmplifierBoost, {effectLogicId: "Amplifier-Boost-3", bonusIncrease: 0.03})
        this.addEffectLogic(AmplifierBoost, {effectLogicId: "Amplifier-Boost-4", bonusIncrease: 0.04})
        this.addEffectLogic(AmplifierBoost, {effectLogicId: "Amplifier-Boost-6", bonusIncrease: 0.06})

        this.addEffectLogic(PerseveranceStone)
        this.addEffectLogic(PerseveranceBoost, {effectLogicId: "Perseverance-Boost-1", bonusIncrease: 10})
        this.addEffectLogic(PerseveranceBoost, {effectLogicId: "Perseverance-Boost-2", bonusIncrease: 15})
        this.addEffectLogic(PerseveranceBoost, {effectLogicId: "Perseverance-Boost-3", bonusIncrease: 20})
        this.addEffectLogic(PerseveranceBoost, {effectLogicId: "Perseverance-Boost-4", bonusIncrease: 30})

        this.addEffectLogic(PowerOfFriendship)
        this.addEffectLogic(PowerOfFriendshipBoost, {effectLogicId: "POF-1", bonusIncrease: 0.01, perPlayerBonusIncrease: 0.01})
        this.addEffectLogic(PowerOfFriendshipBoost, {effectLogicId: "POF-2", bonusIncrease: 0.02, perPlayerBonusIncrease: 0.02})
    
        this.addEffectLogic(Fireball)
        this.addEffectLogic(FireballUpgrade, {effectLogicId: "Fireball-upgrade-damage-10", damage: 0.1})
        this.addEffectLogic(FireballUpgrade, {effectLogicId: "Fireball-upgrade-damage-15", damage: 0.15})
        this.addEffectLogic(FireballUpgrade, {effectLogicId: "Fireball-upgrade-damage-25", damage: 0.25})
        this.addEffectLogic(FireballUpgrade, {effectLogicId: "Fireball-upgrade-explosion-50", area: 0.5})
        this.addEffectLogic(FireballUpgrade, {effectLogicId: "Fireball-upgrade-amount-1", amount: 1})

        this.addEffectLogic(LightningRod)
        this.addEffectLogic(LightningRod, {effectLogicId: "LightningRod-2", damageMult: 1.25})
        this.addEffectLogic(LightningRod, {effectLogicId: "LightningRod-3", damageMult: 1.25, lightningCount: 2})
        this.addEffectLogic(LightningRod, {effectLogicId: "LightningRod-4", damageMult: 1.75, lightningCount: 2})
        this.addEffectLogic(LightningRod, {effectLogicId: "LightningRod-5", damageMult: 1.75, lightningCount: 3})

        this.addEffectLogic(QiArmor)
        this.addEffectLogic(QiArmor, {effectLogicId: "QiArmor-2", knockbackMult: 1.5})
        this.addEffectLogic(QiArmor, {effectLogicId: "QiArmor-3", knockbackMult: 2})
        this.addEffectLogic(QiArmor, {effectLogicId: "QiArmor-4", knockbackMult: 2, radiusMult: 1.5})

        this.addEffectLogic(Amount)
        this.addEffectLogic(beets)

        this.addEffectLogic(FrostWalker)
        this.addEffectLogic(FrostWalkerUpgrade, {effectLogicId: "FrostWalker-Upgrade-Damage-10", damage: 0.10})
        this.addEffectLogic(FrostWalkerUpgrade, {effectLogicId: "FrostWalker-Upgrade-Damage-15", damage: 0.15})
        this.addEffectLogic(FrostWalkerUpgrade, {effectLogicId: "FrostWalker-Upgrade-Damage-25", damage: 0.25})
        this.addEffectLogic(FrostWalkerUpgrade, {effectLogicId: "FrostWalker-Upgrade-area-25", area: 0.25})
        this.addEffectLogic(FrostWalkerUpgrade, {effectLogicId: "FrostWalker-Upgrade-amount-1", amount: 1})
        this.addEffectLogic(FrostWalkerUpgrade, {effectLogicId: "FrostWalker-Upgrade-duration-25", duration: 0.25})
        this.addEffectLogic(FrostWalkerUpgrade, {effectLogicId: "FrostWalker-Upgrade-duration-50", duration: 0.5})

        this.addEffectLogic(RuneGuard)
        this.addEffectLogic(RuneGuardUpgrade, {effectLogicId: "RuneGuard-Upgrade-damage-10", damage: 0.1})
        this.addEffectLogic(RuneGuardUpgrade, {effectLogicId: "RuneGuard-Upgrade-damage-15", damage: 0.15})
        this.addEffectLogic(RuneGuardUpgrade, {effectLogicId: "RuneGuard-Upgrade-damage-25", damage: 0.25})
        this.addEffectLogic(RuneGuardUpgrade, {effectLogicId: "RuneGuard-Upgrade-amount-1", amount: 1})
        this.addEffectLogic(RuneGuardUpgrade, {effectLogicId: "RuneGuard-Upgrade-cooldown-5", cooldownReduction: 0.5})

        this.addEffectLogic(LightningDash)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "LightningDash-upgrade-damage-25", damage: 0.25, id: "LightningDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "LightningDash-upgrade-damage-50", damage: 0.5, id: "LightningDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "LightningDash-upgrade-amount-1", amount: 1, id: "LightningDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "LightningDash-upgrade-area-25", area: 0.25, id: "LightningDash"} as IDashUpgradeConfig)
        
        this.addEffectLogic(FlameDash)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "FlameDash-upgrade-damage-50", damage: 0.5, id: "FlameDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "FlameDash-upgrade-damage-100", damage: 1, id: "FlameDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "FlameDash-upgrade-area-25", area: 0.25, id: "FlameDash"} as IDashUpgradeConfig)
        
        this.addEffectLogic(FrostDash)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "FrostDash-upgrade-damage-25", damage: 0.25, id: "FrostDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "FrostDash-upgrade-duration-5", duration: 0.5, id: "FrostDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "FrostDash-upgrade-area-50", area: 0.5, id: "FrostDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "FrostDash-upgrade-amount-1", amount: 1, id: "FrostDash"} as IDashUpgradeConfig)
        
        this.addEffectLogic(ShadowDash)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "ShadowDash-upgrade-speed-30", damage: 0.3, id: "ShadowDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "ShadowDash-upgrade-speed-10", damage: 0.1, id: "ShadowDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "ShadowDash-upgrade-duration-25", duration: 0.25, id: "ShadowDash"} as IDashUpgradeConfig)
    
        this.addEffectLogic(PoisonDash)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "PoisonDash-upgrade-damage-50", damage: 0.5, id: "PoisonDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "PoisonDash-upgrade-duration-5", duration: 0.5, id: "PoisonDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "PoisonDash-upgrade-area-25", area: 0.25, id: "PoisonDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "PoisonDash-upgrade-amount-1", amount: 1, id: "PoisonDash"} as IDashUpgradeConfig)
        
        this.addEffectLogic(WaveDash)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "WaveDash-upgrade-damage-50", damage: 0.5, id: "WaveDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "WaveDash-upgrade-damage-100", damage: 1, id: "WaveDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "WaveDash-upgrade-area-25", area: 0.25, id: "WaveDash"} as IDashUpgradeConfig)

        this.addEffectLogic(SwordDash)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "SwordDash-upgrade-damage-25", damage: 0.25, id: "SwordDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "SwordDash-upgrade-damage-50", damage: 0.5, id: "SwordDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "SwordDash-upgrade-amount-1", amount: 1, id: "SwordDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "SwordDash-upgrade-area-25", area: 0.25, id: "SwordDash"} as IDashUpgradeConfig)

        this.addEffectLogic(SomersaultDash)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "SomersaultDash-upgrade-damage-50", damage: 0.5, id: "SomersaultDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "SomersaultDash-upgrade-damage-100", damage: 1, id: "SomersaultDash"} as IDashUpgradeConfig)
        this.addEffectLogic(DashUpgrade, {effectLogicId: "SomersaultDash-upgrade-area-25", area: 0.25, id: "SomersaultDash"} as IDashUpgradeConfig)
    
        this.addEffectLogic(BladeTornado)
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "BladeTornado-upgrade-damage-25", damage: 0.25, id: "BladeTornado"})
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "BladeTornado-upgrade-duration-50", duration: 0.5, id: "BladeTornado"})

        this.addEffectLogic(LightningGod)
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "LightningGod-upgrade-damage-25", damage: 0.25, id: "LightningGod"})
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "LightningGod-upgrade-duration-50", duration: 0.5, id: "LightningGod"})

        this.addEffectLogic(UltimateFlameThrower)
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "UltimateFlameThrower-upgrade-damage-25", damage: 0.25, id: "UltimateFlameThrower"})
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "UltimateFlameThrower-upgrade-duration-50", duration: 0.5, id: "UltimateFlameThrower"})

        this.addEffectLogic(LightningBird)
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "LightningBird-upgrade-damage-25", damage: 0.25, id: "LightningBird"})
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "LightningBird-upgrade-duration-50", duration: 0.5, id: "LightningBird"})    
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "LightningBird-upgrade-amount-1", amount: 1, id: "LightningBird"})
        
        this.addEffectLogic(Meteor)
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "Meteor-upgrade-damage-25", damage: 0.25, id: "Meteor"})
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "Meteor-upgrade-amount-3", amount: 3, id: "Meteor"})
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "Meteor-upgrade-amount-5", amount: 5, id: "Meteor"})

        this.addEffectLogic(LightningOrb)
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "LightningOrb-upgrade-damage-25", damage: 0.25, id: "LightningOrb"})
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "LightningOrb-upgrade-duration-50", duration: 0.5, id: "LightningOrb"})    
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "LightningOrb-upgrade-amount-1", amount: 1, id: "LightningOrb"})

        this.addEffectLogic(Kamehameha)
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "Kamehameha-upgrade-damage-25", damage: 0.25})
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "LightningOrb-upgrade-area-25", area: 0.25})    
        this.addEffectLogic(SpecialUpgrade, {effectLogicId: "LightningOrb-upgrade-area-100", area: 1})

        this.addEffectLogic(BlackHoleGun)
        this.addEffectLogic(Dagger)
        this.addEffectLogic(FireballWand)
        this.addEffectLogic(FlameThrower)
        this.addEffectLogic(Grenade)
        this.addEffectLogic(LightningSplitter)
        this.addEffectLogic(MachineGun)
        this.addEffectLogic(Pistol)
        this.addEffectLogic(Scythe)
        this.addEffectLogic(Sniper)

        // God upgrades
        this.addEffectLogic(GreatShuriken)
        this.addEffectLogic(UpgradeLogic, {effectLogicId: "GreatShurikenUpgrade", effectToUpgradeId: "GreatShuriken"})
        this.addEffectLogic(Shuriken)
        this.addEffectLogic(UpgradeLogic, {effectLogicId: "ShurikenUpgrade", effectToUpgradeId: "Shuriken"})
        this.addEffectLogic(ShurikenArrow)
        this.addEffectLogic(UpgradeLogic, {effectLogicId: "ShurikenArrowUpgrade", effectToUpgradeId: "ShurikenArrow"})
        this.addEffectLogic(LightningBoltAttack)
        this.addEffectLogic(UpgradeLogic, {effectLogicId: "LightningBoltAttackUpgrade", effectToUpgradeId: "LightningBoltAttack"})
        this.addEffectLogic(LightningMovement)
        this.addEffectLogic(UpgradeLogic, {effectLogicId: "LightningMovementUpgrade", effectToUpgradeId: "LightningMovement"})
        this.addEffectLogic(GiantFist)
        this.addEffectLogic(UpgradeLogic, {effectLogicId: "GiantFistUpgrade", effectToUpgradeId: "GiantFist"})
        this.addEffectLogic(GiantHeartBeat)
        this.addEffectLogic(UpgradeLogic, {effectLogicId: "GiantHeartBeatUpgrade", effectToUpgradeId: "GiantHeartBeat"})
        this.addEffectLogic(RockSmash)
        this.addEffectLogic(UpgradeLogic, {effectLogicId: "RockSmashUpgrade", effectToUpgradeId: "RockSmash"})
        this.addEffectLogic(BloodBullet)
        this.addEffectLogic(UpgradeLogic, {effectLogicId: "BloodBulletUpgrade", effectToUpgradeId: "BloodBullet"})
        this.addEffectLogic(BloodNova)
        this.addEffectLogic(UpgradeLogic, {effectLogicId: "BloodNovaUpgrade", effectToUpgradeId: "BloodNova"})
        this.addEffectLogic(LifeDrain)
        this.addEffectLogic(UpgradeLogic, {effectLogicId: "LifeDrainUpgrade", effectToUpgradeId: "LifeDrain"})
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