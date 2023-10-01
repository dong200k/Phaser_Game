import Entity from "../../../../../schemas/gameobjs/Entity";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import GameManager from "../../../../GameManager";
import StateNode from "../../../../StateMachine/StateNode";
import BerserkerBossController from "../BerserkerBossController";

export default class Dead extends StateNode{
    protected controller!: BerserkerBossController
    protected boss!: Monster;
    protected gameManager!: GameManager;
    protected target?: Entity

    public onEnterHelper(){
        this.controller = this.getStateMachine<BerserkerBossController>()
        this.boss = this.controller.getBoss()
        this.gameManager = this.controller.getGameManager()
        this.target = this.controller.getTarget()
    }

    public onEnter(): void {
        this.onEnterHelper()
        this.boss.animation.playAnimation("death",{
            duration: 1,
        })
        this.controller.turnOffAbility()
        // this.boss.setActive(false)
    }

    public onExit(): void {
    }

    public update(deltaT: number): void {
    }

}