import EffectFactory from "../../../../schemas/effects/EffectFactory";
import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import StateMachine from "../../../StateMachine/StateMachine";
import EffectManager from "../../../StateManagers/EffectManager";
import PlayerManager from "../../../StateManagers/PlayerManager";
import Death from "../simplemonster/Death";
import Attack from "./states/Attack";
import Idle from "./states/Idle";

export interface MonsterControllerData {
    monster: Monster;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class WerewolfController extends StateMachine<MonsterControllerData> {

    protected playerManager!: PlayerManager;
    protected monster!: Monster;
    private rageTriggered = false

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

        if(this.monster.stat.hp < this.monster.stat.maxHp * 0.3 && !this.rageTriggered) {
            this.rageTriggered = true
            let speedEffect = EffectFactory.createSpeedMultiplierEffectUntimed(2)
            EffectManager.addEffectsTo(this.monster, speedEffect)
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

    public isEnraged(){
        return this.rageTriggered
    }
}