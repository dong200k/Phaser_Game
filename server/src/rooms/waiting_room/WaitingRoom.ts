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
    waitingRoomDisposed = false;

    onCreate() {
        console.log(`Created: Waiting room ${this.roomId}`);
        this.setState(new State());

        this.state.maxPlayerCount = this.maxClients;

        this.setMetadata({
            inGame: false,
            passwordProtected: false,
            roomName: "A Room",
        })

        this.onMessage("start", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player && player.isLeader && !this.state.inGame && this.isEveryoneReady()) {
                matchMaker.createRoom('game', {}).then((room) => {
                this.onCreateGameRoom(room);
                }).catch(e => {
                    console.log(e);
                })
            }
        })

        this.onMessage("ready", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player && !this.state.inGame) player.isReady = true;
        })

        this.onMessage("unready", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player && !this.state.inGame) player.isReady = false;
        })

        this.onMessage("changeRole", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player && !this.state.inGame) player.role = message;
        })

        this.onMessage("changePet", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player && !this.state.inGame) player.pet = message;
        })

        this.onMessage("changeDungeon", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player && player.isLeader) {
                if(!this.state.inGame) this.state.dungeon = message;
            } else {
                this.send(client, "serverMessage", "Only the leader can change the dungeon!");
            }
        })

        this.onMessage("playerMessage", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player) {
                this.broadcast("playerMessage", {
                    name: player.name,
                    message: message
                })
            }
        })
    }
    
    onJoin(client: Client) {
        // Add a new player to the room state. The first player is the owner of the room.
        this.state.createPlayer(client.sessionId, this.state.playerCount() === 0);
        let player = this.state.players.get(client.sessionId);
        if(player) {
            this.broadcast("serverMessage", `${player.name} has joined the room.`)
        }
    }

    onLeave(client: Client) {
        this.state.removePlayer(client.sessionId);
        if(client.sessionId === this.state.leaderSessionId) this.chooseNextLeader();
    }

    onDispose() {
        this.waitingRoomDisposed = true;
        console.log(`Disposed: Waiting room ${this.roomId}`);
    }

    /**
     * When the game room is created, lock the waiting room, sends the gameroom id to 
     * all current players in the waiting room, and marks the waiting room as inGame.
     * @param room The game room.
     */
    public onCreateGameRoom(room: RoomListingData) {
        this.lock();
        this.broadcast("joinGame", room.roomId);
        this.setMetadata({ inGame: true })
        this.state.inGame = true;
        globalEventEmitter.once(`GameFinished${room.roomId}`, () => this.onGameRoomDispose());
    }

    /**
     * When the game room is disposed, unlock the waiting room and mark it as not inGame.
     */
    public onGameRoomDispose() {
        // If the waiting room is already disposed don't change its state (causes null pointer).
        if(!this.waitingRoomDisposed) {
            this.unlock();
            this.setMetadata({ inGame: false });
            this.state.inGame = false;
        }
    }

    public chooseNextLeader() {
        if(this.state.playerJoinOrder.length > 0) {
            let nextLeaderSID = this.state.playerJoinOrder[0];
            this.setLeader(nextLeaderSID);
        }
    }

    /**
     * Sets a new leader.
     * @param sessionId The sessionId of the player.
     */
    public setLeader(sessionId: string) {
        if(sessionId === this.state.leaderSessionId || 
            this.state.players.get(sessionId) === undefined) return;

        //Unassign previous leader.
        let previousLeaderSID = this.state.leaderSessionId;
        let previousLeader = this.state.players.get(previousLeaderSID);
        if(previousLeader !== undefined) previousLeader.isLeader = false;
        
        //Assign new leader.
        this.state.leaderSessionId = sessionId;
        let newLeader = this.state.players.get(sessionId);
        if(newLeader) newLeader.isLeader = true;
    }

    /**
     * Checks if everyone is ready or not. 
     * @returns True if everyone is ready. False otherwise.
     */
    public isEveryoneReady() {
        let ready = true;
        this.state.players.forEach((player) => {
            if(!player.isLeader && !player.isReady) ready = false;
        })
        return ready;
    }
}