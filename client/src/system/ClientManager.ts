import * as Colyseus from 'colyseus.js';

type room = "waiting" | "game" | "lobby" | "none";

export default class ClientManager {
    private static singleton: ClientManager;
    
    private client: Colyseus.Client;
    private lobbyRoom?: Colyseus.Room;
    private waitingRoom?: Colyseus.Room;
    private gameRoom?: Colyseus.Room;

    private state: room = "none";
    private waitingRoomId: string = "";
    private gameRoomId: string = "";

    private constructor() {
        this.client = new Colyseus.Client('ws://localhost:3000');
    }

    public static getClient(): ClientManager {
        if(!this.singleton) {
            this.singleton = new ClientManager();
        }
        return this.singleton;
    }

    /**
     * Joins the lobby. If the user is already in the lobby the current lobby is returned.
     */
    public joinLobby(): Promise<Colyseus.Room> {
        const promise = new Promise<Colyseus.Room>((resolve, reject) => {
            if(this.state === 'lobby' && this.lobbyRoom != null)
                resolve(this.lobbyRoom);
            else {
                this.client.joinOrCreate('lobby').then((room) => {
                    this.lobbyRoom = room;
                    this.setState('lobby');
                    resolve(this.lobbyRoom);
                })
            }
        })
        return promise;
    }

    
    public joinGameRoom(): Promise<Colyseus.Room> {
        const promise = new Promise<Colyseus.Room>((resolve, reject) => {
            if(this.gameRoom) {
                this.gameRoom.leave();
                this.gameRoom.removeAllListeners();
                this.gameRoom = undefined
            }
            if(this.gameRoomId === "") {
                this.client.create('game').then((room) => {
                    this.gameRoom = room;
                    this.setState('game');
                    resolve(this.gameRoom);
                })
            } else {
                this.client.joinById(this.gameRoomId).then((room) => {
                    this.gameRoom = room;
                    this.setState('game');
                    resolve(this.gameRoom);
                })
            }
        })
        return promise;
    }
    
    /**
     * Joins the waiting room provided by waitingRoomId. If waitingRoomId === "", create a new waiting room. If a waiting room already exists, leave that room.
     */
    public joinWaitingRoom(): Promise<Colyseus.Room> {
        const promise = new Promise<Colyseus.Room>((resolve, reject) => {
            if(this.waitingRoom) {
                this.waitingRoom.leave();
                this.waitingRoom.removeAllListeners();
                this.waitingRoom = undefined;
            }
            if(!this.waitingRoomId) {
                this.client.create('waiting').then((room) => {
                    this.waitingRoom = room;
                    this.setState('waiting');
                    resolve(this.waitingRoom);
                })
            } else {
                this.client.joinById(this.waitingRoomId).then((room) => {
                    this.waitingRoom = room;
                    this.setState('waiting');
                    resolve(this.waitingRoom);
                })
            }
        })
        return promise;
    }

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

    private setState(state:string) {
        switch(state) {
            case 'lobby': {
                this.state = 'lobby';
                this.gameRoom = undefined;
                this.waitingRoom = undefined;
            } break;
            case 'waiting': {
                this.state = 'waiting';
                this.lobbyRoom = undefined;
                this.gameRoom = undefined;
            } break;
            case 'game': {
                this.state = 'game';
                this.lobbyRoom = undefined;
            } break;
            default: {
                this.state = 'none';
                this.lobbyRoom = undefined;
                this.gameRoom = undefined;
                this.waitingRoom = undefined;
            }
        }
    }

    public getColyseusClient() {
        return this.client;
    }
}