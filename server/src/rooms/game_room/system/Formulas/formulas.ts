import Stat from "../../schemas/gameobjs/Stat";

const BASE_SPEED = 1
const ARMOR_PEN_CAP = 0.3
const MAGIC_PEN_CAP = 0.3
const ATTACK_SPEED_CAP = 5

/**
 * 
 * @param stat 
 * @returns stat's speed multiplied by base speed
 */
const getFinalSpeed = function({speed}: Stat){
    return speed * BASE_SPEED;
}

/**
 * Takes in an attacker stat, a defender stack, and a attack damage multiplier, and returns the true attack damage the defender should take
 * @param attackerStat stat of attacker/projectile
 * @param defenderStat stat of defender/entity
 * @param attackMultiplier multiplier for the ad damage before armor is taken into account
 * @returns 
 */
const getTrueAttackDamage = function({attack, attackPercent, damagePercent, critDamage, critRate, armorPen}: Stat, {armor}: Stat, attackMultiplier: number){
    const isCrit = Math.random() < critRate? 1 : 0;
    let damage = (attack * (1 + attackPercent + damagePercent)) * attackMultiplier
    if(isCrit) damage *= (critDamage + 1)

    const effectiveArmor = armor * (1 - Math.min(armorPen, ARMOR_PEN_CAP))
    const trueDamage = damage - effectiveArmor;
    return trueDamage < 0? 0 : trueDamage
}

/**
 * 
 * Takes in an attacker stat, defender stat, and a magic damage multiplier and returns the true magic damage the defender should take
 * @param attackerStat stat of attacker/projectile
 * @param defenderStat stat of defender/entity 
 * @param magicMultiplier multiplier for the ap damage before magic resist is taken into account
 * @returns 
 */
const getTrueMagicDamage = function({magicAttack, magicAttackPercent, damagePercent, magicPen}: Stat, {magicResist}: Stat, magicMultiplier: number){
    const damage = magicMultiplier * (magicAttack * (1 + magicAttackPercent + damagePercent))
    const effectiveArmor = magicResist * (1 - Math.min(magicPen, MAGIC_PEN_CAP))
    const trueDamage = damage - effectiveArmor;
    return trueDamage < 0? 0 : trueDamage
}

/**
 * 
 * @param trueDamage true magic or true attack damage
 * @param lifeSteal life steal percent
 * @returns total life steal flat
 */
const getFinalLifeSteal = function(trueDamage: number, lifeSteal: number){
    return lifeSteal * trueDamage;
}

/**
 *
 * @param stat
 * @param BASE_ATTACK_COOLDOWN cooldown
 * @returns actual cooldown after accounting attack speed
 */
const getFinalAttackCooldown = function({attackSpeed, attackSpeedPercent}: Stat, BASE_ATTACK_COOLDOWN: number){
    const totalAttackSpeed = attackSpeed * (1 + attackSpeedPercent)
    const speedFactor = 1 / Math.min(totalAttackSpeed, ATTACK_SPEED_CAP)
    return BASE_ATTACK_COOLDOWN * speedFactor;
}


/**
 * 
 * @param stat 
 * @returns att
 */
const getFinalAttackRange = function({attackRangePercent, attackRange}: Stat){
    return (1 + attackRangePercent) + attackRange;
}

export {
    getFinalAttackCooldown, getTrueAttackDamage, getFinalAttackRange, getFinalLifeSteal, getTrueMagicDamage, getFinalSpeed
}