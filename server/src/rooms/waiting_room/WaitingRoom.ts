import { Client, Room, matchMaker } from "colyseus";
import State from "./schemas/State";

export default class WaitingRoom extends Room<State> {
    maxClients = 4;

    onCreate() {
        console.log(`Created: Waiting room ${this.roomId}`);
        this.setState(new State());
        this.onMessage("start", (client: Client, message: any) => {
            // if(client.sessionId === this.state.ownerSessionId) {
            //     this.broadcast("joinRoom", message.roomId);
            // }
            matchMaker.createRoom('game', {}).then((room) => {
                this.broadcast("joinGame", room.roomId);
                this.lock();
            }).catch(e => {
                console.log(e);
            })
        })
    }
    
    onJoin(client: Client) {
        // Add a new player to the room state. The first player is the owner of the room.
        this.state.createPlayer(client.sessionId, this.state.playerCount() === 0);
    }

    onLeave(client: Client) {
        this.state.removePlayer(client.sessionId);
    }

    onDispose() {
        console.log(`Disposed: Waiting room ${this.roomId}`);
    }

    startGame() {

    }
}