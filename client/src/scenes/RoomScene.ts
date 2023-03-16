import Phaser from "phaser";
import * as Colyseus from 'colyseus.js';
import ClientManager from "../colyseus/ClientManager";

export default class RoomScene extends Phaser.Scene {
    
    private waitingRoom: Colyseus.Room | null = null;
    //private client: Colyseus.Client;

    private playersInRoomText: Phaser.GameObjects.Text | null = null;
    private playersInRoom: number = 0;

    constructor() {
        super('RoomScene');
        //this.client = Client.getClient().getColyseusClient();
    }

    create() {
        this.waitingRoom = null;
        this.playersInRoomText = null;
        this.playersInRoom = 0;
        this.initializeUI();
        this.joinRoom();
    }

    private initializeUI() {
        // leave button
        let lobbyButton = this.add.rectangle(this.game.scale.width / 2, 50, 200, 50, 0xAAAAAA);
        this.add.text(this.game.scale.width / 2 - 48, 42, "Join Lobby");
        lobbyButton.setInteractive();
        lobbyButton.on(Phaser.Input.Events.POINTER_UP, () => {
            this.leaveRoom();
            this.scene.start('LobbyScene');
        }, this);

        // start game button
        let startGameButton = this.add.rectangle(this.game.scale.width / 2, 150, 200, 50, 0xAAAAAA);
        this.add.text(this.game.scale.width / 2 - 48, 142, "Start Game");
        startGameButton.setInteractive();
        startGameButton.on(Phaser.Input.Events.POINTER_UP, () => {
            this.waitingRoom?.send('start');
        }, this);

        // list of players text
        this.playersInRoomText = this.add.text(this.game.scale.width / 2, 300, "Players in room: 0");
    }

    private updatePlayersInRoom(count: number) {
        this.playersInRoomText?.setText(`Players in room: ${count}`)
    }

    private joinRoom() {
        ClientManager.getClient().joinWaitingRoom().then((room) => {
            this.waitingRoom = room;
            console.log("Joined waiting room");
            this.onJoin();
        }).catch(e => {
            console.log("Failed to join waiting room ", e);
        });
    }

    private onJoin() {
        this.playersInRoom = 0;
        if(this.waitingRoom) {
            this.waitingRoom.state.players.onAdd = (player:any, key:string) => {
                console.log(player, "added at ", key);
                this.playersInRoom++;
                this.updatePlayersInRoom(this.playersInRoom);
            }
            this.waitingRoom.state.players.onRemove = (player:any, key:string) => {
                console.log(player, "removed at ", key);
                this.playersInRoom--;
                this.updatePlayersInRoom(this.playersInRoom);
            }
            this.waitingRoom.onMessage("joinGame", (message) => {
                console.log("joinGame message", message);
                ClientManager.getClient().setGameRoomId(message);
                this.scene.start('GameScene');
            })
        }
    }

    private leaveRoom() {
        this.waitingRoom?.leave();
        this.waitingRoom?.removeAllListeners();
    }

}