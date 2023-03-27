import Phaser from "phaser";
import Player from "../gameobjs/Player";
import * as Colyseus from 'colyseus.js';

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
        this.gameRoom.state.listen("tilemap", this.onChangeTilemap);
    }

    //TODO Change in future 
    private getTypeOfObject(gameObj: any): string{
        if(gameObj.hasOwnProperty('role')) return "player";
        if(gameObj.hasOwnProperty('ownerId')) return "projectile"
        else return ""
    }

    private onAdd = (gameObj:any, key:string) => {
        if(!gameObj) return;
        let objType = this.getTypeOfObject(gameObj)
        switch (objType){
            case 'player':
                this.gameObjects?.push(this.addPlayer(gameObj, key));
                break;
            case 'projectile':
                // console.log("projectile spawned")
                // console.log(gameObj)
                this.gameObjects?.push(this.addProjectile(gameObj, key));
                break;
        }   
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
                    if(tileId !== 0)
                        newLayer.putTileAt(tileId - 1, x, y);
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
        newPlayer.initializeListeners(player);
        return newPlayer
    }
}