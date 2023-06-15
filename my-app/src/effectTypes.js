// type of effect a weapon/artifact upgrade tree's node can have
// "player attack" means the effect will be triggered when the player attacks
// "none" means the effect will be activated continuously based on a cooldown
const effectTypes = [
    "none", // Default - Continuously activated
    "player attack", // Triggered by player attack
    "player skill", // Triggered by player skill
    "one time" // Applied one time 
]

export default effectTypes