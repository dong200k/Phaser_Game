import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import StateMachine from "../../../StateMachine/StateMachine";
import PlayerManager from "../../../StateManagers/PlayerManager";
import Idle from "../Necromancer/states/Idle";
import Teleport from "../Necromancer/states/Teleport";
import Death from "../simplemonster/Death";
import Attack from "./states/Attack";
import CastSpell from "./states/CastSpell";

export interface MonsterControllerData {
    monster: Monster;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class DeathBringerController extends StateMachine<MonsterControllerData> {

    protected playerManager!: PlayerManager;
    protected monster!: Monster;

    private statesToEnter = ["Teleport", "Attack", "Teleport", "Attack", "Idle", "Teleport", "Attack", "Teleport", "Cast", "Cast", "Idle"]
    private index = 6
    private stayIdleTime = 5
    private idleTimeSoFar = 0

    protected create(data: MonsterControllerData): void {
        this.playerManager = data.monster.gameManager.getPlayerManager();
        this.monster = data.monster;
        
        //Idle state
        let idle = new Idle("Idle", this);
        this.addState(idle);
        //Attack state
        let attack = new Attack("Attack", this);
        this.addState(attack);
        //Death state
        let death = new Death("Death", this);
        this.addState(death);
        
        this.addState(new Teleport("Teleport", this))
        this.addState(new CastSpell("Cast", this))

        //Set initial state
        this.changeState("Idle");
    }

    public postUpdate(deltaT: number): void {
        let currentState = this.getState();
        // If the monster is at zero hp and is not in the Death state, change to the death state.
        if(this.monster.active && this.monster.stat.hp <= 0 && 
            currentState !== null && currentState.getStateName() !== "Death") {
            this.changeState("Death");
        }

        if(this.index >= this.statesToEnter.length) this.index = 0

        // Enter next state
        let nextStateName = this.statesToEnter[this.index]
        if(this.stateName === "Idle"){
            if(nextStateName !== "Idle") {
                this.changeState(nextStateName)
            }
            else {
                this.idleTimeSoFar += deltaT
                if(this.idleTimeSoFar >= this.stayIdleTime) {
                    this.idleTimeSoFar = 0
                    this.index++
                }
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

    public getGameManager() {
        return this.monster.gameManager
    }
}