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
import EventManager from "./EventManager";
import PlayerState from "../../../server/src/rooms/game_room/schemas/gameobjs/Player";
import type MonsterState from "../../../server/src/rooms/game_room/schemas/gameobjs/monsters/Monster";
import type ProjectileState from "../../../server/src/rooms/game_room/schemas/projectiles/Projectile";
import type GameObjectState from "../../../server/src/rooms/game_room/schemas/gameobjs/GameObject";
import EntityState from "../../../server/src/rooms/game_room/schemas/gameobjs/Entity";
import { ColorStyle } from "../config";
import InvisObstacle from "../gameobjs/InvisObstacle";
import GameOverModal from "../UI/modals/GameOverModal";
import { PhaserAudio } from "../interfaces";
import SettingsManager from "./SettingsManager";
import SoundManager from "./SoundManager";

export default class GameManager {
    private scene: Phaser.Scene;
    private gameRoom: Colyseus.Room;

    private gameObjects: GameObject[] = [];
    private player1?: Player;
    private players: Player[] = [];

    // ------- Inputs ---------
    private upKey?: Phaser.Input.Keyboard.Key;
    private downKey?: Phaser.Input.Keyboard.Key;
    private leftKey?: Phaser.Input.Keyboard.Key;
    private rightKey?: Phaser.Input.Keyboard.Key;
    private spaceKey?: Phaser.Input.Keyboard.Key;
    private debugKey?: Phaser.Input.Keyboard.Key;

    private mouseDown: boolean = false;

    // ------- fixed tick --------
    private timePerTick = 33.33; // 30 ticks per second.
    private timeTillNextTick: number;

    private csp!: ClientSidePrediction;

    // ------ Audio -------
    private soundManager: SoundManager;

    constructor(scene:Phaser.Scene,room:Colyseus.Room) {
        this.scene = scene;
        this.gameRoom = room;
        this.timeTillNextTick = this.timePerTick;
        this.soundManager = SoundManager.getManager();
        this.initializeClientSidePrediction();
        this.initializeInputs();
        this.initializeListeners();
        this.initializeSounds();
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
        this.syncGameObjectVisibility();
        this.syncGameObjectActive();
    }

    /**
     * Updates the gameObject's position to match the server's gameObject position.
     */
    public syncGameObjectsWithServer() {
        this.gameObjects.forEach((obj) => {
            obj.setX(obj.serverX);
            obj.setY(obj.serverY);
        })
    }

    /**
     * Updates the gameObject's position to be closer to the server's gameObject position.
     * If the gameObject is not visible then just teleport it.
     */
    private interpolateGameObjects() {
        this.gameObjects?.forEach((obj) => {
            if(obj.visible) {
                obj.setX(Phaser.Math.Linear(obj.x, obj.serverX + obj.positionOffsetX, .2));
                obj.setY(Phaser.Math.Linear(obj.y, obj.serverY + obj.positionOffsetY, .2));
            } else {
                obj.setX(obj.serverX + obj.positionOffsetX);
                obj.setY(obj.serverY + obj.positionOffsetY);
            } 
        })
    }

    private syncGameObjectVisibility() {
        this.gameObjects?.forEach((obj) => {
            obj.setVisible(obj.serverVisible)
        })
    }

