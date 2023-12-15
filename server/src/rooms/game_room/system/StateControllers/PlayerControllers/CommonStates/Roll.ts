import Matter from "matter-js";
import MathUtil from "../../../../../../util/MathUtil";
import EffectFactory from "../../../../schemas/effects/EffectFactory";
import CollisionImmuneEffect from "../../../../schemas/effects/temp/CollisionImmuneEffect";
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
    private speedBoostMult: number = 2
    private originalSpeedBoostMult: number = 2

    /** Distance from rolling origin that player can travel to */
    private originalMaxDistance: number = 5000
    private maxDistance: number = 5000
    private originPosition = {x: 0, y: 0}
    private speedMultiEffect?: SpeedMultiEffect
    private collisionImmuneEffect?: CollisionImmuneEffect

    /** Duration of roll animation, affected by duration */
    private animationDuration: number = 1

    private speedBoostScale = 3
    private maxDistanceScale = 1

    private enterChargeStateOnRollFinish = false

    public onEnter(): void {
        this.maxDistance = this.originalMaxDistance * this.maxDistanceScale
        this.speedBoostMult = this.originalSpeedBoostMult * this.speedBoostScale

        this.playerController = this.getStateMachine<PlayerController>();
        this.playerController.setAllowChangeDirection(false)

        this.player = this.playerController.getPlayer();
        this.animationDuration = (this.duration * 50/getFinalSpeed(this.player.stat)) * 0.8
        this.player.animation.playAnimation("roll", {duration: this.animationDuration});
        this.originPosition = {...this.player.getBody().position}
        this.player.sound.playSoundEffect("roll")
        this.speedMultiEffect = EffectFactory.createSpeedMultiplierEffectTimed(this.speedBoostMult, this.speedBoostDuration)
        EffectManager.addEffectsTo(this.player, this.speedMultiEffect)

        this.collisionImmuneEffect = EffectFactory.createCollisionImmuneEffectTimed(this.duration)
        EffectManager.addEffectsTo(this.player, this.collisionImmuneEffect)
        this.useRollEffects()
    }

    public onExit(): void {
        this.playerController.setAllowChangeDirection(true)

        this.timePassed = 0
        if(this.speedMultiEffect) {
            EffectManager.removeEffectFrom(this.player, this.speedMultiEffect)
            this.speedMultiEffect = undefined
        }

        if(this.collisionImmuneEffect){
            EffectManager.removeEffectFrom(this.player, this.collisionImmuneEffect)
        }
    }

    public changeToExitState(){
        let prevStateName = this.playerController.getPrevState()?.getStateName()
        if(prevStateName === "ChargeState" || this.enterChargeStateOnRollFinish){
            this.playerController.changeState("ChargeState")
            this.playerController.getChargeState().setChargeTimeSoFarWithRatio(1)
            this.enterChargeStateOnRollFinish = false
        }else{
            this.playerController.changeState("Idle")
        }
    }

    public update(deltaT: number): void {
        this.timePassed += deltaT

        let currentPosition = this.player.getBody().position
        let distance = MathUtil.distanceSquared(this.originPosition.x, this.originPosition.y, currentPosition.x, currentPosition.y)

        // ******** TODO ************ 
        // Sync roll duration with the player's speed and maxDistance so that the animation plays fully just before max distance is reached

        // if(distance > this.maxDistance){
        //     // console.log("distance exceeded", distance)
        //     this.player.canMove = false
        // }

        // if(this.timePassed >= this.duration || ((distance >= this.maxDistance) && this.timePassed >= this.animationDuration)){
        if(this.timePassed >= this.duration || (distance >= this.maxDistance)){
            this.changeToExitState()
            // this.player.canMove = true
        }
    }
    
    addToMaxDistanceScale(num: number){
        this.maxDistanceScale += num
    }

    addToSpeedBoostScale(num: number){
        this.speedBoostScale += num
    }

    setEnterChargeStateOnRollFinish(toggle: boolean){
        this.enterChargeStateOnRollFinish = toggle
    }

    /** Uses the roll effect logics on the player */
    useRollEffects(){
        EffectManager.useTriggerEffectsOn(this.player, "player dash", this.player.getBody())
    }
}