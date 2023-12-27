import BerserkerComboController from "./BerserkerController/BerserkerComboController"
import BladeMasterController from "./BladeMasterController/BladeMasterController"
import PlayerController from "./PlayerControllers/PlayerController"
import WarriorController from "./WarriorController/WarriorController"

// Constructors for controllers (used for initializing player roles at the moment)
let ctors = {
    "Ranger": PlayerController,
    "Berserker": BerserkerComboController,
    "Warrior": WarriorController,
    "BladeMaster": BladeMasterController,
    "Nixi": BladeMasterController
}

export default ctors

export type IRoleControllerClasses = keyof typeof ctors