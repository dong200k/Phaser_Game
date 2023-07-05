import Stat from "../../../schemas/gameobjs/Stat"
import { ARMOR_PEN_CAP, MAGIC_PEN_CAP, getTrueMagicDamage } from "../formulas"

describe("Magic Attack Formula Test", ()=>{

    let attackerStat: Stat
    let defenderStat: Stat

    beforeEach(()=>{
        attackerStat = Stat.getZeroStat()
        defenderStat = Stat.getZeroStat()
    })

    test("Defender Magic Resist test", ()=>{
        let attackMultiplier = 1
        attackerStat.magicAttack = 10

        // zero magic res
        defenderStat.magicResist = 0
        let damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(10)

        // 10 magic res
        defenderStat.magicResist = 10
        damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(0)

        // -10 magic res
        defenderStat.magicResist = -10
        damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(20)

    })
    test("Attacker Magic penetration test", ()=>{
        function test(magicPen: number){
            let attackMultiplier = 1
            attackerStat.magicAttack = 10
            attackerStat.magicPen = magicPen
    
            // zero mr
            defenderStat.magicResist = 0
            let damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
            expect(damage).toBe(10)
    
            // 10 mr
            defenderStat.magicResist = 10
            damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
            let expectedMagicResAfterPenetration = 10 * (1 - Math.min(MAGIC_PEN_CAP, magicPen))
            let expectedDamage = 10 - expectedMagicResAfterPenetration
            expect(damage).toBe(expectedDamage)
    
            // -10 mr so mr pen is not applied
            defenderStat.magicResist = -10
            damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
            expect(damage).toBe(20)
        }
        
        test(0) // 0% mr pen
        test(0.3) // 30% mr pen which is the MAGIC_PEN_CAP
        test(0.5) // 50% mr pen which is > MAGIC_PEN_CAP
    })
    test("Magic Attack Multiplier Test", ()=>{
        function test(attackMultiplier: number){
            attackerStat.magicAttack = 10
    
            // zero mr
            defenderStat.magicResist = 0
            let damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
            let expectedDamage = 10 * attackMultiplier
            if(expectedDamage < 0) expectedDamage = 0
            expect(damage).toBe(expectedDamage)
    
            // 10 mr
            defenderStat.magicResist = 10
            damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
            expectedDamage = 10 * attackMultiplier - defenderStat.magicResist
            if(expectedDamage < 0) expectedDamage = 0
            expect(damage).toBe(expectedDamage)
    
            // -10 mr so mr pen is not applied
            defenderStat.magicResist = -10
            damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
            expectedDamage = 10 * attackMultiplier - defenderStat.magicResist
            if(expectedDamage < 0) expectedDamage = 0
            expect(damage).toBe(expectedDamage)
        }
        
        test(0) // 0% attack multiplier
        test(0.5) // 50% attack multiplier
        test(1) // 100%
        test(10) // 1000%
    })
    test("Attacker with zero magic attack stats", ()=>{
        // zero mr
        let attackMultiplier = 1
        defenderStat.magicResist = 0
        let damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(0)

        // 10 mr
        defenderStat.magicResist = 10
        damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(0)

        // -10 mr so mr pen is not applied
        defenderStat.magicResist = -10
        damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(10)
    })
    test("Attacker with non zero magic attack stats", ()=>{
        attackerStat.magicAttack = 10
        attackerStat.magicPen = 0.3
        attackerStat.damagePercent = 1
        attackerStat.magicAttackPercent = 1

        // zero mr
        let attackMultiplier = 1
        defenderStat.magicResist = 0
        let damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(30)

        // 10 mr
        defenderStat.magicResist = 10
        damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(23)

        // -10 mr so mr pen is not applied
        defenderStat.magicResist = -10
        damage = getTrueMagicDamage(attackerStat, defenderStat, attackMultiplier)
        expect(damage).toBe(40)
    })
})