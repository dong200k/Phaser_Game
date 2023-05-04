import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import StateMachine from "../../../StateMachine/StateMachine";
import PlayerManager from "../../../StateManagers/PlayerManager";
import Follow from "./Follow";
import Idle from "./Idle";

export interface MonsterControllerData {
    playerManager: PlayerManager;
    monster: Monster;
}

export default class MonsterController extends StateMachine<MonsterControllerData> {

    private playerManager!: PlayerManager;
    private monster!: Monster;

    protected create(data: MonsterControllerData): void {
        this.playerManager = data.playerManager;
        this.monster = data.monster;

        //Idle state
        let idle = new Idle("Idle", this);
        this.addState(idle);
        //Follow state
        let follow = new Follow("Follow", this);
        this.addState(follow);

        //Set initial state
        this.changeState("Idle");
        
    }

    public getPlayerManager() {
        return this.playerManager;
    }

    public getMonster() {
        return this.monster;
    }
}