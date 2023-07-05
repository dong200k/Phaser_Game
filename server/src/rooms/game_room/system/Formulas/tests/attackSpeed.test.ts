import Stat from "../../../schemas/gameobjs/Stat"
import { getFinalAttackCooldown } from "../formulas"

describe("Attack Speed Formula Test", ()=>{
    let stat: Stat
    let base_cooldown = 1000

    beforeEach(()=>{
        stat = Stat.getZeroStat()
    })

    test("attackSpeed test", ()=>{
        // zero atk spd cooldown remains the same
        let cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown)

        // 1 atk spd, cooldown remains the asme
        stat.attackSpeed = 1
        cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown)

        // 5 atk spd, 5 times faster cooldown
        stat.attackSpeed = 5
        cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown/5)

        // negative atk spd so cooldown remains the same
        stat.attackSpeed = -1
        cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown)

    })
    test("attackSpeedPercent Test", ()=>{
        stat.attackSpeed = 1

        // zero atk spd percent cooldown remains the same
        let cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown)

        // 1 atk spd percent, cooldown halves
        stat.attackSpeedPercent = 1
        cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown/2)

        // 5 atk spd percent, cooldown becomes 1/5th which is the cap if cap was higher then it should be 1/6th 
        stat.attackSpeedPercent = 5
        cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown/5)

        // -1 atk spd percent, cooldown doubles
        stat.attackSpeedPercent = -1
        cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown*2)

        // -5 atk spd percent, cooldown * 6 
        stat.attackSpeedPercent = -5
        cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown*6)
    })
    test("attackSpeed and attackSpeedPercent test", ()=>{
        // 2 as, 1asp
        stat.attackSpeed = 2
        stat.attackSpeedPercent = 1
        let cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown/4)

        // 2 as, 1.5asp - cap
        stat.attackSpeedPercent = 4
        cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown/5)

        // 2 as, 5asp - exceed cap result should be same as cap
        stat.attackSpeedPercent = 5
        cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown/5)

        // 2 as, -1asp
        stat.attackSpeedPercent = -1
        cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown)

        // 2 as, -4asp
        stat.attackSpeedPercent = -4
        cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown * 5/2)

        // 2 as, -5asp
        stat.attackSpeedPercent = -5
        cooldown = getFinalAttackCooldown(stat, base_cooldown)
        expect(cooldown).toBe(base_cooldown * 6/2)
    })
})