import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import WeaponUpgradeFactory from "../../../../UpgradeTrees/factories/WeaponUpgradeFactory";
import EffectLogic from "../../../EffectLogic";

export default class Piercing2Logic extends EffectLogic{
    effectLogicId = "Piercing2"

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeFactory){
        playerState.weaponUpgradeTree.setPiercing(10)
    }

    public removeEffect(playerState: Player, gameManager: GameManager, ...args: any){
        playerState.weaponUpgradeTree.setPiercing(1)
    }
}