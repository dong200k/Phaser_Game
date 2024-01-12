import StateNode from "../../../../../../StateMachine/StateNode"

export default class Idle extends StateNode{
    public onEnter(): void {
        // throw new Error("Method not implemented.");
    }
    public onExit(): void {
        // throw new Error("Method not implemented.");
    }
    public update(deltaT: number): void {
        // throw new Error("Method not implemented.");
        this.getStateMachine().changeState("Fall")
    }

}