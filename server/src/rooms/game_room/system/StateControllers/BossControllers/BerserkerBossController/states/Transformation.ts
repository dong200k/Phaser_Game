import Matter from "matter-js";
import Entity from "../../../../../schemas/gameobjs/Entity";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import GameManager from "../../../../GameManager";
import StateNode from "../../../../StateMachine/StateNode";
import BerserkerBossController from "../BerserkerBossController";
import BerserkerAbilityLogic from "../../../../EffectLogic/EffectLogics/abilities/BerserkerAbility/BerserkerAbility";

export default class Transformation extends StateNode{
    protected controller!: BerserkerBossController
    protected boss!: Monster;
    protected gameManager!: GameManager;
    protected target?: Entity

    private reviveTime = 5
    private reviveAnimationDuration = 1
    private timeSoFar = 0
    private revived = false
    private abilityTriggered = false
    private deathAnimationTime = 1

    public onEnterHelper(){
        this.controller = this.getStateMachine<BerserkerBossController>()
        this.boss = this.controller.getBoss()
        this.gameManager = this.controller.getGameManager()
        this.target = this.controller.getTarget()
    }

    public onEnter(): void {
        this.onEnterHelper()
        
        this.boss.animation.playAnimation("death",{
            duration: this.deathAnimationTime,
            loop: false
        })
        Matter.Body.setVelocity(this.boss.getBody(), {x: 0, y: 0});
        this.boss.sound.stopMusic("boss_getting_dark")
    }

    public onExit(): void {
    }

    public update(deltaT: number): void {
        this.timeSoFar += deltaT
        if(this.timeSoFar >= this.reviveTime + this.deathAnimationTime && !this.revived){
            this.revived = true
            this.boss.animation.playAnimation("revive", {
                duration: this.reviveAnimationDuration
            })
            this.controller.transform()
            this.timeSoFar = 0
        }

        if(this.timeSoFar >= this.reviveAnimationDuration + 2 && this.revived && !this.abilityTriggered){
            this.abilityTriggered = true
            this.controller.changeState("Follow")
        }
    }

}