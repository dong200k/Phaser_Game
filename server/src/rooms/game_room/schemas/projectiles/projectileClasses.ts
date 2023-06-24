import Projectile from "./Projectile"
import CircularFollowProjectle from "./specialprojectiles/CircularFollowProjectile"

// Constructors to be used in spawning projectiles
let ctors = {
    "Projectile": Projectile,
    "CircularFollowProjectile": CircularFollowProjectle
}

export default ctors

export type IClasses = keyof typeof ctors
