import { Client, Room, RoomListingData, matchMaker } from "colyseus";
import State from "./schemas/State";
import globalEventEmitter from "../../util/EventUtil";
import FileUtil from "../../util/FileUtil";
import DungeonService from "../../services/DungeonService";

interface WaitingRoomMetadata {
    inGame: boolean;
    passwordProtected: boolean;
    roomName: string;
}

interface DungeonData {
    id: string;
    name: string;
}

/** The WaitingRoom is a room players join before starting a game. 
 * In this room players can choose their role, pet, and dungeon. 
 * They can also chat with other players in the room.
 */
export default class WaitingRoom extends Room<State, WaitingRoomMetadata> {

    maxClients = 4;
    waitingRoomDisposed = false;

    dungeonData: DungeonData[] = [];

    onCreate() {
        console.log(`Created: Waiting room ${this.roomId}`);
        this.setState(new State());

        this.state.maxPlayerCount = this.maxClients;

        this.setMetadata({
            inGame: false,
            passwordProtected: false,
            roomName: "A Room",
        })

        // Message received from the room leader to start the game.
        this.onMessage("start", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player && player.isLeader) {
                console.log("inGame: ", this.state.inGame);
                if(this.isEveryoneReady()) {
                    if(this.state.inGame) {
                        client.send("serverMessage", "Game already in session!");
                    } else {
                        // Handle incorrect dungeon choice.
                        let dungeonSelected = this.state.dungeon;
                        let dungeonExist = false;
                        this.dungeonData.forEach((data) => {
                            if(data.id === dungeonSelected) dungeonExist = true;
                        })
                        if(dungeonExist) {
                            matchMaker.createRoom('game', {dungeonSelected: this.state.dungeon}).then((room) => {
                                this.onCreateGameRoom(room);
                            }).catch(e => {
                                console.log(e);
                            })
                        } else {
                            client.send("serverMessage", `Error: Dungeon with id ${dungeonSelected} does not exist!`);
                        }
                    }
                } else {
                    client.send("serverMessage", "All players need to be ready to start game!");
                }
            }
        })

        // Message received from a player to ready up.
        this.onMessage("ready", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player && !this.state.inGame) player.isReady = true;
        })

        // Message received from a player to unready.
        this.onMessage("unready", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player && !this.state.inGame) player.isReady = false;
        })

        // Message received from a player to change their role.
        this.onMessage("changeRole", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player && !this.state.inGame) player.role = message;
        })

        // Message received from a player to change their pet.
        this.onMessage("changePet", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player && !this.state.inGame) player.pet = message;
        })

        // Message received from a player to change the dungeon. Only leaders can change the dungeon.
        this.onMessage("changeDungeon", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player && player.isLeader) {
                if(!this.state.inGame) this.state.dungeon = message;
            } else {
                client.send("serverMessage", "Only the leader can change the dungeon!");
            }
        })

        // Chatting system.
        this.onMessage("playerMessage", (client: Client, message: any) => {
            let player = this.state.players.get(client.sessionId);
            if(player) {
                this.broadcast("playerMessage", {
                    name: player.name,
                    message: message
                })
            }
        })

        // ----- loading dungeon data -----
        // FileUtil.readJSONAsync("assets/tilemaps/dungeon.json").then(data => {
        //     data.forEach((dungeon: any) => {
        //         this.dungeonData.push({
        //             id: dungeon.id,
        //             name: dungeon.name,
        //         })
        //     });
        //     this.broadcast("dungeonData", this.dungeonData);
        //     this.state.dungeon = this.dungeonData[0].name;
        // });

        DungeonService.getAllDungeons().then(res => {
            return res.json();
        }).then(data => {
            data.dungeons.forEach((dungeon:any) => {
                this.dungeonData.push({
                    id: dungeon.name,
                    name: dungeon.name,
                })
            })
            this.broadcast("dungeonData", this.dungeonData);
            this.state.dungeon = this.dungeonData[0].name;
        })


    }
    
    onJoin(client: Client) {
        // Add a new player to the room state. The first player is the owner of the room.
        this.state.createPlayer(client.sessionId, this.state.playerCount() === 0);
        let player = this.state.players.get(client.sessionId);
        if(player) {
            this.broadcast("serverMessage", `${player.name} has joined the room.`);
            client.send("dungeonData", this.dungeonData);
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
        this.setMetadata({ inGame: true })
        this.state.inGame = true;
        this.broadcast("joinGame", room.roomId);
        globalEventEmitter.once(`GameFinished${room.roomId}`, () => this.onGameRoomDispose());
    }

    /**
     * When the game room is disposed, unlock the waiting room and mark it as not inGame.
     */
    public onGameRoomDispose() {
        // If the waiting room is already disposed don't change its state (causes null pointer).
        if(!this.waitingRoomDisposed) {
            this.setMetadata({ inGame: false });
            this.state.inGame = false;
            this.unreadyEveryone();
            this.unlock();
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

    public unreadyEveryone() {
        this.state.players.forEach((player) => {
            player.isReady = false;
        })
    }
}