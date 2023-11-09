import TriggerUpgradeEffect from "../../../../schemas/effects/trigger/TriggerUpgradeEffect";
import BerserkerChargeAttackLogic from "../../../EffectLogic/EffectLogics/weapon/BerserkerBlade/ChargeAttack/BerserkerChargeAttackLogic";
import ChargeState from "../../PlayerControllers/CommonStates/ChargeState";


/** This states handle the charging logic, when to start charge attack and when to play charging animations */
export default class BerserkerChargeState extends ChargeState {

    private currentAnimation = ""

    onExit(){
        super.onExit()
        this.currentAnimation = ""
    }

    protected resetChargeTimeSoFar(){
        let prevStateName = this.playerController.getPrevState()?.getStateName()
        if("Roll" !==  prevStateName && "Special" !== prevStateName){
            this.chargeTimeSoFar = 0
        }
    }

    /**
     * Controls when to play a charge animation.
     * 
     * Overwrite this and assign a new ChargeState that extends this state to your specific controller such as the BerserkerController,
     * for playing custom charge animation.
     */
    public handleChargeAnimation(deltaT: number){
        this.player.effects.forEach(e=>{
            if(e instanceof TriggerUpgradeEffect && e.effectLogic instanceof BerserkerChargeAttackLogic){
                let key = e.effectLogic.getChargeAnimation(this.chargeTimeSoFar/this.totalChargeTime)
                if(this.currentAnimation !== key){
                    if(key != "") this.player.animation.playAnimation(key,{
                        duration: 1,
                        loop: true
                    })
                    this.currentAnimation = key
                }
            }
        })
    }

}