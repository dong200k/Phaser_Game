import EffectFactory from "../../../../../../schemas/effects/EffectFactory";
import PiercingEffect from "../../../../../../schemas/effects/temp/PiercingEffect";
import Player from "../../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../../GameManager";
import EffectManager from "../../../../../StateManagers/EffectManager";
import WeaponUpgradeFactory from "../../../../../UpgradeTrees/factories/WeaponUpgradeFactory";
import EffectLogic from "../../../../EffectLogic";
import Piercing1Logic from "./Piercing1Logic";

/**
 * Gives the player 2 extra piercing untimed or until the effect is removed.
 */
export default class Piercing2Logic extends Piercing1Logic{
    effectLogicId = "Piercing2"
    piercing = 2
}