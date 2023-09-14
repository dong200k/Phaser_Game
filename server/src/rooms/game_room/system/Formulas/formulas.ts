import Stat from "../../schemas/gameobjs/Stat";

export const BASE_SPEED = 1
export const ARMOR_PEN_CAP = 0.3
export const MAGIC_PEN_CAP = 0.3
export const ATTACK_SPEED_CAP = 5

/**
 * 
 * @param stat 
 * @returns stat's speed multiplied by base speed
 */
export const getFinalSpeed = function({speed}: Stat){
    return speed * BASE_SPEED;
}

/**
 * Takes in an attacker stat, a defender stack, and a attack damage multiplier, and returns the true attack damage the defender should take
 * The lowest damage returned is 1, even if the attacker has 0 attack.
 * @param attackerStat stat of attacker/projectile
 * @param defenderStat stat of defender/entity
 * @param attackMultiplier non negative multiplier for the ad damage before armor is taken into account
 * @returns 
 */
export const getTrueAttackDamage = function({attack, attackPercent, damagePercent, critDamage, critRate, armorPen}: Stat, {armor}: Stat, attackMultiplier: number){
    const isCrit = Math.random() < critRate? 1 : 0;
    let damage = (attack * (1 + attackPercent + damagePercent)) * attackMultiplier
    if(isCrit) damage *= (critDamage + 1)

    let reductionMultiplier = (1 - Math.min(armorPen, ARMOR_PEN_CAP))
    if(reductionMultiplier < 0) reductionMultiplier = 0
    if(armor < 0) reductionMultiplier = 1 // Don't apply armor pen when armor is negative
    let effectiveArmor = armor * reductionMultiplier

    const trueDamage = damage - effectiveArmor;
    // console.log(`damage: ${damage}, armor: ${armor}, attack: ${attack}, attackMult ${attackMultiplier}`)
    return trueDamage < 1 ? 1 : Math.floor(trueDamage);
}

/**
 * 
 * Takes in an attacker stat, defender stat, and a magic damage multiplier and returns the true magic damage the defender should take
 * @param attackerStat stat of attacker/projectile
 * @param defenderStat stat of defender/entity 
 * @param magicMultiplier non negative multiplier for the ap damage before magic resist is taken into account
 * @returns 
 */
export const getTrueMagicDamage = function({magicAttack, magicAttackPercent, damagePercent, magicPen}: Stat, {magicResist}: Stat, magicMultiplier: number){
    const damage = magicMultiplier * (magicAttack * (1 + magicAttackPercent + damagePercent))

    let reductionMultiplier = (1 - Math.min(magicPen, MAGIC_PEN_CAP))
    if(reductionMultiplier < 0) reductionMultiplier = 0
    if(magicResist < 0) reductionMultiplier = 1 // negative magic res, dont apply magic pen
    const effectiveMagicResist = magicResist * reductionMultiplier
    
    const trueDamage = damage - effectiveMagicResist;
    return trueDamage < 0? 0 : Math.floor(trueDamage)
}

/**
 * 
 * @param trueDamage true magic or true attack damage
 * @param lifeSteal flat life steal
 * @param lifeStealPercent percent life steal
 * @returns total life steal
 */
export const getFinalLifeSteal = function(trueDamage: number, lifeSteal: number, lifeStealPercent: number){
    return Math.floor(lifeStealPercent * trueDamage + lifeSteal);
}

/**
 * Note: 
 * Assuming attackSpeed = 1.
 * attackSpeedPercent = 0 same cooldown.
 * attackSpeedPercent = 1 halves cooldown.
 * attackSpeedPercent = 2 makes cooldown 1/3.
 * attackSpeedPercent = -1 doubles cooldown.
 * attackSpeedPercent = -2 triples cooldown.
 * ATTACK_SPEED_CAP affects maximum final attack speed. At the moment it is = 5 which means maximum speedup is 5x reduced cooldown.
 * @param stat
 * @param BASE_ATTACK_COOLDOWN cooldown
 * @returns actual cooldown after accounting attack speed
 */
export const getFinalAttackCooldown = function({attackSpeed, attackSpeedPercent}: Stat, BASE_ATTACK_COOLDOWN: number){
    let totalAttackSpeed: number
    if(attackSpeedPercent < 0) {
        totalAttackSpeed = attackSpeed / Math.abs(-1 + attackSpeedPercent)
    }else{
        totalAttackSpeed = attackSpeed * (1 + attackSpeedPercent)
    }

    if(totalAttackSpeed === 0 || attackSpeed < 0) return BASE_ATTACK_COOLDOWN

    const speedFactor = 1 / Math.min(totalAttackSpeed, ATTACK_SPEED_CAP)
    return BASE_ATTACK_COOLDOWN * speedFactor;
}


/**
 * 
 * @param stat
 * @param baseRange base range before applying stat
 * @returns attack range after accounting stat
 */
export const getFinalAttackRange = function({attackRangePercent, attackRange}: Stat, baseRange: number){
    return (1 + attackRangePercent) * attackRange * baseRange;
}


/**
 * 
 * @param stat
 * @returns attack speed after accounting stat
 */
export const getFinalAttackSpeed = function({attackSpeed, attackSpeedPercent}: Stat){
    let finalAttackSpeed = attackSpeed * (1 + attackSpeedPercent)
    return Math.abs(finalAttackSpeed)
}

/**
 * 
 * @param stat 
 * @returns charge attack speed after accounting stat
 */
export const getFinalChargeAttackSpeed = function({chargeAttackSpeed, chargeAttackSpeedPercent}: Stat){
    let finalChargeAttackSpeed = chargeAttackSpeed * (1 + chargeAttackSpeedPercent)
    return Math.abs(finalChargeAttackSpeed)
}