import { Client, Room, RoomListingData, matchMaker } from "colyseus";
import State from "./schemas/State";
import globalEventEmitter from "../../util/EventUtil";

interface WaitingRoomMetadata {
    inGame: boolean;
    passwordProtected: boolean;
    roomName: string;
}

export default class WaitingRoom extends Room<State, WaitingRoomMetadata> {
    maxClients = 4;

    onCreate() {
        console.log(`Created: Waiting room ${this.roomId}`);
        this.setState(new State());

        this.setMetadata({
            inGame: false,
            passwordProtected: false,
            roomName: "A Room",
        })

        this.onMessage("start", (client: Client, message: any) => {
            matchMaker.createRoom('game', {}).then((room) => {
                this.onCreateGameRoom(room);
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

    public onCreateGameRoom(room: RoomListingData) {
        this.lock();
        this.broadcast("joinGame", room.roomId);
        this.setMetadata({ inGame: true })
        globalEventEmitter.once(`GameFinished${room.roomId}`, () => this.onGameRoomDispose());
    }

    public onGameRoomDispose() {
        this.unlock();
        this.setMetadata({ inGame: false });
    }
}