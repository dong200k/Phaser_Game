import PlayerController, { PlayerControllerData } from "../PlayerControllers/PlayerController"
import BladeSlash from "./states/BladeSlash"

export default class BladeMasterController extends PlayerController{
    protected create(data: PlayerControllerData): void {
        super.create(data)
        // console.log("On create blade master controller")
        // this.getRollState().setAnimationKey("dash")
        this.changeState("idle")

        this.removeState("Attack")
        this.attackState = new BladeSlash("Attack", this)
        this.addState(this.attackState)
        this.specialState.setConfig({attackDuration: 0})
    }
}