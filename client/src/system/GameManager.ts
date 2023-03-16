import Phaser from "phaser";
import Player from "../gameobjs/Player";
import * as Colyseus from 'colyseus.js';

export default class GameManager {
    private scene: Phaser.Scene;
    private gameRoom: Colyseus.Room;
    private player1: Player | null = null;
    private players: Player[] = [];

    constructor(scene:Phaser.Scene,room:Colyseus.Room) {
        this.scene = scene;
        this.gameRoom = room;
        this.initializeListeners();
    }

    private initializeListeners() {
        this.gameRoom.state.players.onAdd = this.playersOnAdd;
    }

    private playersOnAdd = (player:any, key:string) => {
        if(key === this.gameRoom.sessionId)
            this.player1 = new Player(this.scene, player);
        else 
            this.players.push(new Player(this.scene, player));
    }
}