import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import StateMachine from "../../../StateMachine/StateMachine";
import PlayerManager from "../../../StateManagers/PlayerManager";
import Attack from "./Attack";
import Death from "./Death";
import Follow from "./Follow";
import Idle from "./Idle";

export interface MonsterControllerData {
    monster: Monster;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class MonsterController extends StateMachine<MonsterControllerData> {

    private playerManager!: PlayerManager;
    private monster!: Monster;

    protected create(data: MonsterControllerData): void {
        this.playerManager = data.monster.gameManager.getPlayerManager();
        this.monster = data.monster;

        //Idle state
        let idle = new Idle("Idle", this);
        this.addState(idle);
        //Follow state
        let follow = new Follow("Follow", this);
        this.addState(follow);
        //Attack state
        let attack = new Attack("Attack", this);
        this.addState(attack);
        //Death state
        let death = new Death("Death", this);
        this.addState(death);

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

        // Remove the aggroTarger if it is dead
        let aggroTarget = this.monster.getAggroTarget();
        if(aggroTarget?.isDead()) {
            this.monster.setAggroTarget(null);
        }
    }

    public getPlayerManager() {
        return this.playerManager;
    }

    public getMonster() {
        return this.monster;
    }
}