import MathUtil from "../../../../../../util/MathUtil";
import EffectFactory from "../../../../schemas/effects/EffectFactory";
import SpeedMultiEffect from "../../../../schemas/effects/temp/SpeedMultiEffect";
import Player from "../../../../schemas/gameobjs/Player";
import { getFinalSpeed } from "../../../Formulas/formulas";
import StateNode from "../../../StateMachine/StateNode";
import EffectManager from "../../../StateManagers/EffectManager";
import PlayerController from "../PlayerController";


export default class Roll extends StateNode {

    private playerController!: PlayerController;
    private player!: Player;

    /** Duration of roll animation assuming 50 speed */
    private duration: number = 1
    private timePassed: number = 0
    /** Duration of the speed boost */
    private speedBoostDuration: number = 0.5
    private speedBoostMult: number = 1.5

    /** Distance from rolling origin that player can travel to */
    private maxDistance: number = 10000
    private originPosition = {x: 0, y: 0}
    private speedMultiEffect?: SpeedMultiEffect

    public onEnter(): void {
        this.playerController = this.getStateMachine<PlayerController>();
        this.player = this.playerController.getPlayer();
        this.player.animation.playAnimation("roll", {duration: this.duration * 50/getFinalSpeed(this.player.stat)});
        this.originPosition = {...this.player.getBody().position}

        this.speedMultiEffect = EffectFactory.createSpeedMultiplierEffectTimed(this.speedBoostMult, this.speedBoostDuration)
        EffectManager.addEffectsTo(this.player, this.speedMultiEffect)
    }

    public onExit(): void {
        this.timePassed = 0
        if(this.speedMultiEffect) {
            EffectManager.removeEffectFrom(this.player, this.speedMultiEffect)
            this.speedMultiEffect = undefined
        }

    }

    public update(deltaT: number): void {
        this.timePassed += deltaT
        if(this.timePassed >= this.duration){
            this.playerController.changeState("Idle")
        }

        let currentPosition = this.player.getBody().position
        let distance = MathUtil.distanceSquared(this.originPosition.x, this.originPosition.y, currentPosition.x, currentPosition.y)
        if(distance > this.maxDistance){
            this.playerController.changeState("Idle")
        }
    }
    
}