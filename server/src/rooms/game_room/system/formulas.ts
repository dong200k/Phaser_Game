import Stat from "../schemas/gameobjs/Stat";

const BASE_SPEED = 1
const ARMOR_PEN_CAP = 0.3
const MAGIC_PEN_CAP = 0.3
const ATTACK_SPEED_CAP = 5

const getFinalSpeed = function({speed}: Stat){
    return speed * BASE_SPEED;
}

const getFinalAttackDamage = function({attack, attackPercent, damagePercent, critDamage, critRate, armorPen}: Stat, {armor}: Stat){
    const isCrit = Math.random() < critRate? 1 : 0;
    const trueDamage = (attack * (1 + attackPercent + damagePercent)) * (critDamage + 1) * isCrit 
    const effectiveArmor = armor * (1 - Math.min(armorPen, ARMOR_PEN_CAP))
    return trueDamage - effectiveArmor;
}

const getFinalMagicDamage = function({magicAttack, magicAttackPercent, damagePercent, magicPen}: Stat, {magicResist}: Stat){
    const trueDamage = (magicAttack * (1 + magicAttackPercent + damagePercent))
    const effectiveArmor = magicResist * (1 - Math.min(magicPen, MAGIC_PEN_CAP))
    return trueDamage - effectiveArmor;
}

const getFinalLifeSteal = function(trueDamage: number, lifeSteal: number){
    return lifeSteal * trueDamage;
}

const getFinalAttackCooldown = function({attackSpeed, attackSpeedPercent}: Stat, BASE_ATTACK_COOLDOWN: number){
    const totalAttackSpeed = attackSpeed * (1 + attackSpeedPercent)
    const speedFactor = 1 / Math.min(totalAttackSpeed, ATTACK_SPEED_CAP)
    return BASE_ATTACK_COOLDOWN * speedFactor;
}

const getFinalAttackRange = function({attackRangePercent, attackRange}: Stat){
    return (1 + attackRangePercent) + attackRange;
}

export {
    getFinalAttackCooldown, getFinalAttackDamage, getFinalAttackRange, getFinalLifeSteal, getFinalMagicDamage, getFinalSpeed
}