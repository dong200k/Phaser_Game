import Entity from "../../../../../schemas/gameobjs/Entity";
import Player from "../../../../../schemas/gameobjs/Player";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import GameManager from "../../../../GameManager";
import StateNode from "../../../../StateMachine/StateNode";
import BerserkerBossController from "../BerserkerBossController";


export default class Idle extends StateNode {

    protected controller!: BerserkerBossController
    protected boss!: Monster;
    protected gameManager!: GameManager;

    private seekTargetCooldown = 1
    private timeSoFar = 0

    public onEnter(): void {
        this.controller = this.getStateMachine<BerserkerBossController>();
        this.boss = this.controller.getBoss();
        this.boss.animation.playAnimation("idle", {loop: true});
        this.gameManager = this.controller.getGameManager()
    }

    public onExit(): void {

    }

    public setConfig(){
        
    }

    public update(deltaT: number): void {
        this.timeSoFar += deltaT
        if(this.timeSoFar >= this.seekTargetCooldown){
            this.timeSoFar = 0
            this.controller.seekTarget()
        }
    }
}