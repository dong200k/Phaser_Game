// type of effect a weapon/artifact upgrade tree's node can have
// "player attack" means the effect will be triggered when the player attacks
// "none" means the effect will be activated continuously based on a cooldown
const effectTypes = [
    "none", // Default - Continuously activated
    "player attack", // Triggered by player attack
    "player skill", // Triggered by player skill
    "one time", // Applied one time 
    "player charge attack", // Trigger by player charge attacks
    "player dash" // Trigger by player dash

]

export default effectTypes

/**
 * usage of artifacts currently an aritfact can be classified as one of: conditional, passive, attack, special, or roll.
 */
export const usageTypes = [
    "conditional passive",
    "passive",
    "attack",
    "special",
    "roll",
    "none",
    "merchant_weapon",
    "devil",
    "wisdom",
    "giant",
    'assassin',
    "lightning",
    "vampire"
]