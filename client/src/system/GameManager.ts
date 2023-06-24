import Phaser from "phaser";
import Player from "../gameobjs/Player";
import * as Colyseus from 'colyseus.js';
import Monster from "../gameobjs/Monster";
import Entity from "../gameobjs/Entity";
import Projectile from "../gameobjs/Projectile";
import MathUtil from "../util/MathUtil";
import GameObject from "../gameobjs/GameObject";
import ClientSidePrediction from "./ClientSidePrediction";
import Tile from "../gameobjs/Tile";

export default class GameManager {
    private scene: Phaser.Scene;
    private gameRoom: Colyseus.Room;

    private gameObjects?: GameObject[] = [];
    private player1?: Player;
    private players: Player[] = [];

    // ------- Inputs ---------
    private upKey?: Phaser.Input.Keyboard.Key;
    private downKey?: Phaser.Input.Keyboard.Key;
    private leftKey?: Phaser.Input.Keyboard.Key;
    private rightKey?: Phaser.Input.Keyboard.Key;
    private spaceKey?: Phaser.Input.Keyboard.Key;
    private debugKey?: Phaser.Input.Keyboard.Key;

    // ------- fixed tick --------
    private timePerTick = 50; // 20 ticks per second.
    private timeTillNextTick: number;

    private csp!: ClientSidePrediction;

    constructor(scene:Phaser.Scene,room:Colyseus.Room) {
        this.scene = scene;
        this.gameRoom = room;
        this.timeTillNextTick = this.timePerTick;
        this.initializeClientSidePrediction();
        this.initializeInputs();
        this.initializeListeners();
    }

    /**
     * Updates the gameManager.
     * @param time The current time in ms.
     * @param deltaT The time that passed in ms.
     */
    public update(time: number, deltaT: number) {
        this.timeTillNextTick -= deltaT;
        while(this.timeTillNextTick <= 0) {
            this.timeTillNextTick += this.timePerTick;
            this.fixedTick(time, this.timePerTick);
        }
        this.interpolateGameObjects();
    }

    /**
     * Updates the gameObject's position to match the server's gameObject position.
     */
    public syncGameObjectsWithServer() {
        this.gameObjects?.forEach((obj) => {
            obj.setX(obj.serverX);
            obj.setY(obj.serverY);
        })
    }

    /**
     * Updates the gameObject's position to be closer to the server's gameObject position.
     */
    private interpolateGameObjects() {
        this.gameObjects?.forEach((obj) => {
            obj.setX(Phaser.Math.Linear(obj.x, obj.serverX, .10));
            obj.setY(Phaser.Math.Linear(obj.y, obj.serverY, .10));
        })
    }

    /**
     * Runs at a frame rate equivalent to the server's frame rate.
     * @param time The current time in ms.
     * @param deltaT The time that passed in ms.
     */
    private fixedTick(time: number, deltaT: number) {
        this.scene.input.mousePointer.updateWorldPoint(this.scene.cameras.main);
        let movementData = this.getPlayerMovementData();
        this.csp.update(deltaT, movementData);
        movementData.push(this.csp.getAdjustmentId()); // Adds adjustmentId to payload.
        this.sendServerInputMessage(movementData);
    }

    private initializeInputs() {
        this.upKey = this.scene.input.keyboard?.addKey("W");
        this.downKey = this.scene.input.keyboard?.addKey("S");
        this.rightKey = this.scene.input.keyboard?.addKey("D");
        this.leftKey = this.scene.input.keyboard?.addKey("A");
        this.spaceKey = this.scene.input.keyboard?.addKey("SPACE");

        //console.log("Keyboard---------------", this.scene.input.keyboard);

        // Debug controls, not visible by default. Can be disabled in config.ts.
        this.debugKey = this.scene.input.keyboard?.addKey("F3");
        this.debugKey?.on("down", () => {
            this.csp.setDebugGraphicsVisible(!this.csp.isDebugGraphicsVisible());
        })
    }

    private initializeListeners() {
        this.gameRoom.state.gameObjects.onAdd = this.onAdd;
        this.gameRoom.state.listen("dungeon", this.onChangeDungeon);
    }

