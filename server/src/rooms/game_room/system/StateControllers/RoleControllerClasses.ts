import BerserkerComboController from "./BerserkerController/BerserkerComboController"
import PlayerController from "./PlayerControllers/PlayerController"

// Constructors for controllers (used for initializing player roles at the moment)
let ctors = {
    "Ranger": PlayerController,
    "Berserker": BerserkerComboController,
}

export default ctors

export type IRoleControllerClasses = keyof typeof ctors