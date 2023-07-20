import StateMachine from "../../StateMachine/StateMachine";
import Player from "../../../schemas/gameobjs/Player";
import Alive from "./Alive";
import Dead from "./Dead";


export interface PlayerControllerData {
    player: Player;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class PlayerController extends StateMachine<PlayerControllerData> {

    private player!: Player;

    protected create(data: PlayerControllerData): void {
        this.player = data.player;

        //Add States
        let aliveState = new Alive("Alive", this);
        this.addState(aliveState);

        let deadState = new Dead("Dead", this);
        this.addState(deadState);

        //Set initial state
        this.changeState("Alive");
    }

    public postUpdate(deltaT: number): void {
        
    }

    public getPlayer() {
        return this.player;
    }
}