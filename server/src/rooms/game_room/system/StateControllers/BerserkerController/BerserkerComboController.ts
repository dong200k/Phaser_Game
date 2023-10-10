import Player from "../../../schemas/gameobjs/Player";
import { getFinalAttackSpeed } from "../../Formulas/formulas";
import GameManager from "../../GameManager";
import StateMachine from "../../StateMachine/StateMachine";
import EffectManager from "../../StateManagers/EffectManager";
import PlayerController, { PlayerControllerData } from "../PlayerControllers/PlayerController";
import BerserkerChargeAttackState from "./states/BerserkerChargeAttackState";
import BerserkerChargeState from "./states/BerserkerChargeState";
import BerserkerSpecial from "./states/BerserkerSpecial";
import Combo1 from "./states/Combo1";
import Combo2 from "./states/Combo2";
import Combo3 from "./states/Combo3";

export default class BerserkerComboController extends PlayerController {

    private gameManager!: GameManager
    
    private combos = ["Combo1", "Combo2", "Combo3"]
    /** Holds the states for the combos in order. Init them inside create */
    private comboStates: Combo1[] = []
    /** Inidicates which combos are unlocked and can be used */
    private unlockedCombos = 1
    /** Indicates which combo to use next. Everytime an attack finishes such as 1_atk then currentCombo will be incremented */
    private currentCombo = 0
    /** Maximum time between combos in seconds before reverting to the 1st combo attack */
    private maximumTimeBetweenCombo = 0.5
    private currentTimeBetweenCombo = 0

    protected create(data: PlayerControllerData): void {
        super.create(data)
        this.callStartAttackAnyways = true
        this.gameManager = this.getPlayer().gameManager

        let combo1 = new Combo1("Combo1", this)
        this.addState(combo1)
        this.comboStates.push(combo1)

        let combo2 = new Combo2("Combo2", this)
        this.addState(combo2)
        this.comboStates.push(combo2)

        let combo3 = new Combo3("Combo3", this)
        this.addState(combo3)
        this.comboStates.push(combo3)
        
        this.removeState("ChargeState")
        let chargeState = new BerserkerChargeState("ChargeState", this)
        this.chargeState = chargeState
        this.addState(chargeState)

        this.removeState("ChargeAttack")
        this.chargeAttackState = new BerserkerChargeAttackState("ChargeAttack", this)
        this.addState(this.chargeAttackState)

        this.removeState("Special")
        this.addState(new BerserkerSpecial("Special", this))
        
        this.changeState("Idle")
    }

    public getGameManager() {
        return this.gameManager
    }

    update(deltaT: number){
        super.update(deltaT)
        // Current state is not a combo state
        if(!this.combos.find(combo=>combo === this.stateName)){
            this.currentTimeBetweenCombo += deltaT
            if(this.currentTimeBetweenCombo > this.maximumTimeBetweenCombo){
                this.restartCombo()
                this.resetTimeBetweenCombo()
            }
        }
    }

    /**
     * Berserker controller's start attack just calls all trigger effects on the player directly. And then starts the state based on the combo logic.
     * @param mouseX 
     * @param mouseY 
     */
    public startAttack(mouseX: number, mouseY: number): void {
        if(this.stateName === "Idle" || this.stateName === "Move"){
            this.startCombo(mouseX, mouseY)
            EffectManager.useTriggerEffectsOn(this.getPlayer(), "player attack", this.getPlayer().getBody(), {mouseX, mouseY})
        }      
    }

    public startCombo(mouseX: number, mouseY: number){
        if(this.stateName === "Dead" || this.stateName === "Special"){
            return
        }

        let duration = 1 / getFinalAttackSpeed(this.getPlayer().stat)
        let config = { mouseX, mouseY,
            attackDuration: duration,
            animationDuration: duration,
            canMove: false,
            flip: mouseX < this.getPlayer().getBody().position.x
        }

        // If combo is not unlocked or out of bounds. Start from combo 1
        if(this.currentCombo >= this.unlockedCombos || this.currentCombo >= this.combos.length) {
            this.comboStates[0].setConfig(config)
            this.changeState("Combo1")
            this.currentCombo = 0
            return
        }

        // Attack is still in progress 
        if(this.stateName === this.combos[this.currentCombo]){
            return
        }

        // Use the combo attack
        this.comboStates[this.currentCombo].setConfig(config)
        this.changeState(this.combos[this.currentCombo])
    }

    public incrementCurrentCombo(){
        this.currentCombo ++
    }

    /**
     * Called in an EffectLogic when a player selects an upgrade for their weapon to unlock more combos.
     */
    public incrementUnlockedCombos(){
        this.unlockedCombos ++ 
        // this.currentCombo = this.combos.length // Reset so that the first attack in the combo is used
    }

    /**
     * Set current combo to the first attack in the combo.
     */
    public restartCombo(){
        this.currentCombo = this.combos.length
    }

    public resetTimeBetweenCombo(){
        this.currentTimeBetweenCombo = 0
    }
}