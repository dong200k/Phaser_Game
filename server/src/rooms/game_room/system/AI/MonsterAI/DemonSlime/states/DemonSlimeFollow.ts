import Follow from "../../simplemonster/Follow";
import DemonSlimeController from "../DemonSlimeController";

export default class DemonSlimeFollow extends Follow{
    protected getAnimation(): string {
        let stateMachine = this.getStateMachine<DemonSlimeController>();
        if(stateMachine.isTransformed()) return "walk"
        return "walk_slime"
    }
}