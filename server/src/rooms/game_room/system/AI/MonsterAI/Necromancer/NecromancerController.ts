import Cooldown from "../../../../schemas/gameobjs/Cooldown";
import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import StateMachine from "../../../StateMachine/StateMachine";
import PlayerManager from "../../../StateManagers/PlayerManager";
import Death from "../simplemonster/Death";
import MonsterController from "../simplemonster/MonsterController";
import Attack from "./states/Attack";
import Idle from "./states/Idle";
import Summon from "./states/Summon";
import Teleport from "./states/Teleport";

export interface MonsterControllerData {
    monster: Monster;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class NecromancerController extends MonsterController {

    protected playerManager!: PlayerManager;
    protected monster!: Monster;

    private statesToEnter = ["Teleport", "Attack", "Attack", "Attack", "Idle", "Summon", "Idle"]
    private index = 6
    private stayIdleTime = 2
    private idleTimeSoFar = 0
    private summonCooldown = new Cooldown(30)

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
        this.addState(new Summon("Summon", this))

        //Set initial state
        this.changeState("Idle");
        this.monster.sound.playBackgroundMusic("boss_getting_dark")
    }

    public postUpdate(deltaT: number): void {
        this.summonCooldown.tick(deltaT)
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
                if(nextStateName === "summon" && !this.canSummon()) {
                    this.index = 0
                    return
                }
                this.changeState(nextStateName)
                this.index++
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
        let monsterNames = ["MushroomDiamond", "SkeletonDiamond", "FlyingEyeDiamond", "Goblin2Diamond"]
        let choice = Math.floor(Math.random()*monsterNames.length)
        return monsterNames[choice]
    }

    public canSummon() {
        return this.summonCooldown.isFinished
    }

    public turnOnSummonCooldown(){
        this.summonCooldown.reset()
    }
}