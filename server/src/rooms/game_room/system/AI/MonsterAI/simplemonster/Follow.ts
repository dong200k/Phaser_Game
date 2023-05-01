import Matter from "matter-js";
import StateNode from "../../../StateMachine/StateNode";
import MonsterController from "./MonsterController";

export default class Follow extends StateNode {

    public onEnter(): void {
        
    }
    public onExit(): void {
        
    }
    public update(deltaT: number): void {
        let stateMachine = (this.getStateMachine() as MonsterController);
        let monster = stateMachine.getMonster();
        let player = stateMachine.getPlayerManager();
        let body = monster.getBody();
        if(body) Matter.Body.setVelocity(body, {x: 0, y: 0});
    }

}