    private syncGameObjectActive() {
        this.gameObjects?.forEach((obj) => {
            if(obj.active === true && obj.serverActive === false) {
                this.csp.removeGameObject(obj);
            } else if(obj.active === false && obj.serverActive === true) {
                this.csp.addGameObject(obj);
            }
            obj.setActive(obj.serverActive);
            obj.setVisible(obj.serverActive);
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

        this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if(pointer.leftButtonDown()) this.mouseDown = true;
        })

        this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if(pointer.leftButtonReleased()) this.mouseDown = false;
        })
    }

    private initializeListeners() {
        this.gameRoom.state.gameObjects.onAdd = this.onAdd;
        this.gameRoom.state.listen("dungeon", this.onChangeDungeon);
    }

    private initializeSounds() {
        this.soundManager.add("player_death", "sfx");
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
        mouseData[0] = this.mouseDown? 1 : 0;
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
            case 'InvisObstacle':
                newGameObject = new InvisObstacle(this.scene, gameObj);
                break;
        }
        if(newGameObject) {
            // newGameObject.setServerState(gameObj);
            this.gameObjects.push(newGameObject);
            this.csp.addGameObject(newGameObject);
        }
    }

    /** Called when the dungeon is first created on the server */
    private onChangeDungeon = (currentValue: any) => {
        currentValue.listen("tilemap", this.onChangeTilemap);
        currentValue.listen("playerBounds", this.onChangePlayerBounds);
    }

    private onChangePlayerBounds = (currentValue: any) => {
        this.csp.updatePlayerBounds(currentValue.minX, currentValue.minY, currentValue.maxX, currentValue.maxY);
    }

    /** Called when the tilemap is first created on the server */
    private onChangeTilemap = (currentValue:any) => {
        let map = this.scene.add.tilemap("", currentValue.tileWidth, currentValue.tileHeight, currentValue.width, currentValue.height);
        let tileset = map.addTilesetImage("tileset_image", currentValue.tileSetName, 16, 16, 1, 2);
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

    /** Adds a new projectile to the scene. */
    private addProjectile(projectile: ProjectileState, key: string): Projectile{
        let proj = new Projectile(this.scene, projectile);
        this.addListenersToGameObject(proj, projectile);
        // Play projectile animation.
        if(projectile.projectileType === "Melee") {
            proj.play("play");
        } else {
            proj.play({key: "play", repeat: -1});
        }  
        this.scene.add.existing(proj)
        return proj;
    }
    
    /** Adds a new player to the scene. */
    private addPlayer(playerState: PlayerState, key: string): Player{
        let newPlayer = new Player(this.scene, playerState);
        newPlayer.positionOffsetX = 5;
        newPlayer.positionOffsetY = -10;
        if(key === this.gameRoom.sessionId) {
            this.player1 = newPlayer;
            this.scene.cameras.main.startFollow(this.player1, false, 0.05);
            this.csp.addPlayer1(newPlayer, playerState, this.gameRoom.state);
        }
        else
            this.players.push(newPlayer);
        
        // Play idle animation.
        newPlayer.play({key: "idle", repeat: -1});

        // Create a PeerInfo display for this player.
        EventManager.eventEmitter.emit(EventManager.HUDEvents.CREATE_OR_UPDATE_PEER_INFO, playerState.id, {
            name: playerState.id,
        })
        
        this.addListenersToGameObject(newPlayer, playerState);
        this.scene.add.existing(newPlayer);
        return newPlayer;
    }

    /** Adds a new monster to the scene. */
    private addMonster(monster:any, key: string): Monster {
        let newMonster = new Monster(this.scene, monster);
        this.scene.add.existing(newMonster);

        // Play the walking animation.
        newMonster.play({key: "walk", repeat: -1});
        newMonster.walking = true;

        this.addListenersToGameObject(newMonster, monster);
        return newMonster;
    }

    /** Adds a listener to an entity to respond to server updates on that entity. */
    private addListenersToGameObject(gameObject: GameObject, gameObjectState: GameObjectState) {
        /** ----- GameObject Listeners ----- */
        gameObjectState.onChange = (changes:any) => this.gameObjectOnChange(gameObject, gameObjectState, changes);
        gameObjectState.velocity.onChange = (changes: any) => this.gameObjectVelocityOnChange(gameObject, gameObjectState, changes);

        if(gameObject instanceof Entity) {
            /** ----- Entity Listeners ----- */
            let entityState = gameObjectState as EntityState;
            entityState.stat.onChange = (changes: any) => this.entityStatOnChange(gameObject, entityState, changes);
            // entityState.listen("stat", (newStat, prev) => {
            //     console.log(`New: ${newStat}, prev ${prev}`);
            //     newStat.onChange = (changes: any) => this.entityStatOnChange(gameObject, entityState, changes);
            // })

            if(gameObject instanceof Player) {
                /** ----- Player Listeners ----- */
                let playerState = entityState as PlayerState;
                playerState.specialCooldown.onChange = (changes: any) => this.playerSpecialCooldownOnChange(gameObject, playerState, changes);
                playerState.playerController.onChange = (changes: any) => this.playerControllerOnChange(gameObject, playerState, changes);
                playerState.upgradeInfo.onChange = (changes: any) => this.playerUpgradeInfoOnChange(gameObject, playerState, changes);
            }

            if(gameObject instanceof Monster) {
                /** ----- Monster Listeners ----- */
                let monsterState = entityState as MonsterState;
                monsterState.controller.onChange = (changes: any) => this.monsterControllerOnChange(gameObject, monsterState, changes);
            }
        }

        if(gameObject instanceof Projectile) {
            /** ----- Projectile Listeners ----- */
            let projectileState = gameObjectState as ProjectileState;
            projectileState.projectileController.onChange = (changes: any) => this.projectileControllerOnChange(gameObject, projectileState, changes);
        }
    }

    /** Called when the gameObjectState field changes. This doesn't account for object fields only primitive fields. */
    private gameObjectOnChange(gameObject: GameObject, gameObjectState: GameObjectState, changes: any) {
        if(gameObject instanceof Monster) {
            // Makes the monster walk again after it comes out of deactivation.
            if(gameObject.serverActive === false && gameObjectState.active === true) {
                gameObject.play({key: "walk", repeat: -1});
                gameObject.walking = true;
            }
        }
        if(gameObject instanceof Player) {
            let playerState = gameObjectState as PlayerState;
            if(gameObject === this.player1) {
                // Updates the Player Info Display. This display is on the bottom left corner of the screen.
                EventManager.eventEmitter.emit(EventManager.HUDEvents.UPDATE_PLAYER_INFO, {
                    xpValue: playerState.xp,
                    maxXpValue: playerState.maxXp,
                    level: playerState.level,
                })
                // Play the level up sound effect.
                if(gameObject.serverLevel < playerState.level) {
                    gameObject.serverLevel = playerState.level;
                    SoundManager.getManager().play("level_up");
                }
            }
            // Updates the Peer Info Display. This display popup when holding SHIFT.
            EventManager.eventEmitter.emit(EventManager.HUDEvents.CREATE_OR_UPDATE_PEER_INFO, playerState.id, {
                xpValue: playerState.xp,
                maxXpValue: playerState.maxXp,
                level: playerState.level,
            })
        }
        // Updates the gameObject's serverX and serverY for all gameObjects except for player1. ClientSidePrediction updates player1.
        if(!(gameObject instanceof Player && gameObject === this.player1)) {
            gameObject.serverX = gameObjectState.x;
            gameObject.serverY = gameObjectState.y;
        }
        gameObject.serverVisible = gameObjectState.visible;
        gameObject.serverActive = gameObjectState.active;
    }

    /** Called when the velocity of the gameObject is updated on the server. */
    private gameObjectVelocityOnChange(gameObject: GameObject, gameObjectState: GameObjectState, changes: any) {
        if(gameObject instanceof Projectile) {
            // Updates the projectile rotation based on its velocity.
            let projectileState = gameObjectState as ProjectileState;
            let velocityX = projectileState.velocity.x;
            let velocityY = projectileState.velocity.y;
            if(velocityX !== 0) gameObject.setRotation(Phaser.Math.Angle.Between(0, 0, velocityX, velocityY));
        }
        if(gameObject instanceof Monster) {
            // Updates the monster's movement animations based on its velocity.
            let monsterState = gameObjectState as MonsterState;
            let velocityX = monsterState.velocity.x;
            let velocityY = monsterState.velocity.y;
            if(velocityX < 0) gameObject.setFlip(true, false);
            else if(velocityX > 0) gameObject.setFlip(false, false);
            if((velocityX > 0 || velocityY > 0) && !gameObject.walking) {
                gameObject.play({key: "walk", repeat: -1});
                gameObject.walking = true;
            }
        }
        if(gameObject instanceof Player && gameObject !== this.player1) {
            if((gameObjectState as PlayerState).playerController.stateName !== "Dead") {
                // Movement animations for all players except player1. Player1 gets animation from the csp.
                let velocityX = gameObjectState.velocity.x;
                let velocityY = gameObjectState.velocity.y;
                if(velocityX < 0) gameObject.setFlip(true, false);
                else if(velocityX > 0) gameObject.setFlip(false, false);

                if(velocityX === 0 && velocityY === 0) {
                    gameObject.play({key: "idle", repeat: -1});
                    gameObject.running = false;
                } else {
                    if(!gameObject.running) {
                        gameObject.play({key: "run", repeat: -1});
                        gameObject.running = true;
                    }
                }
            }
        }
    }

    /** Called when the entity's stat is updated on the server. */
    private entityStatOnChange(entity: Entity, entityState: EntityState, changes: any) {
        if(entity instanceof Monster) {
            // console.log("Change detected");
            let monsterState = entityState as MonsterState;
            entity.updateStat(monsterState.stat);
        }
        if(entity instanceof Player) {
            let playerState = entityState as PlayerState;
            entity.updateStat(playerState.stat);
            if(entity === this.player1) {
                // Updates the Player Info Display. This display is on the bottom left corner of the screen.
                EventManager.eventEmitter.emit(EventManager.HUDEvents.UPDATE_PLAYER_INFO, {
                    hpValue: playerState.stat.hp,
                    maxHpValue: playerState.stat.maxHp,
                    mpValue: playerState.stat.mana,
                    maxMpValue: playerState.stat.maxMana,
                })
            }
            // Updates the Peer Info Display. This display popup when holding SHIFT.
            EventManager.eventEmitter.emit(EventManager.HUDEvents.CREATE_OR_UPDATE_PEER_INFO, playerState.id, {
                hpValue: playerState.stat.hp,
                maxHpValue: playerState.stat.maxHp,
                mpValue: playerState.stat.mana,
                maxMpValue: playerState.stat.maxMana,
            })
        }
    }

    /** Called when the player's cooldown is updated on the server. */
    private playerSpecialCooldownOnChange(player: Player, playerState: PlayerState, changes: any) {
        let time = playerState.specialCooldown.time;
        let remainingTime = playerState.specialCooldown.remainingTime;
        let isFinished = playerState.specialCooldown.isFinished;

        // Updates the Peer Info Display
        EventManager.eventEmitter.emit(EventManager.HUDEvents.CREATE_OR_UPDATE_PEER_INFO, playerState.id, {
            specialCooldownPercent: isFinished? 0 : remainingTime / time,
        })

        if(player === this.player1) {
            // Updates Player Info Display
            EventManager.eventEmitter.emit(EventManager.HUDEvents.UPDATE_PLAYER_INFO, {
                specialCooldownCounter: Math.round(remainingTime / 1000),
                specialCooldownPercent: isFinished? 0 : remainingTime / time,
            });
        }
    }

    private playerControllerOnChange(player: Player, playerState: PlayerState, changes: any) {
        let currentState = playerState.playerController.stateName;
        if(currentState === "Dead") {
            player.play("death");
            this.soundManager.play("player_death");
            // Open up the game over screen.
            setTimeout(() => {
                EventManager.eventEmitter.emit(EventManager.HUDEvents.PLAYER_DIED);
            }, 1000);
        }
    }

    private projectileControllerOnChange(projectile: Projectile, projectileState: ProjectileState, changes: any) {
        let currentState = projectileState.projectileController.stateName;
        if(currentState === "Attack") {
            projectile.play("play");
        }
    }

    private monsterControllerOnChange(monster: Monster, monsterState: MonsterState, changes:any) {
        let currentState = monsterState.controller.stateName;
        if(currentState === "Death") {
            monster.play({key: "death"});
            this.soundManager.play("monster_death", {detune: Math.floor(Math.random() * 300 - 150)});
            monster.walking = false;
        }
    }

    private playerUpgradeInfoOnChange(player: Player, playerState: PlayerState, changes: any) {
        if(player === this.player1) {
            if(playerState.upgradeInfo.currentUpgrades.length > 0) {

                let upgradesList: any[] = [];
                playerState.upgradeInfo.currentUpgrades.forEach((item, idx) => {
                    upgradesList.push({
                        typeName: item.type,
                        name: item.name,
                        description: item.description,
                        imageKey: item.imageKey,
                        onClick: () => {
                            this.gameRoom.send("selectUpgrade", idx);
                            SoundManager.getManager().play("button_click1", {detune: 700});
                        },
                    })
                })
    
                EventManager.eventEmitter.emit(EventManager.HUDEvents.SHOW_WEAPON_ARTIFACT_POPUP, {
                    title: `Level ${playerState.upgradeInfo.upgradeCount + 2} Upgrades`,
                    items: upgradesList,
                })
            }
        }
    }
}