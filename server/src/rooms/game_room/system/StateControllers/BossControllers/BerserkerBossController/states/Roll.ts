import Matter from "matter-js";
import MathUtil from "../../../../../../../util/MathUtil";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import SpeedMultiEffect from "../../../../../schemas/effects/temp/SpeedMultiEffect";
import Entity from "../../../../../schemas/gameobjs/Entity";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import { getFinalSpeed } from "../../../../Formulas/formulas";
import GameManager from "../../../../GameManager";
import StateNode from "../../../../StateMachine/StateNode";
import EffectManager from "../../../../StateManagers/EffectManager";
import BerserkerBossController from "../BerserkerBossController";



export default class Roll extends StateNode {

    protected controller!: BerserkerBossController
    protected boss!: Monster;
    protected gameManager!: GameManager;
    protected target?: Entity

    /** Duration of roll animation assuming 50 speed */
    private duration: number = 1
    private timePassed: number = 0
    /** Duration of the speed boost */
    private speedBoostDuration: number = 0.5
    private speedBoostMult: number = 2

    /** Distance from rolling origin that player can travel to */
    private maxDistance: number = 10000
    private originPosition = {x: 0, y: 0}
    private speedMultiEffect?: SpeedMultiEffect

    public onEnter(): void {
        this.controller = this.getStateMachine<BerserkerBossController>()
        this.boss = this.controller.getBoss()
        this.gameManager = this.controller.getGameManager()
        this.target = this.controller.getTarget()

        this.boss.animation.playAnimation("roll", {duration: this.duration * 50/getFinalSpeed(this.boss.stat)});
        this.originPosition = {...this.boss.getBody().position}
        this.boss.sound.playSoundEffect("roll")
        this.speedMultiEffect = EffectFactory.createSpeedMultiplierEffectTimed(this.speedBoostMult, this.speedBoostDuration)
        EffectManager.addEffectsTo(this.boss, this.speedMultiEffect)
    }

    public onExit(): void {
        this.timePassed = 0
        if(this.speedMultiEffect) {
            EffectManager.removeEffectFrom(this.boss, this.speedMultiEffect)
            this.speedMultiEffect = undefined
        }

    }

    public update(deltaT: number): void {
        this.timePassed += deltaT
        if(this.timePassed >= this.duration){
            this.controller.changeState("Follow")
        }

        let currentPosition = this.boss.getBody().position
        let distance = MathUtil.distanceSquared(this.originPosition.x, this.originPosition.y, currentPosition.x, currentPosition.y)
        if(distance > this.maxDistance){
            this.controller.changeState("Follow")
        }

        if(this.target){
            let bossBody = this.boss.getBody()
            let {x: bossX, y: bossY} = bossBody.position;
            let {x: targetX, y: targetY} = this.target.getBody().position;
    
            let speed = getFinalSpeed(this.boss.stat) * deltaT;
            let velocity = MathUtil.getNormalizedSpeed(targetX - bossX, targetY - bossY, speed);
            if(bossBody) Matter.Body.setVelocity(bossBody, velocity);
        
            let distanceToPlayer = MathUtil.distance(bossX, bossY, targetX, targetY)
            if(distanceToPlayer <= 40) this.controller.changeState("Follow")
        }
    }
    
}