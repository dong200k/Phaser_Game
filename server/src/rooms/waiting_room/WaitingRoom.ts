import { Client, Room, matchMaker } from "colyseus";
import State from "./schemas/State";

interface WaitingRoomMetadata {
    inGame: boolean;
    passwordProtected: boolean;
    roomName: string;
}

export default class WaitingRoom extends Room<State> {
    maxClients = 4;

    onCreate() {
        console.log(`Created: Waiting room ${this.roomId}`);
        this.setState(new State());

        this.updateMetadata({
            inGame: false,
            passwordProtected: false,
            roomName: "A Room",
        })

        this.onMessage("start", (client: Client, message: any) => {
            matchMaker.createRoom('game', {}).then((room) => {
                this.broadcast("joinGame", room.roomId);
                this.lock();
                this.updateMetadata({
                    inGame: true,
                    passwordProtected: false,
                    roomName: "A Room",
                })
            }).catch(e => {
                console.log(e);
            })
        })
    }

    updateMetadata(metadata: WaitingRoomMetadata) {
        this.setMetadata(metadata);
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