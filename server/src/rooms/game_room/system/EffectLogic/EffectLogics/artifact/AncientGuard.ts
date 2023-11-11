// Artifact that provides the player with a shield
import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import EffectFactory from "../../../../schemas/effects/EffectFactory";
import ContinuousEffectUntimed from "../../../../schemas/effects/continuous/ContinuousEffectUntimed";
import ShieldEffect from "../../../../schemas/effects/temp/ShieldEffect";
import Player from "../../../../schemas/gameobjs/Player";
import { CategoryType } from "../../../Collisions/Category";
import DatabaseManager from "../../../Database/DatabaseManager";
import { getFinalAttackRange } from "../../../Formulas/formulas";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import { ITriggerType } from "../../../interfaces";
import EffectLogic from "../../EffectLogic";

interface IAncientGuardConfig {
    effectLogicId?: string,
    shieldPercent?: number,
}

/** 
 * Artifact that gives player a shield every x seconds.
*/
export class AncientGuard extends EffectLogic{
    effectLogicId = "Ancient-Guard" 
    triggerType: ITriggerType = "none"

    private shieldPercent: number = 10 // Percent of player's max health that shield provides as shield health.
    private shieldDuration: number = 5
    private shieldEffect?: ShieldEffect

    constructor(config?: IAncientGuardConfig){
        super(config)

        this.effectLogicId = config?.effectLogicId ?? this.effectLogicId
        this.shieldPercent = config?.shieldPercent ?? this.shieldPercent
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree?: WeaponUpgradeTree){
        let shieldHp = this.shieldPercent/100 * playerState.stat.maxHp
        this.shieldEffect = EffectFactory.createShieldEffect(Math.floor(shieldHp), true, this.shieldDuration)
        EffectManager.addEffectsTo(playerState, this.shieldEffect)
    }

    public removeEffect(entity: Player, gameManager: GameManager, ...args: any){
        this.removeShield(entity)
    }

    public removeShield(entity: Player){
        if(this.shieldEffect){
            EffectManager.removeEffectFrom(entity, this.shieldEffect)
        }
    }
}

