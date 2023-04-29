import Entity from "../../../../schemas/gameobjs/Entity";
import StateMachine from "../../../StateMachine/StateMachine";
import PlayerManager from "../../../StateManagers/PlayerManager";

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

        
    }

    public getPlayerManager() {
        return this.playerManager;
    }

    public getMonster() {
        return this.monster;
    }
}