    private initializeClientSidePrediction() {
        this.csp = new ClientSidePrediction(this.scene);
    }

    private sendServerInputMessage(movementData: number[]) {
        
        this.gameRoom?.send("move", movementData);

        let special = this.spaceKey?.isDown? true : false;
        this.gameRoom?.send("special", special);
        

        //[0] mouse click, [1] mousex, [2] mousey.
        let mouseData = [0, 0, 0]
        mouseData[0] = this.scene.input.mousePointer.isDown? 1 : 0;
        mouseData[1] = this.scene.input.mousePointer.worldX;
        mouseData[2] = this.scene.input.mousePointer.worldY;
        this.gameRoom?.send("attack", mouseData);

        // Client-side prediction.
        // this.updatePlayer1(movementData, special, mouseData);
    }

    private getPlayerMovementData() {
        //[0] up, [1] down, [2] left, [3] right, 
        let movementData = [0, 0, 0, 0, 0];
        movementData[0] = this.upKey?.isDown? 1 : 0;
        movementData[1] = this.downKey?.isDown? 1 : 0;
        movementData[2] = this.leftKey?.isDown? 1 : 0;
        movementData[3] = this.rightKey?.isDown? 1 : 0;
        movementData[4] = this.csp.getClientTickCount();
        return movementData;
    }

    private onAdd = (gameObj:any, key:string) => {
        if(!gameObj) return;
        let objType = gameObj.type;
        let newGameObject: GameObject | undefined = undefined;
        switch (objType){
            case 'Player':
                newGameObject = this.addPlayer(gameObj, key)
                break;
            case 'Projectile':
                newGameObject = this.addProjectile(gameObj, key);
                break;
            case 'Monster': 
                newGameObject = this.addMonster(gameObj, key);
                break;
            case 'Tile':
                newGameObject = new Tile(this.scene, gameObj);
                break;
        }
        if(newGameObject) {
            newGameObject.setServerState(gameObj);
            this.gameObjects?.push(newGameObject);
            this.csp.addGameObject(newGameObject);
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
            if(tileset !== null) {
                let newLayer = map.createBlankLayer(key, tileset);
                if(newLayer !== null) {
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
                                newLayer.putTileAt(tileId - 1, x, y);
                            }
                        }
                    }
                } else {
                    console.log(`ERROR: failed to create a blank layer of key: ${key}`);
                }
            } else {
                console.log("ERROR: Failed to load tileset.");
            }
        }
    }

    private addProjectile(projectile: any, key: string): Projectile{
        let proj = new Projectile(this.scene, projectile);
        proj.scale = 0.5
        this.addListenersToGameObject(proj, projectile);
        this.scene.add.existing(proj)
        return proj;
    }
    
    private addPlayer(player: any, key: string): Player{
        let newPlayer = new Player(this.scene, player);
        console.log(newPlayer)
        if(key === this.gameRoom.sessionId) {
            this.player1 = newPlayer;
            this.scene.cameras.main.startFollow(this.player1, false, 0.1);
            this.csp.addPlayer1(newPlayer, player, this.gameRoom.state);
        }
        else
            this.players.push(newPlayer);
        this.scene.add.existing(newPlayer);
        this.addListenersToEntity(newPlayer, player);
        return newPlayer;
    }

    private addMonster(monster:any, key: string): Monster {
        let newMonster = new Monster(this.scene, monster);
        this.scene.add.existing(newMonster);
        this.addListenersToEntity(newMonster, monster);
        return newMonster;
    }

    /** Adds a listener to an entity to respond to server updates on that entity. */
    private addListenersToGameObject(gameObject: GameObject, gameObjectState: any) {
        // Player1 would be excluded from receiving position updates from server directly. It's position will be updated by ClientSidePrediction.
        if(gameObject !== this.player1) {
            gameObjectState.onChange = (changes:any) => {
                gameObject.serverX = gameObjectState.x;
                gameObject.serverY = gameObjectState.y;
            }
        }
    }

    private addListenersToEntity(entity: Entity, entityState: any) {
        this.addListenersToGameObject(entity, entityState);
        entityState.stat.onChange = (changes: any) => {
            entity.updateStat(entityState.stat);
        }
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