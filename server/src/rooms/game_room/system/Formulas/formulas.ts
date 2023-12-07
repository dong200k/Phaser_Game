import Stat from "../../schemas/gameobjs/Stat";

export const BASE_SPEED = 1
export const ARMOR_PEN_CAP = 1
export const MAGIC_PEN_CAP = 1
// export const ATTACK_SPEED_CAP = 5
export const MINIMUM_MONSTER_ATTACK_COOLDOWN = 0.1

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
export const getTrueAttackDamage = function({attack, attackPercent, damagePercent, critDamage, critRate, armorPen}: Stat, {extraDamageTakenPercent, armor}: Stat, attackMultiplier: number){
    const isCrit = Math.random() < critRate? 1 : 0;
    let damage = (attack * (1 + attackPercent + damagePercent)) * attackMultiplier
    if(isCrit) damage *= (critDamage + 1)

    let effectiveArmor = armor * (1 - Math.min(armorPen, ARMOR_PEN_CAP))
    let damageReduction = 100/(100 + effectiveArmor)
    if(effectiveArmor<0) damageReduction = 1
    let trueDamage = damage * damageReduction
    trueDamage *= 1 + (extraDamageTakenPercent)

    // console.log(`damage: ${damage}, trueDamage: ${trueDamage}, effective armor ${effectiveArmor}, reduction: ${damageReduction}, armorPen: ${armorPen}\n\n`)

    // console.log(`ignore armor damage: ${ignoreArmorDamage}, reduced damage: ${reducedDamage}, true damage: ${trueDamage}`)

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
export const getTrueMagicDamage = function({magicAttack, magicAttackPercent, damagePercent, magicPen}: Stat, {extraDamageTakenPercent, magicResist}: Stat, magicMultiplier: number){
    const damage = magicMultiplier * (magicAttack * (1 + magicAttackPercent + damagePercent))
    let effectiveMagicResist = magicResist * (1 - Math.min(magicPen, MAGIC_PEN_CAP))
    let damageReduction = 100/(100 + effectiveMagicResist)
    if(effectiveMagicResist<0) damageReduction = 1
    let trueDamage = damage * damageReduction
    trueDamage *= 1 + (extraDamageTakenPercent)

    return trueDamage < 0? 1 : Math.floor(trueDamage)
}

/**
 * 
 * @param trueDamage true magic or true attack damage
 * @param lifeSteal flat life steal
 * @param lifeStealPercent percent life steal
 * @returns total life steal
 */
export const getFinalLifeSteal = function(trueDamage: number, lifeSteal: number, lifeStealPercent: number){
    // return Math.round(lifeStealPercent * trueDamage + lifeSteal);

    // Round to nearest decimal
    let num = lifeStealPercent * trueDamage + lifeSteal
    return Math.round((num + Number.EPSILON) * 10) / 10
}

/**
 * Returns the cooldown of a single attack taking into account the attack speed stats.
 * 
 * Note:
 * Currently used by monsters only.
 * Every 1 attack speed is equivalent to 1 attack per second. Lowest cooldown is 0.1s, which is 10 attacks per second.
 * If attack speed is zero then a cooldown of 1s is used by default.
 * @param stat
 * @param BASE_ATTACK_COOLDOWN cooldown
 * @returns actual cooldown in seconds after accounting attack speed.
 */
export const getFinalAttackCooldown = function({attackSpeed, attackSpeedPercent}: Stat){
    let totalAttackSpeed = attackSpeed * (1 + attackSpeedPercent)
    let cooldown: number

    if(totalAttackSpeed > 0) cooldown = 1/totalAttackSpeed
    else cooldown = 1

    return Math.max(cooldown, MINIMUM_MONSTER_ATTACK_COOLDOWN)
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

/**
 * Returns remaining shield health and damage that did not go through shield.
 * @param shieldHp health of shield (>=0)
 * @param damage true damage player will take (positive number)
 * Returns the remaining shieldHp and damage that still needs to be taken
 */
export const getRemainingShieldAndDamageFromCollision = (shieldHp: number, damage: number) => {
    let remainingShieldHp = shieldHp -= damage
    if(remainingShieldHp < 0) shieldHp = 0

    let damageLeftAfterShield = damage - shieldHp
    if(damage < 0) damage = 0

    return {shieldHp: remainingShieldHp, damage: damageLeftAfterShield}
}

/**
 * Takes in a stat and a baseArea and returns the baseArea scaled by the players area stat
 * @param stat 
 * @param baseArea 
 */
export const getFinalArea = ({area}: Stat, baseArea: number)=>{
    return baseArea * (1 + area)
}

/**
 * Calculates the time that should pass based on cooldown reduction. Note faster the time cooldown higher the time that passes by.
 * @param stat  
 * @param deltaT time that passed
 * @returns 
 */
export const getTimeAfterCooldownReduction = ({cooldownReduction}: Stat, deltaT: number)=>{
    // allowed cooldownReduction range 0 - 0.9
    let cappedReduction = Math.max(0, Math.min(0.9, cooldownReduction))
    return deltaT/(1 - cappedReduction)
}

/**
 * Calculates the real time that should pass by based on the cooldown reduction stat and a given cooldown.
 * 
 * The higher the cooldown the lower the returned time
 * @param stat 
 * @param cooldown 
 * @returns 
 */
export const getRealTimeAfterCooldownReduction = ({cooldownReduction}: Stat, cooldown: number)=>{
    // allowed cooldownReduction range 0 - 0.9
    let cappedReduction = Math.max(0, Math.min(0.9, cooldownReduction))
    return cooldown * (1 - cappedReduction)
}

/**
 * Takes in a stat and deltaT and reverts deltaT back to the original value before cooldown reduction was applied.
 * @param stat 
 * @param deltaT 
 * @returns 
 */
export const undoCooldownReduction = ({cooldownReduction}: Stat, deltaT: number)=>{
    let cappedReduction = Math.max(0, Math.min(0.9, cooldownReduction))
    
    return deltaT*(1 - cappedReduction) 
}


/**
 * Calculates the time that should pass for player attack based on attack speed
 * @param stat  
 * @param deltaT time that passed
 * @returns 
 */
export const getTimeAfterAttackSpeed = (stat: Stat, deltaT: number)=>{
    let attackSpeed = getFinalAttackSpeed(stat)

    return attackSpeed
}

/**
 * This will return an estimated dps for 1 attack type.
 * 
 * Takes in a stat for the attacker, cooldown in seconds of the attack, and a multiplier for the attack
 * @param stat 
 * @param cooldown in seconds
 * @param multiplier 
 * @returns The estimated damage/second
 * 
 */
export const getEstimatedDps = (stat: Stat, cooldown: number = 1, multiplier: number = 1) => {
    let damage = getDamage(stat, multiplier)
    return damage / cooldown
}

/**
 * 
 * @param stat 
 * @param multiplier 
 * @returns The raw damage of this attack without accounting armor
 */
export const getDamage = ({attack, attackPercent, damagePercent, critRate, critDamage}: Stat, multiplier: number = 1) => {
    let damage = attack * (1 + attackPercent) * multiplier
    damage = damage + (critRate * critDamage) * multiplier * damage // after factoring in crit stats
    damage *= 1 + damagePercent // after factoring in damage percent stat
    return damage
}