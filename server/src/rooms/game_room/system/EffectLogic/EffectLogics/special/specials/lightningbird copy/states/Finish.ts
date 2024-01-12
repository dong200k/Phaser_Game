import StateNode from "../../../../../../StateMachine/StateNode"
import MeteorController from "../MeteorController";

export default class Finish extends StateNode{
    public onEnter(): void {
        // throw new Error("Method not implemented.");
        let stateMachine = (this.getStateMachine() as MeteorController);
        let projectile = stateMachine.getProjectile()

        projectile.setActive(false)
        projectile.setCollision("NONE")
        // projectile.setVisible(false)
        this.getStateMachine().changeState("Idle")
    }
    public onExit(): void {
        // throw new Error("Method not implemented.");
    }
    public update(deltaT: number): void {

        // throw new Error("Method not implemented.");
    }

}