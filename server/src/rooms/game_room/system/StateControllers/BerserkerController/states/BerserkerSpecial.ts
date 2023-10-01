import Special from "../../PlayerControllers/CommonStates/Special";

export default class BerserkerSpecial extends Special{
    protected changeToExitState(){
        let prevStateName = this.playerController.getPrevState()?.getStateName()
        if(prevStateName === "ChargeState"){
            this.playerController.changeState("ChargeState")
        }else{
            this.playerController.changeState("Idle")
        }
    }
}