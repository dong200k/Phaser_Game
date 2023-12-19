import StateMachine from "../../StateMachine/StateMachine";
import Player from "../../../schemas/gameobjs/Player";
import Idle from "./CommonStates/Idle";
import Dead from "./CommonStates/Dead";
import Attack from "./CommonStates/Attack";
import Move from "./CommonStates/Move";
import Special from "./CommonStates/Special";
import ChargeAttack from "./CommonStates/ChargeAttack";
import TriggerUpgradeEffect from "../../../schemas/effects/trigger/TriggerUpgradeEffect";
import { getEstimatedDps, getFinalAttackCooldown, getFinalAttackSpeed, getFinalChargeAttackSpeed } from "../../Formulas/formulas";
import ChargeAttackLogic from "../../EffectLogic/EffectLogics/common/ChargeAttackLogic";
import ChargeState from "./CommonStates/ChargeState";
import Roll from "./CommonStates/Roll";
import Stat from "../../../schemas/gameobjs/Stat";
import Cooldown from "../../../schemas/gameobjs/Cooldown";
import MathUtil from "../../../../../util/MathUtil";


export interface PlayerControllerData {
    player: Player;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class PlayerController extends StateMachine<PlayerControllerData> {

    protected player!: Player;

    protected attackState!: Attack;
    protected specialState!: Special;
    private rollState!: Roll;
    protected chargeState!: ChargeState;
    public chargeAttackState!: ChargeAttack;

    /** If this is set to true start attack will be called regardless of if there are effects on the player
     * or if the effects cooldown are finished. Created this so that combo attacks go through when using another controller that extends the PlayerController e.g. berserker controller.
     */
    public callStartAttackAnyways: boolean = false

    private currentlyCharging: boolean = false
    private timeSoFar: number = 0
    private healthRegenTime: number = 1
    public allowChangeDirection = true
    private rollCooldown = new Cooldown(0.5)

    private attackCooldown!: Cooldown

    protected create(data: PlayerControllerData): void {
        this.player = data.player;
        // let chargeAttackSpeed = getFinalChargeAttackSpeed(this.player.stat)
        // if(chargeAttackSpeed > 0) this.totalChargeTime *= 1 / chargeAttackSpeed

        this.attackCooldown = new Cooldown(getFinalAttackCooldown(this.player.stat))

        //Add States
        let idleState = new Idle("Idle", this);
        this.addState(idleState);
        
        let attackState = new Attack("Attack", this);
        this.addState(attackState);
        this.attackState = attackState;
        attackState.setConfig({
            canMove: false,
            triggerPercent: 0,
            // attackDuration: 1 / getFinalAttackSpeed(this.player.stat) - 0.5,
            attackDuration: 200
        });

        let moveState = new Move("Move", this);
        this.addState(moveState);

        let deadState = new Dead("Dead", this);
        this.addState(deadState);

        let specialState = new Special("Special", this)
        this.specialState = specialState
        specialState.setConfig({
            canMove: false,
            triggerPercent: 0,
        })
        this.addState(specialState)

        let chargeAttackState = new ChargeAttack("ChargeAttack", this);
        this.chargeAttackState = chargeAttackState
        this.addState(chargeAttackState)

        let chargeState = new ChargeState("ChargeState", this)
        this.chargeState = chargeState
        this.addState(chargeState)

        this.rollState = new Roll("Roll", this)
        this.addState(this.rollState)

        //Set initial state
        this.changeState("Idle");
    }

    public postUpdate(deltaT: number): void {
        // console.log(`Player attack power ${getEstimatedDps(this.player.stat)}`)
        let currentState = this.getState();
        // If the player has 0 hp, change to the death state.
        if(this.player.active && this.player.stat.hp <= 0 && 
            currentState !== null && currentState.getStateName() !== "Dead") {
            this.changeState("Dead");
        }

        // Health regen
        if(currentState?.getStateName() !== "Dead"){
            this.timeSoFar += deltaT
            if(this.timeSoFar >= this.healthRegenTime){
                this.timeSoFar = 0
                this.player.stat.add(new Stat({hp: this.player.stat.healthRegen}))
            }
        }

        // Rool cooldown
        if(this.stateName !== "Roll"){
            this.rollCooldown.tick(deltaT)
        }

        // Testing auto attack 
        this.attackCooldown.tick(deltaT)
        if(this.attackCooldown.isFinished){
            this.attackCooldown.reset()
            this.attackCooldown.setTime(getFinalAttackCooldown(this.player.stat))
            let mousePos = {x: 0, y: 0}
            let closestMonster = this.player.gameManager.getDungeonManager().getClosestActiveMonster(this.player.getBody().position)
            
            if(closestMonster) {
                mousePos = closestMonster.getBody().position
                this.startAttack(mousePos.x, mousePos.y)
            }
        }
        
    }

    public putRollOnCooldown(){
        this.rollCooldown.reset()
    }

    public getPlayer() {
        return this.player;
    }

    /**
     * Takes in a value true or false which determines whether the player can move or not.
     * @param val 
     */
    public setAllowChangeDirection(val: boolean){
        // console.log(`allow change direction: ${val}`)
        this.allowChangeDirection = val
    }

    public processMouseInput(mouseClick: number, mouseDown: number, mouseX:number, mouseY:number){
        if(!this.player) return

        // If the state is not idle/move/charge then it must be a combo/attack state in which case return
        if(this.stateName !== "Idle" && this.stateName !== "Move" && this.stateName !== "ChargeState") return

        // Check if player has any charge attacks
        let hasChargeAttack = false
        this.player?.effects.forEach(e=>{
            if(e instanceof TriggerUpgradeEffect && e.type === "player charge attack"){
                hasChargeAttack = true
            }
        })
        
        // Start charge attack if there is mouse click and any of the charge threshold is met
        if(mouseClick && hasChargeAttack && this.chargeState.chargeThresholdMetFor1Attack()){
            this.chargeState.startChargeAttack(mouseX, mouseY)
            return
        }

        // Switch to charge state if mouse is down and there is charge attack
        if(mouseDown && hasChargeAttack){
            // Set config for charge state
            this.chargeState.setConfig({mouseClick, mouseX, mouseY})

            if(this.stateName !== "ChargeState") this.changeState("ChargeState")
            return
        }

        // Holding the mouse down will activate the player's attack if they dont have charge attack. Mouse click will activate player attack regardless.
        if(mouseDown || mouseClick){
            if(mouseClick && this.stateName === "ChargeState") {
                this.changeState("Idle")
            }

            // If an attack is off cooldown
            this.player.effects.forEach((effect) => {
                if(effect instanceof TriggerUpgradeEffect && effect.type === "player attack") {
                    if (effect.cooldown.isFinished) {
                        this.startAttack(mouseX, mouseY);
                        return
                    }
                }
            })

            // For combo attacks that dont use EffectLogic with combos directly on the controller.
            if(this.callStartAttackAnyways) this.startAttack(mouseX, mouseY)
        }
    }

    /** Changes this player's state to attack, but only if the 
     * player is not dead, using special or attacking already.
     */
    public startAttack(mouseX:number, mouseY:number) {
        if(this.stateName !== "Dead" && this.stateName !== "Attack" && this.stateName !== "Special") {
            this.attackState?.setConfig({mouseX, mouseY});
            this.changeState("Attack");
        }
    }

    /** Changes this player's state to special, but only if the 
     * player is not dead or using special already.
     */
    public startSpceial(mouseX:number, mouseY:number) {
        if(this.stateName !== "Dead" && this.stateName !== "Special") {
            console.log("start special")
            this.specialState?.setConfig({mouseX, mouseY});
            this.changeState("Special");
        }
    }

    public startRoll(key: "w"|"a"|"s"|"d"){
        if(this.rollCooldown.isFinished && this.stateName !== "Dead" && this.stateName !== "Special" && this.stateName !== "Roll"){
            this.putRollOnCooldown()
            this.changeState("Roll")
        }
    }

    /**
     * 
     * @param speedBoostPercent Number to add to roll state's speedBoostScale
     * @param maxDistancePercent Number to add to roll state's maxDistanceScale
     */
    public upgradeRoll(speedBoostPercent: number, maxDistancePercent: number){
        this.rollState.addToMaxDistanceScale(maxDistancePercent)
        this.rollState.addToSpeedBoostScale(speedBoostPercent)
    }

    public getChargeState(){
        return this.chargeState
    }

    public getRollState(){
        return this.rollState
    }
}