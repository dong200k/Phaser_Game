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
import { start } from "repl";


export default class Roll extends StateNode {

    private playerController!: PlayerController;
    private player!: Player;

    /** Duration of roll animation */
    private duration: number = 1
    private timePassed: number = 0
    /** Duration of the speed boost */
    private speedBoostDuration: number = 1
    private speedBoostMult: number = 1
    private originalSpeedBoostMult: number = 1

    /** Distance from rolling origin that player can travel to */
    private originalMaxDistance: number = 100
    private maxDistance: number = 100
    private originPosition = {x: 0, y: 0}
    private speedMultiEffect?: SpeedMultiEffect
    private collisionImmuneEffect?: CollisionImmuneEffect

    /** Duration of roll animation, affected by duration */
    private animationDuration: number = 1

    private rollSpeed = 120

    private speedBoostScale = 1
    private maxDistanceScale = 1

    private enterChargeStateOnRollFinish = false
    protected animationKey = "roll"

    private maxDistanceExceeded = false
    private velX = 1
    private velY = 1

    private distanceTraveled = 0

    public onEnter(): void {
        // console.log(`entering roll state`)
        this.maxDistance = this.originalMaxDistance * this.maxDistanceScale
        this.speedBoostMult = this.originalSpeedBoostMult * this.speedBoostScale

        this.playerController = this.getStateMachine<PlayerController>();
        this.playerController.setAllowChangeDirection(false)

        this.maxDistanceExceeded = false
        this.distanceTraveled = 0
        
        this.player = this.playerController.getPlayer();

        // Compute time to reach max distance
        let estimatedY = this.maxDistance/(this.speedBoostMult * this.rollSpeed)
        // console.log(`estiamted Y: ${estimatedY}`)
        let animationDuration = this.solveEaseOutQuint(estimatedY)
        if(Number.isNaN(animationDuration)) animationDuration = this.duration
        // console.log(`estimated aniamtion duration: ${animationDuration}`)s

        this.setDirection(this.player.velocity.x, this.player.velocity.y)
        this.animationDuration = (this.duration * 50/getFinalSpeed(this.player.stat)) * 0.8
        this.player.animation.playAnimation(this.animationKey, {duration: animationDuration});
        this.originPosition = {...this.player.getBody().position}
        this.player.sound.playSoundEffect("roll")
        // this.speedMultiEffect = EffectFactory.createSpeedMultiplierEffectTimed(this.speedBoostMult, this.speedBoostDuration)
        // EffectManager.addEffectsTo(this.player, this.speedMultiEffect)

        this.collisionImmuneEffect = EffectFactory.createCollisionImmuneEffectTimed(this.duration)
        EffectManager.addEffectsTo(this.player, this.collisionImmuneEffect)
        this.useRollEffects()
        this.player.canMove = false
    }

    public onExit(): void { 
        // console.log("roll on exit")
        this.playerController.setAllowChangeDirection(true)
        this.player.canMove = true

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
        let distance = this.distanceTraveled

        // ******** TODO ************ 
        // Sync roll duration with the player's speed and maxDistance so that the animation plays fully just before max distance is reached

        if(!this.maxDistanceExceeded && distance > this.maxDistance){
            // console.log("distance exceeded", distance, `time: ${this.timePassed}`)
            this.maxDistanceExceeded = true
            // console.log(`max distance, dash end duration: ${this.duration - this.timePassed}`)
            // this.player.animation.playAnimation("dash_end", {
            //     duration: this.duration - this.timePassed
            // })
        }

        // if(this.timePassed >= this.duration || ((distance >= this.maxDistance) && this.timePassed >= this.animationDuration)){
        if(this.timePassed >= this.duration * 0.85 || (distance >= this.maxDistance)){
            this.changeToExitState()
            this.player.canMove = true
        }

        // Update player position with easing function
        let body = this.player.getBody()
        // let movementSpeed = getFinalSpeed(this.player.stat)
        let movementSpeed = this.rollSpeed * this.speedBoostMult    
        let distanceToMove = this.getDistanceToMove(movementSpeed, deltaT)
        this.distanceTraveled += distanceToMove
        let unitDir = MathUtil.getNormalizedSpeed(this.velX, this.velY, 1)
        let newPos = {x: body.position.x + unitDir.x * distanceToMove, y: body.position.y + unitDir.y * distanceToMove}
        Matter.Body.setPosition(body, newPos)
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

    setAnimationKey(key: string){
        this.animationKey = key
    }

    maxDistanceReached(){
        return this.maxDistanceExceeded
    }

    setDirection(velX: number, velY: number){
        this.velX = velX
        this.velY = velY
    }

    // Very fast at the start
    easeOutQuint(x: number): number {
        return 1 - Math.pow(1 - x, 5);
    }

    /**
     * solves for x
     * @param y 
     */
    solveEaseOutQuint(y: number) {
        return 1 - Math.pow((1 - y), 1/5)
    }
    
    // A little slower at the start
    easeOutCubic(x: number): number {
        return 1 - Math.pow(1 - x, 3);
    }

    getDistanceToMove(movementSpeed: number, deltaT: number){
        let startX = this.timePassed/this.duration
        let endX = (this.timePassed + deltaT)/this.duration
        let diff = this.easeOutQuint(endX) - this.easeOutQuint(startX)
        return diff * movementSpeed
    }

    canAnimationCancel(){
        return this.timePassed >= this.duration * 0.5
    }

    canDoubleRoll(){
        let canDoubleRoll = this.timePassed >= this.duration * 0.2
        // console.log(`can double roll: ${canDoubleRoll}, percentage: ${Math.round(100 * this.timePassed/this.duration)}`)
        return canDoubleRoll
    }
}