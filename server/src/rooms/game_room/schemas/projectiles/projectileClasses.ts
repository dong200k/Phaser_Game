import Projectile from "./Projectile"
import CircularFollowProjectle from "./specialprojectiles/CircularFollowProjectile"
import MeleeProjectile from "./specialprojectiles/MeleeProjectile"

// Constructors to be used in spawning projectiles
let ctors = {
    "Projectile": Projectile,
    "CircularFollowProjectile": CircularFollowProjectle,
    "MeleeProjectile": MeleeProjectile,
}

export default ctors

export type IClasses = keyof typeof ctors
