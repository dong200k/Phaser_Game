import Chest, { ChestRarity } from "../../../../schemas/gameobjs/chest/Chest";
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

    protected playerManager!: PlayerManager;
    protected monster!: Monster;
    protected deathChestRarity?: ChestRarity

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

    public getDeathChestRarity(): undefined | ChestRarity{
        return this.deathChestRarity
    }

    public spawnChest(){
        let stateMachine = this
        let monster = stateMachine.getMonster();
        // let rarity = stateMachine.getDeathChestRarity()
        // if(rarity){
        //     monster.gameManager.getChestManager().spawnChest({
        //         rarity,
        //         x: monster.x,
        //         y: monster.y
        //     });
        // }
        let rarity = this.getDeathChestRarity()
        if(!rarity) return
        let rarities: ChestRarity[] = [rarity]
        let offsetX = 100
        let offsetY = 50
        let playerNearbyCount = monster.gameManager.getPlayerManager().getAllPlayersWithinRange(monster.x, monster.y, 1000000).length
        for(let j=0;j<playerNearbyCount;j++){
            rarities.forEach((rarity, i)=>{
                monster.gameManager.getChestManager().spawnChest({
                    rarity,
                    x: monster.x + i*offsetX,
                    y: monster.y + j*offsetY
                });
            })
        }
    }
}