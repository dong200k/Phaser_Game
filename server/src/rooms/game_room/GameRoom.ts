import { Client, Room, matchMaker } from "colyseus";
import State from "./schemas/State";

export default class GameRoom extends Room<State> {
    autoDispose = false;

    onCreate() {
        console.log(`Created: Game room ${this.roomId}`);
        this.setPrivate(true);
        setTimeout(() => this.autoDispose = true, 5000);
    }

    onJoin(client: Client) {
        // Add a new player to the room state. The first player is the owner of the room.
        this.state.createPlayer(client.sessionId, this.state.playerCount() === 0);
    }

    onLeave(client: Client) {
        this.state.removePlayer(client.sessionId);
    }

    onDispose() {
        console.log(`Disposed: Game room ${this.roomId}`);
    }

    startGame() {

    }
}