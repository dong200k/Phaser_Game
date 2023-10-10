import StateNode from "../../../StateMachine/StateNode";

export default class DemoState extends StateNode {
    public onEnter(): void {
        console.log("DemoState Entered");
    }
    public onExit(): void {
        console.log("DemoState Exited");
    }
    public update(deltaT: number): void {
        // console.log("DemoState Exited");
    }
}