import Entity from "../../../../schemas/gameobjs/Entity";
import StateMachine from "../../../StateMachine/StateMachine";
import PlayerManager from "../../../StateManagers/PlayerManager";
import Idle from "./Idle";

export interface MonsterControllerData {
    playerManager: PlayerManager;
    monster: Entity;
}

export default class MonsterController extends StateMachine<MonsterControllerData> {

    private playerManager!: PlayerManager;
    private monster!: Entity;

    protected create(data: MonsterControllerData): void {
        this.playerManager = data.playerManager;
        this.monster = data.monster;

        //Idle state
        let idle = new Idle("Idle", this);
        this.addState(idle);
        //Follow state
        //let follow = new F
        
    }

    public getPlayerManager() {
        return this.playerManager;
    }

    public getMonster() {
        return this.monster;
    }
}