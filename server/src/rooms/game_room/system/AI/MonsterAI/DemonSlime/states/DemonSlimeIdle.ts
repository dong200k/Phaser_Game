import Idle from "../../simplemonster/Idle";
import DemonSlimeController from "../DemonSlimeController";

export default class DemonSlimeIdle extends Idle{
    protected getAnimation(): string {
        let stateMachine = this.getStateMachine<DemonSlimeController>();
        if(stateMachine.isTransformed()) return "idle"
        return "walk_slime"
    }
}