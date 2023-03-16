import Phaser from "phaser";
import * as Colyseus from 'colyseus.js';
import ClientManager from "../colyseus/ClientManager";


export default class LobbyScene extends Phaser.Scene {
    
    private lobbyRoom: Colyseus.Room | null = null;
    private allRooms: any[] = [];

    private lobbyConnectionText: Phaser.GameObjects.Text | null = null;
    private waitingRooms: Phaser.GameObjects.Text[] = [];

    constructor() {
        super('LobbyScene');
    }

    create() {
        console.log("Running create for lobby scene");
        this.lobbyRoom = null;
        this.allRooms = [];
        this.waitingRooms = [];
        this.lobbyConnectionText = null;
        this.initializeUI();
        this.joinLobby();
    }

    private initializeUI() {
        //Host game button
        let hostButton = this.add.rectangle(this.game.scale.width / 2, 50, 200, 50, 0xAAAAAA);
        this.add.text(this.game.scale.width / 2 - 48, 42, "Host Game");
        hostButton.setInteractive();
        hostButton.on(Phaser.Input.Events.POINTER_UP, () => {
            this.leaveLobby();
            ClientManager.getClient().clearWaitingRoomId();
            this.scene.start("RoomScene");
        }, this);

        //Make room buttons interactable
        for(let i = 0; i < 10; i++) {
            this.waitingRooms.push(this.add.text(100, i*30 + 100, ""));
            this.waitingRooms[i].setInteractive();
            this.waitingRooms[i].on(Phaser.Input.Events.POINTER_UP, () => {
                if(this.allRooms.length > i) {
                    ClientManager.getClient().setWaitingRoomId(this.allRooms[i].roomId);
                    this.scene.start("RoomScene");
                }
            })
        }
    }

    private leaveLobby() {
        this.lobbyRoom?.leave();
        this.lobbyRoom?.removeAllListeners();
        this.allRooms.splice(0, this.allRooms.length);
        console.log("---Leaving lobby---");
    }

    private joinLobby() {
        // Connecting to the server
        console.log("connecting to the lobby...");
        this.lobbyConnectionText = this.add.text(this.game.scale.width / 2 - 48, 80, "");
        this.lobbyConnectionText.setText("connecting to the lobby...");
        ClientManager.getClient().joinLobby().then((room) => {
            this.lobbyRoom = room;
            this.onJoin();
            this.lobbyConnectionText?.setText("Joined Lobby");
            console.log("Joined Lobby Room!");
        }).catch((e) => {
            console.log("Join Lobby Error: ", e);
            this.lobbyConnectionText?.setText("Failed to connect to server");
        });
    }

    update(deltaT:number) {
        this.renderWaitingRoom();
    }

    private renderWaitingRoom() {
        this.waitingRooms.forEach((text, idx) => {
            text.setText(`Join Room: ${this.allRooms.length > idx ? this.allRooms[idx].roomId : "No Room"}`);
        })
    }

    private onJoin() {
        if(this.lobbyRoom != null) {
            this.lobbyRoom.onMessage("rooms", (rooms) => {
                this.allRooms = rooms;
                console.log("All rooms received: ", rooms);
            });

            this.lobbyRoom.onMessage("+", ([roomId, room]) => {
                let exist = false;
                this.allRooms.forEach((r, idx) => {
                    if(r.roomId === roomId) {
                        this.allRooms[idx] = room;
                        exist = true;
                    }
                })
                if(!exist)
                    this.allRooms.push(room);
                console.log("Added/Updated room: ", room);
            })

            this.lobbyRoom.onMessage("-", (roomId: string) => {
                this.allRooms = this.allRooms.filter((r: any) => {
                    if(r.roomId === roomId)
                        return false;
                    return true;
                })
                console.log("Removed Room: ", roomId);
            })

            this.lobbyRoom.onLeave(() => {
                console.log("You have left the lobby");
            })
        } else {
            console.log("Error: Lobby Room is null");
        }
    }
}