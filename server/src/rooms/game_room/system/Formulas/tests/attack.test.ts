import Stat from "../../../schemas/gameobjs/Stat"
import { ARMOR_PEN_CAP, getTrueAttackDamage } from "../formulas"

describe("Attack Formula Test", ()=>{

    let attackerStat: Stat
    let defenderStat: Stat

    beforeEach(()=>{
        attackerStat = Stat.getZeroStat()
        defenderStat = Stat.getZeroStat()
    })

    test("Critical and non-critical attacks properly affected by crit damage/rate",()=>{
        let attackMultiplier = 1
        attackerStat.critDamage = 1
        attackerStat.attack = 10

        // No crit chance
        attackerStat.critRate = 0
        let damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(10)

        // 100% crit chance
        attackerStat.critRate = 1
        damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(20) // damage doubles since critDamage is 1 (100%)

    })
    test("Defender Armor test", ()=>{
        let attackMultiplier = 1
        attackerStat.attack = 10

        // zero armor
        defenderStat.armor = 0
        let damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(10)

        // 10 armor
        defenderStat.armor = 10
        damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(0)

        // -10 armor
        defenderStat.armor = -10
        damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(20)

    })
    test("Attacker Attack penetration test", ()=>{
        function test(armorPen: number){
            let attackMultiplier = 1
            attackerStat.attack = 10
            attackerStat.armorPen = armorPen
    
            // zero armor
            defenderStat.armor = 0
            let damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
            expect(damage).toBe(10)
    
            // 10 armor
            defenderStat.armor = 10
            damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
            let expectedArmorAfterPenetration = 10 * (1 - Math.min(ARMOR_PEN_CAP, armorPen))
            let expectedDamage = 10 - expectedArmorAfterPenetration
            expect(damage).toBe(expectedDamage)
    
            // -10 armor so armor pen is not applied
            defenderStat.armor = -10
            damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
            expect(damage).toBe(20)
        }
        
        test(0) // 0% armor pen
        test(0.3) // 30% armor pen which is the ARMOR_PEN_CAP
        test(0.5) // 50% armor pen which is > ARMOR_PEN_CAP
    })
    test("Attack Multiplier Test", ()=>{
        function test(attackMultiplier: number){
            attackerStat.attack = 10
    
            // zero armor
            defenderStat.armor = 0
            let damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
            let expectedDamage = 10 * attackMultiplier
            if(expectedDamage < 0) expectedDamage = 0
            expect(damage).toBe(expectedDamage)
    
            // 10 armor
            defenderStat.armor = 10
            damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
            expectedDamage = 10 * attackMultiplier - defenderStat.armor
            if(expectedDamage < 0) expectedDamage = 0
            expect(damage).toBe(expectedDamage)
    
            // -10 armor so armor pen is not applied
            defenderStat.armor = -10
            damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
            expectedDamage = 10 * attackMultiplier - defenderStat.armor
            if(expectedDamage < 0) expectedDamage = 0
            expect(damage).toBe(expectedDamage)
        }
        
        test(0) // 0% attack multiplier
        test(0.5) // 50% attack multiplier
        test(1) // 100%
        test(10) // 1000%
    })
    test("Attacker with zero attack stats", ()=>{
        // zero armor
        let attackMultiplier = 1
        defenderStat.armor = 0
        let damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(0)

        // 10 armor
        defenderStat.armor = 10
        damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(0)

        // -10 armor so armor pen is not applied
        defenderStat.armor = -10
        damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(10)
    })
    test("Attacker with non zero attack stats", ()=>{
        attackerStat.attack = 10
        attackerStat.armorPen = 0.3
        attackerStat.critRate = 1
        attackerStat.critDamage = 1
        attackerStat.damagePercent = 1
        attackerStat.attackPercent = 1

        // zero armor
        let attackMultiplier = 1
        defenderStat.armor = 0
        let damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(60)

        // 10 armor
        defenderStat.armor = 10
        damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(53)

        // -10 armor so armor pen is not applied
        defenderStat.armor = -10
        damage = getTrueAttackDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(70)
    })
})