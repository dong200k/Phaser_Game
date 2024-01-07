import MathUtil from "../../../../../../util/MathUtil";
import Cooldown from "../../../../schemas/gameobjs/Cooldown";
import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import { getFinalAttackRange } from "../../../Formulas/formulas";
import StateMachine from "../../../StateMachine/StateMachine";
import PlayerManager from "../../../StateManagers/PlayerManager";
import Death from "../simplemonster/Death";
import Idle from "../simplemonster/Idle";
import MonsterController from "../simplemonster/MonsterController";
import FireBreath from "./states/FireBreath";
import FlameCharge from "./states/FlameCharge";
import Follow from "./states/Follow";
import MeleeAttack from "./states/MeleeAttack";
import Meteor from "./states/Meteor";

export interface MonsterControllerData {
    monster: Monster;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class DragonController extends MonsterController {

    protected playerManager!: PlayerManager;
    protected monster!: Monster;

    private statesToEnter = [
        {stateName: "Idle", cooldown: new Cooldown(5)}, 
        {stateName: "FlameCharge", cooldown: new Cooldown(5)}, 
        {stateName: "FlameCharge", cooldown: new Cooldown(5)}, 
        {stateName: "FireBreath", cooldown: new Cooldown(5)}, 
        {stateName: "Follow", cooldown: new Cooldown(10)}, 
        {stateName: "FireBreath", cooldown: new Cooldown(5)}, 
        {stateName: "Meteor", cooldown: new Cooldown(5)}
    ]
    private index = 6
    private stayIdleTime = 5
    private idleTimeSoFar = 0
    private meleeAttackTime = 5
    private meleeAttackTimeSoFar = 0

    protected create(data: MonsterControllerData): void {
        this.playerManager = data.monster.gameManager.getPlayerManager();
        this.monster = data.monster;
        
        //Idle state
        let idle = new Idle("Idle", this);
        this.addState(idle);
        //Attack state
        let attack = new MeleeAttack("Attack", this);
        this.addState(attack);
        //Death state
        let death = new Death("Death", this);
        this.addState(death);

        this.addState(new Meteor("Meteor", this))
        this.addState(new FireBreath("FireBreath", this))
        this.addState(new FlameCharge("FlameCharge", this))
        this.addState(new Follow("Follow", this))

        //Set initial state
        this.changeState("Idle");
        this.monster.sound.playBackgroundMusic("boss_getting_dark")
    }

    public postUpdate(deltaT: number): void {
        let currentState = this.getState();
        // If the monster is at zero hp and is not in the Death state, change to the death state.
        if(this.monster.active && this.monster.stat.hp <= 0 && 
            currentState !== null && currentState.getStateName() !== "Death") {
            this.monster.sound.stopMusic("boss_getting_dark")
            this.changeState("Death");
        }

        // Enter next state if prev state is finished
        if(this.index >= this.statesToEnter.length) this.index = 0
        let nextStateName = this.statesToEnter[this.index].stateName
        let prevStateCooldown = this.statesToEnter[this.index - 1>0? this.index-1 : this.statesToEnter.length-1].cooldown
        prevStateCooldown.tick(deltaT)
        if(prevStateCooldown.isFinished) {
            prevStateCooldown.reset()
            this.changeState(nextStateName)
            this.index++
        }

        let target = this.monster.getAggroTarget()
        this.meleeAttackTimeSoFar += deltaT
        if(target && this.meleeAttackTime <= this.meleeAttackTimeSoFar){
            let distance = MathUtil.distance(target.x, target.y, this.monster.x, this.monster.y)
            let attackRange = getFinalAttackRange(this.monster.stat, 1)
            if(this.stateName === "Idle" && distance <= attackRange){
                this.changeState("Attack")
                this.meleeAttackTimeSoFar = 0
            }
        }
    }

    public getPlayerManager() {
        return this.playerManager;
    }

    public getMonster() {
        return this.monster;
    }

    public getSummonedMonsterName() {
        return ""
    }
}