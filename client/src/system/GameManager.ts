import Phaser from "phaser";
import Player from "../gameobjs/Player";
import * as Colyseus from 'colyseus.js';
import Monster from "../gameobjs/Monster";

export default class GameManager {
    private scene: Phaser.Scene;
    private gameRoom: Colyseus.Room;

    private gameObjects?: Phaser.GameObjects.Sprite[] = [];
    private player1?: Player;
    private players: Player[] = [];

    constructor(scene:Phaser.Scene,room:Colyseus.Room) {
        this.scene = scene;
        this.gameRoom = room;
        this.initializeListeners();
    }

    private initializeListeners() {
        this.gameRoom.state.gameObjects.onAdd = this.onAdd;
        this.gameRoom.state.listen("dungeon", this.onChangeDungeon);
    }
    
    // private getTypeOfObject(gameObj: any): string{
    //     if(gameObj.hasOwnProperty('role')) return "player";
    //     if(gameObj.hasOwnProperty('ownerId')) return "projectile"
    //     else return ""
    // }

    private onAdd = (gameObj:any, key:string) => {
        if(!gameObj) return;
        let objType = gameObj.type;
        switch (objType){
            case 'Player':
                this.gameObjects?.push(this.addPlayer(gameObj, key));
                break;
            case 'Projectile':
                // console.log("projectile spawned")
                // console.log(gameObj)
                this.gameObjects?.push(this.addProjectile(gameObj, key));
                break;
            case 'Monster': 
                this.gameObjects?.push(this.addMonster(gameObj, key));
                break;
        }   
    }

     /**Calls when the dungeon is first created on the server */
    private onChangeDungeon = (currentValue: any) => {
        currentValue.listen("tilemap", this.onChangeTilemap);
    }

    /**Calls when the tilemap is first created on the server */
    private onChangeTilemap = (currentValue:any) => {
        let map = this.scene.add.tilemap("", currentValue.tileWidth, currentValue.tileHeight, currentValue.width, currentValue.height);
        let tileset = map.addTilesetImage("dirt_dungeon_tileset", "dirt_map_tiles", 16, 16, 1, 2);
        //Triggers when the server adds a tilemap layer
        currentValue.layers.onAdd = (layer:any, key:string) => {
            let newLayer = map.createBlankLayer(key, tileset);
            if(key === "Background")
                newLayer.setDepth(-10);
            if(key === "Ground")
                newLayer.setDepth(-5);
            if(key === "Obstacle")
                newLayer.setDepth(10);
            let width = layer.width;
            let height = layer.height;
            for(let y = 0; y < height; y++) {
                for(let x = 0; x < width; x++) {
                    let tileId = layer.tiles[(y * width + x)].tileId;
                    if(tileId !== 0) {
                        //Add a tile to the tilemap
                        let newTile = newLayer.putTileAt(tileId - 1, x, y);
                        //If the tile is a obstacle add it to matter.js
                        if(key === "Obstacle") {
                            let tileBody = this.scene.matter.add.tileBody(newTile); //adding this tile to matter physics will show debug lines
                            tileBody.setStatic(true);
                            tileBody.setSensor(true);
                        }
                    }
                }
            }
        }
    }

    private addProjectile(projectile: any, key: string): Phaser.GameObjects.Sprite{
        let proj =  new Phaser.GameObjects.Sprite(this.scene, projectile.x, projectile.y, "demo_hero");
        proj.scale = 0.5
        projectile.onChange = (changes:any) => {
            changes.forEach(({field, value}: any) => {
                switch(field) {
                    case "x": proj.x = value; break;
                    case "y": proj.y = value; break;
                }
            })
        }
        this.scene.add.existing(proj)
        return proj;
    }
    
    private addPlayer(player: any, key: string): Player{
        let newPlayer = new Player(this.scene, player);
        console.log(newPlayer)
        if(key === this.gameRoom.sessionId) {
            this.player1 = newPlayer;
            this.scene.cameras.main.startFollow(this.player1, false, 0.1);
        }
        else
            this.players.push(newPlayer);
        this.scene.add.existing(newPlayer);
        this.scene.matter.add.gameObject(newPlayer, {
            //isStatic: true,
            isSensor: true,
        }); //adding this game object to matter physics will show debug lines
        newPlayer.initializeListeners(player);
        return newPlayer;
    }

    private addMonster(monster:any, key: string): Monster {
        let newMonster = new Monster(this.scene, monster);
        this.scene.add.existing(newMonster);
        this.scene.matter.add.gameObject(newMonster, {
            isSensor: true,
            //isStatic: true,
        });
        return newMonster;
    }

    /**
     * What we need: 
     * 1. A concrete concept of time. We will use a tick.
     * 
     * 
     * 
     * Doing client side prediction.
     * Client: Send movement input to the server.
     * Client: Start moving the entity.
     * Server: Receives movement input from client and process movement.
     * Server: Sends updated entity position to client.
     * Client: Compares entity's position with the authrotiative entity potition of the server.
     */
}