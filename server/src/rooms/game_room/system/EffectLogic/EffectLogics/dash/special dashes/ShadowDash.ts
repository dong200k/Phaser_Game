import { Body } from "matter-js"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import GameManager from "../../../../GameManager"
import { DashEffectLogic } from "../DashEffectLogic"
import { GameEvents, IProjectileConfig } from "../../../../interfaces"
import EffectFactory from "../../../../../schemas/effects/EffectFactory"
import EffectManager from "../../../../StateManagers/EffectManager"
import SpeedMultiEffect from "../../../../../schemas/effects/temp/SpeedMultiEffect"

export default class ShadowDash extends DashEffectLogic{
    effectLogicId = "ShadowDash"
    private dashCount = 0
    protected attackMultiplier: number = 0.5
    private speedMultiEffect?: SpeedMultiEffect

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        this.dashCount += 1
        let duration = this.getDuration()
        
        // Enter phantom like state every 3rd dash
        if(this.dashCount === 3){
            let phantomEffect = EffectFactory.createPhantomEffectTimed(duration)
            EffectManager.addEffectsTo(playerState, phantomEffect)
        }

        if(this.speedMultiEffect){
            EffectManager.removeEffectFrom(playerState, this.speedMultiEffect)
        }
        // Gain large speed boost
        let speedMult = this.getSpeedMult()
        let speedMultiEffect = EffectFactory.createSpeedMultiplierEffectTimed(speedMult, duration)
        EffectManager.addEffectsTo(playerState, speedMultiEffect)
    }

    private getSpeedMult(){
        return 1 + this.attackMultiplier + this.bonusAttackMultiplier
    }

    public getDuration(){
        return this.duration
    }
}