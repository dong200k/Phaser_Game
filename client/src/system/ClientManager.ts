import * as Colyseus from 'colyseus.js';
import type WaitingRoomState from "../../../server/src/rooms/waiting_room/schemas/State";
import type GameRoomState from "../../../server/src/rooms/game_room/schemas/State";
import ClientFirebaseConnection from '../firebase/ClientFirebaseConnection';
import { GAME_SERVER_URL } from '../config';

/**
 * ClientManager is a singleton that manages the connection to the Colyseus Server.
 * There are methods to connect to the lobby, game, and waiting room.
 */
export default class ClientManager {
    private static singleton: ClientManager;
    
    private client: Colyseus.Client;
    private lobbyRoom?: Colyseus.Room;
    private waitingRoom?: Colyseus.Room<WaitingRoomState>;
    private gameRoom?: Colyseus.Room<GameRoomState>;

    private waitingRoomId: string = "";
    private gameRoomId: string = "";

    private constructor() {
        this.client = new Colyseus.Client(GAME_SERVER_URL);
    }

    public static getClient(): ClientManager {
        if(!this.singleton) this.singleton = new ClientManager();
        return this.singleton; 
    }

    /**
     * Joins the lobby. If the user is already in the lobby the current lobby is returned.
     */
    public async joinLobby(): Promise<Colyseus.Room> {
        // If the user is already in the lobby the current lobby is returned.
        if(this.lobbyRoom) return this.lobbyRoom;
        let options = await ClientFirebaseConnection.getConnection().getOptions();
        let room = await this.client.joinOrCreate("lobby", options);
        this.lobbyRoom = room;
        this.lobbyRoom.onLeave((code) => {
            this.lobbyRoom = undefined;
            console.log(`---Leaving Lobby, Code: ${code}---`);
        })
        console.log("---Joined Lobby!---");
        return this.lobbyRoom;
    }

    /** Calls leave on the lobby room. */
    public leaveLobby() {
        if(this.lobbyRoom) {
            this.lobbyRoom.leave();
            this.lobbyRoom = undefined;
        }
    }

    /** Calls leave on the game room. */
    public leaveGameRoom() {
        if(this.gameRoom) {
            this.gameRoom.leave();
            this.gameRoom = undefined;
        }
    }

    /** Calls leave on the waitingRoom */
    public leaveWaitingRoom() {
        if(this.waitingRoom) {
            this.waitingRoom.leave();
            this.waitingRoom = undefined;
        }
    }

    /**
     * Joins a new game room. If the player is already in a game room, leave that game room. 
     * If gameRoomId is set, attempts to join a game room with that id.
     * @returns A promise containing the game room.
     * @throws Error when game room id is not set.
     */
    public async joinGameRoom(): Promise<Colyseus.Room<GameRoomState>> {
        if(this.gameRoom && this.gameRoom.id === this.gameRoomId) return this.gameRoom;

        this.leaveGameRoom();

        let options = await ClientFirebaseConnection.getConnection().getOptions();
        if(this.gameRoomId === "") {
            let room = await this.client.create<GameRoomState>('game', options)
            this.onJoinGameRoom(room);
            return room;
        }

        let room = await this.client.joinById<GameRoomState>(this.gameRoomId, options);
        this.onJoinGameRoom(room);
        return room;
    }
    
    private onJoinGameRoom(room:Colyseus.Room) {
        this.gameRoom = room;
        this.gameRoom.onLeave((code) => {
            this.gameRoom = undefined;
            console.log(`---Leaving Game Room, Code: ${code}---`);
        })
        console.log("---Joined Game Room!---");
    }

    /**
     * Joins the waiting room provided by waitingRoomId. If waitingRoomId === "", create a new waiting room.
     * If a waiting room already exist join that waiting room. If a waiting room exist but the waitingRoomId 
     * doesn't match the waiting room id, remove the waiting room and join the correct one.
     */
    public async joinWaitingRoom(): Promise<Colyseus.Room<WaitingRoomState>> {
        if(this.waitingRoom && this.waitingRoom.id === this.waitingRoomId) return this.waitingRoom;

        this.leaveWaitingRoom();

        let options = await ClientFirebaseConnection.getConnection().getOptions();
        if(this.waitingRoomId === "") {
            let room = await this.client.create<WaitingRoomState>('waiting', options);
            this.onJoinWaitingRoom(room);
            return room;
        }

        let room = await this.client.joinById<WaitingRoomState>(this.waitingRoomId, options);
        this.onJoinWaitingRoom(room);
        return room;
    }

    private onJoinWaitingRoom(room: Colyseus.Room) {
        this.waitingRoom = room;
        this.waitingRoom.onLeave((code) => {
            this.waitingRoom = undefined;
            console.log(`---Leaving Waiting Room, Code: ${code}---`);
        })
        console.log("---Joined Waiting Room!---");
    }

    /** Sets the waiting room id. This will determine which waitingRoom to join when joinWaitingRoom() is called. */
    public setWaitingRoomId(id:string): void {
        this.waitingRoomId = id;
    }

    /** Clear waiting room id. Use this method when you don't want to reconnect to the same waiting room. */
    public clearWaitingRoomId(): void {
        this.waitingRoomId = "";
    }
    
    /** Sets the game room id. This will determine which gameRoom to join when joinGameRoom() is called. */
    public setGameRoomId(id:string): void {
        this.gameRoomId = id;
    }

    /** Clears the gameRoom id. Use this method when you don't want to reconnect to the same gameRoom. */
    public clearGameRoomId(): void {
        this.gameRoomId = "";
    }

    public isConnectedToLobby(): boolean {
        return this.lobbyRoom !== undefined;
    }

    public isConnectedToGameRoom(): boolean {
        return this.gameRoom !== undefined;
    }

    public isConnectedToWaitingRoom(): boolean {
        return this.waitingRoom !== undefined;
    }

    public getColyseusClient() {
        return this.client;
    }
}