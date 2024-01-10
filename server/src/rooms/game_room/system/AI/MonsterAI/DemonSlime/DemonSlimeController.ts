import { ChestRarity } from "../../../../schemas/gameobjs/chest/Chest";
import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import StateMachine from "../../../StateMachine/StateMachine";
import PlayerManager from "../../../StateManagers/PlayerManager";
import MonsterController from "../simplemonster/MonsterController";
import Attack from "./states/Attack";
import DemonSlimeFollow from "./states/DemonSlimeFollow";
import DemonSlimeIdle from "./states/DemonSlimeIdle";
import Transform from "./states/Transform";

export interface MonsterControllerData {
    monster: Monster;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class DemonSlimeController extends MonsterController {

    protected playerManager!: PlayerManager;
    protected monster!: Monster;
    private transformed = false
    protected deathChestRarity?: ChestRarity | undefined = "iron"

    protected create(data: MonsterControllerData): void {
        super.create(data)
        
        this.removeState("Attack")
        this.removeState("Idle")
        this.removeState("Follow")

        //Attack state
        let attack = new Attack("Attack", this);
        this.addState(attack);
        this.addState(new Transform("Transform", this))
        this.addState(new DemonSlimeIdle("Idle", this))
        this.addState(new DemonSlimeFollow("Follow", this))
        //Set initial state
        this.changeState("Idle");
    }

    public postUpdate(deltaT: number): void {
        let currentState = this.getState();

        if(this.monster.active && this.monster.stat.hp <= 0 && 
            currentState !== null && currentState.getStateName() !== "Death") {
            if(!this.isTransformed()) {
                if(this.stateName !== "Transform") this.changeState("Transform")
            }else{
                this.changeState("Death")
            }
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

    public isTransformed(){
        return this.transformed
    }

    public transform() {
        this.monster.stat.maxHp = 2500
        this.monster.stat.attack = 30
        this.monster.stat.speed = 80
        this.monster.stat.hp = 2500
        this.monster.stat.attackRange = 100
        this.transformed = true
    }
}