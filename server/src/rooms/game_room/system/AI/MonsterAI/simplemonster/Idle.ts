import StateNode from "../../../StateMachine/StateNode";
import MonsterController from "./MonsterController";

export default class Idle extends StateNode {

    public onEnter(): void {
        
    }
    public onExit(): void {
        
    }
    public update(deltaT: number): void {
        let stateMachine = (this.getStateMachine() as MonsterController);
        // let player = stateMachine.getPlayerManager();
        // throw new Error("Method not implemented.");
    }

}