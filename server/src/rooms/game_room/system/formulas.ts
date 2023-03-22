import Stat from "../schemas/gameobjs/Stat";

const BASE_SPEED = 1
const ARMOR_PEN_CAP = 0.3

const getEffectiveSpeed = function({speed}: Stat){
    return speed * BASE_SPEED;
}

const getEffectiveDamage = function({attack, attackPercent, damagePercent, critDamage, critRate, armorPen}: Stat, {armor}: Stat){
    const isCrit = Math.random() < critRate? 1 : 0;
    const trueDamage = (attack * (1 + attackPercent + damagePercent)) * (critDamage + 1) * isCrit 
    const effectiveArmor = armor * (1 - Math.min(armorPen, ARMOR_PEN_CAP))
    return trueDamage - effectiveArmor;
}

export {
    getEffectiveSpeed, getEffectiveDamage 
}