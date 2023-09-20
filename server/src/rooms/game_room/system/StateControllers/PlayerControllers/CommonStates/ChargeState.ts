import TriggerUpgradeEffect from "../../../../schemas/effects/trigger/TriggerUpgradeEffect";
import Player from "../../../../schemas/gameobjs/Player";
import ChargeAttackLogic from "../../../EffectLogic/EffectLogics/common/ChargeAttackLogic";
import { getFinalChargeAttackSpeed } from "../../../Formulas/formulas";
import StateMachine from "../../../StateMachine/StateMachine";
import StateNode from "../../../StateMachine/StateNode";
import EffectManager from "../../../StateManagers/EffectManager";
import PlayerController from "../PlayerController";

interface ChargeAttackConfig {
    /** Can the player move while charging. */
    canMove?: boolean;
    mouseX?: number;
    mouseY?: number;
    mouseClick?: number;
}

/** This states handle the charging logic, when to start charge attack and when to play charging animations */
export default class ChargeState extends StateNode {

    protected playerController!: PlayerController;
    protected player!: Player;

    /** Can the player move when attacking. */
    protected canMove: boolean = false;

    protected timePassed: number = 0;
    protected mouseX: number = 0;
    protected mouseY: number = 0;
    protected mouseClick: number = 0;

    public chargeTimeSoFar = 0
    public totalChargeTime = 10000
    public originalTotalChargeTime = 10000

    /**
     * Initialize this attack with some values.
     * @param config The AttackConfig.
     */
    public setConfig(config?: ChargeAttackConfig) {
        if(config) {
            this.canMove = config.canMove ?? false;
            this.mouseX = config.mouseX ?? this.mouseX;
            this.mouseY = config.mouseY ?? this.mouseY;
            this.mouseClick = config.mouseClick ?? this.mouseClick
        }
    }

    public onEnter(): void {
        this.playerController = this.getStateMachine<PlayerController>();
        this.player = this.playerController.getPlayer();
        this.timePassed = 0;
        let chargeAttackSpeed = getFinalChargeAttackSpeed(this.player.stat)
        if(chargeAttackSpeed > 0) this.totalChargeTime = this.originalTotalChargeTime / getFinalChargeAttackSpeed(this.player.stat)
        
        // this.player.canMove = this.canMove;

        // Checks if the player's sprite should flip or not.
        let flip = (this.player.x - this.mouseX) > 0;

        // this.player.animation.playAnimation("attack", {
        //     duration: this.attackDuration,
        //     flip: flip,
        // });
    }

    public onExit(): void {
        this.player.canMove = true;
        this.chargeTimeSoFar = 0
    }

    public update(deltaT: number): void {
        this.timePassed += deltaT;

        this.chargeTimeSoFar += deltaT * 1000
        // console.log(`charge ratio: ${this.chargeTimeSoFar/this.totalChargeTime}`)

        this.handleChargeAnimation(deltaT)
    }
    
    /**
     * Controls when to play a charge animation.
     * 
     * Overwrite this and assign a new ChargeState that extends this state to your specific controller such as the BerserkerController,
     * for playing custom charge animation.
     */
    public handleChargeAnimation(deltaT: number){
    }

    public startChargeAttack(mouseX: number, mouseY: number){
        this.playerController.chargeAttackState.setConfig({mouseX, mouseY, chargeRatio: this.chargeTimeSoFar/this.totalChargeTime})
        this.playerController.changeState("ChargeAttack")
    }

    /**
     * Returns true if the charge threshold is met for any charge attack on the player this controller is attached to.
     */
    public chargeThresholdMetFor1Attack(){
        let thresholdMet = false
        this.player?.effects.forEach(e=>{
            if(e instanceof TriggerUpgradeEffect && 
                e.effectLogic &&
                e.effectLogic instanceof ChargeAttackLogic &&
                e.effectLogic.chargeThresholdReached(this.chargeTimeSoFar / this.totalChargeTime)
            ){
                thresholdMet = true
                return true
            }
        })
        return thresholdMet
    }
}