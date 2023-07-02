import Stat from "../../../schemas/gameobjs/Stat"
import { getTrueAttackDamage } from "../formulas"

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

    })
    test("Attacker Attack penetration test", ()=>{
        
    })
    test("Attack Multiplier Test", ()=>{

    })
    test("Attacker with zero attack stats", ()=>{

    })
    test("Attacker with non zero attack stats", ()=>{

    })
})