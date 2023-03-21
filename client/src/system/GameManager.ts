import Phaser from "phaser";
import Player from "../gameobjs/Player";
import * as Colyseus from 'colyseus.js';

export default class GameManager {
    private scene: Phaser.Scene;
    private gameRoom: Colyseus.Room;
    private player1?: Player;
    private players: Player[] = [];

    constructor(scene:Phaser.Scene,room:Colyseus.Room) {
        this.scene = scene;
        this.gameRoom = room;
        this.initializeListeners(); 
    }

    private initializeListeners() {
        this.gameRoom.state.gameObjects.onAdd = this.playersOnAdd;
    }

    private playersOnAdd = (player:any, key:string) => {
        let newPlayer = new Player(this.scene, player);
        if(key === this.gameRoom.sessionId)
            this.player1 = newPlayer
        else
            this.players.push(newPlayer);
        this.scene.add.existing(newPlayer);
        newPlayer.initializeListeners(player);
    }
}