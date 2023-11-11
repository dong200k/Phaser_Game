import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import { ITriggerType } from "../../../interfaces";
import EffectLogic from "../../EffectLogic";

interface ITurboSkateConfig {
    effectLogicId?: string,
    speedBoostPercent?: number,
    maxDistancePercent?: number
}

/** 
 * Artifact that upgrades the player's roll
*/
export class TurboSkate extends EffectLogic{
    effectLogicId = "Turbo-Skate" 
    triggerType: ITriggerType = "none"

    private speedBoostPercent: number = 0.1
    private maxDistancePercent: number = 0.1


    constructor(config?: ITurboSkateConfig){
        super(config)

        this.effectLogicId = config?.effectLogicId ?? this.effectLogicId
        this.speedBoostPercent = config?.speedBoostPercent ?? this.speedBoostPercent
        this.maxDistancePercent = config?.maxDistancePercent ?? this.maxDistancePercent
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        playerState.playerController.upgradeRoll(this.speedBoostPercent, this.maxDistancePercent)
    }
}

