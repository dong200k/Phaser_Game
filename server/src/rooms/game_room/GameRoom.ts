import { Client, Room, matchMaker } from "colyseus";
import State from "./schemas/State";
import GameManager from "./system/GameManager";

export default class GameRoom extends Room<State> {
    autoDispose = false;
    
    private gameManager: GameManager | null = null;

    onCreate() {
        console.log(`Created: Game room ${this.roomId}`);
        //Game rooms are private and can only be joined by id.
        this.setPrivate(true);
        //If no one joins the game room, dispose it.
        setTimeout(() => this.autoDispose = true, 5000);
        //Setting up state and game manager.
        let state = new State();
        this.gameManager = new GameManager(state);
        this.setState(state);
    }

    onJoin(client: Client) {
        // Add a new player to the room state. The first player is the owner of the room.
        this.gameManager?.createPlayer(client.sessionId, this.gameManager?.playerCount() === 0);
    }

    onLeave(client: Client) {
        this.gameManager?.removePlayer(client.sessionId);
    }

    onDispose() {
        console.log(`Disposed: Game room ${this.roomId}`);
    }

    startGame() {

    }
}