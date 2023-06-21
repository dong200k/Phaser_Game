import Projectile from "./Projectile"

// Constructors to be used in spawning projectiles
let ctors = {
    "Projectile": Projectile
}

export default ctors

export type IClasses = keyof typeof ctors
