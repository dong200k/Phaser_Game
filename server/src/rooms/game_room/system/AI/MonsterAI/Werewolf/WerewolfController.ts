import EffectFactory from "../../../../schemas/effects/EffectFactory";
import { ChestRarity } from "../../../../schemas/gameobjs/chest/Chest";
import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import StateMachine from "../../../StateMachine/StateMachine";
import EffectManager from "../../../StateManagers/EffectManager";
import PlayerManager from "../../../StateManagers/PlayerManager";
import Death from "../simplemonster/Death";
import MonsterController from "../simplemonster/MonsterController";
import Attack from "./states/Attack";
import Follow from "./states/Follow";
import Idle from "./states/Idle";

export interface MonsterControllerData {
    monster: Monster;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class WerewolfController extends MonsterController {

    protected playerManager!: PlayerManager;
    protected monster!: Monster;
    private rageTriggered = false
    private attackState?: Attack

    protected create(data: MonsterControllerData): void {
        this.playerManager = data.monster.gameManager.getPlayerManager();
        this.monster = data.monster;
        
        //Idle state
        let idle = new Idle("Idle", this);
        this.addState(idle);
        //Attack state
        this.attackState = new Attack("Attack", this);
        this.addState(this.attackState);
        //Death state
        let death = new Death("Death", this);
        this.addState(death);
        this.addState(new Follow("Follow", this))

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
            let attackSpeedEffect = EffectFactory.createStatEffect({attackSpeed: 3})
            EffectManager.addEffectsTo(this.monster, attackSpeedEffect)
            this.changeState("Idle")
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

    public getDeathChestRarity(): ChestRarity | undefined {
        let randomNum = Math.random()
        if(randomNum>0.99) return "iron"
        else if(randomNum > 0.95) return "wood"
    }
}