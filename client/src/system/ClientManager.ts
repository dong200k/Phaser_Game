import * as Colyseus from 'colyseus.js';
import type WaitingRoomState from "../../../server/src/rooms/waiting_room/schemas/State";
import type GameRoomState from "../../../server/src/rooms/game_room/schemas/State";
import ClientFirebaseConnection from '../firebase/ClientFirebaseConnection';

type room = "waiting" | "game" | "lobby" | "none";

export default class ClientManager {
    private static singleton: ClientManager;
    
    private client: Colyseus.Client;
    private lobbyRoom?: Colyseus.Room;
    private waitingRoom?: Colyseus.Room<WaitingRoomState>;
    private gameRoom?: Colyseus.Room<GameRoomState>;

    private state: room = "none";
    private waitingRoomId: string = "";
    private gameRoomId: string = "";

    // ClientManager is a singleton that manages the connection to the Colyseus Server.
    // There should be methods on here to connect to the lobby, game, and waiting rooms.
    // The rooms should then be accessable to the programmer.

    private constructor() {
        this.client = new Colyseus.Client('ws://localhost:3000');
    }

    public static getClient(): ClientManager {
        if(!this.singleton) {
            this.singleton = new ClientManager();
        }
        return this.singleton; 
    }

    // public connectToServer() {
    //     this.client = new Colyseus.Client('ws://localhost:3000');
    // }

    /**
     * Joins the lobby. If the user is already in the lobby the current lobby is returned.
     */
    public joinLobby(): Promise<Colyseus.Room> {
        const promise = new Promise<Colyseus.Room>((resolve, reject) => {
            if(this.state === 'lobby' && this.lobbyRoom != null)
                resolve(this.lobbyRoom);
            else {
                this.client.joinOrCreate('lobby', {IdToken: ClientFirebaseConnection.getConnection().idToken}).then((room) => {
                    this.lobbyRoom = room;
                    this.lobbyRoom.onLeave((code) => {
                        this.lobbyRoom = undefined;
                        console.log(`---Leaving Lobby, Code: ${code}---`);
                    })
                    console.log("---Joined Lobby!---");
                    resolve(this.lobbyRoom);
                })
            }
        })
        return promise;
    }

    public leaveLobby() {
        if(this.lobbyRoom) {
            this.lobbyRoom.leave();
            this.lobbyRoom = undefined;
        }
    }

    public leaveGameRoom() {
        if(this.gameRoom) {
            this.gameRoom.leave();
            this.gameRoom = undefined;
        }
    }

    public leaveWaitingRoom() {
        if(this.waitingRoom) {
            this.waitingRoom.leave();
            this.waitingRoom = undefined;
        }
    }

    /**
     * Joins a new game room. If the player is already in a game room, leave that game room. 
     * If gameRoomId is set, attempts to join a game room with that id. Otherwise create
     * a new gameroom.
     * @returns A promise containing the game room.
     */
    public joinGameRoom(): Promise<Colyseus.Room<GameRoomState>> {
        const promise = new Promise<Colyseus.Room<GameRoomState>>((resolve, reject) => {
            this.leaveGameRoom();
            if(this.gameRoomId === "") {
                this.client.create<GameRoomState>('game', {IdToken: ClientFirebaseConnection.getConnection().idToken}).then((room) => {
                    this.onJoinGameRoom(room,);
                    resolve(room);
                }).catch((err) => {
                    reject(err);
                })
            } else {
                this.client.joinById<GameRoomState>(this.gameRoomId, {IdToken: ClientFirebaseConnection.getConnection().idToken}).then((room) => {
                    this.onJoinGameRoom(room);
                    resolve(room);
                }).catch((err) => {
                    reject(err);
                })
            }
        })
        return promise;
    }
    
    private onJoinGameRoom(room:Colyseus.Room) {
        this.gameRoom = room;
        this.gameRoom.onLeave((code) => {
            this.gameRoom = undefined;
            this.clearGameRoomId();
            console.log(`---Leaving Game Room, Code: ${code}---`);
        })
        console.log("---Joined Game Room!---");
    }

    /**
     * Joins the waiting room provided by waitingRoomId. If waitingRoomId === "", create a new waiting room. If a waiting room already exists, leave that room.
     */
    public joinWaitingRoom(): Promise<Colyseus.Room<WaitingRoomState>> {
        const promise = new Promise<Colyseus.Room<WaitingRoomState>>((resolve, reject) => {
            this.leaveWaitingRoom();
            if(!this.waitingRoomId) {
                this.client.create<WaitingRoomState>('waiting', {IdToken: ClientFirebaseConnection.getConnection().idToken}).then((room) => {
                    this.onJoinWaitingRoom(room);
                    resolve(room);
                }).catch((err) => {
                    reject(err);
                })
            } else {
                this.client.joinById<WaitingRoomState>(this.waitingRoomId, {IdToken: ClientFirebaseConnection.getConnection().idToken}).then((room) => {
                    this.onJoinWaitingRoom(room);
                    resolve(room);
                }).catch((err) => {
                    reject(err);
                })
            }
        })
        return promise;
    }

    private onJoinWaitingRoom(room: Colyseus.Room) {
        this.waitingRoom = room;
        this.waitingRoom.onLeave((code) => {
            this.waitingRoom = undefined;
            this.clearWaitingRoomId();
            console.log(`---Leaving Waiting Room, Code: ${code}---`);
        })
        console.log("---Joined Waiting Room!---");
    }

    /** Sets the waiting room id. */
    public setWaitingRoomId(id:string): void {
        this.waitingRoomId = id;
    }

    public clearWaitingRoomId(): void {
        this.waitingRoomId = "";
    }
    
    public setGameRoomId(id:string): void {
        this.gameRoomId = id;
    }

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