import Projectile from "./Projectile"
import ArrowRainProjectile from "./specialprojectiles/ArrowRainProjectile"
import CircularFollowProjectle from "./specialprojectiles/CircularFollowProjectile"
import HomingProjectile from "./specialprojectiles/HomingProjectile"
import MeleeProjectile from "./specialprojectiles/MeleeProjectile"

// Constructors to be used in spawning projectiles
let ctors = {
    "Projectile": Projectile,
    "CircularFollowProjectile": CircularFollowProjectle,
    "MeleeProjectile": MeleeProjectile,
    "HomingProjectile": HomingProjectile,
    "ArrowRainProjectile": ArrowRainProjectile
}

export default ctors

export type IClasses = keyof typeof ctors
