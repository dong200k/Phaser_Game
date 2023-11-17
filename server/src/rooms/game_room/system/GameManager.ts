import Matter, { Bodies } from 'matter-js';
import State from "../schemas/State";
import Player from '../schemas/gameobjs/Player';
import PlayerManager from './StateManagers/PlayerManager';
import GameObject from '../schemas/gameobjs/GameObject';
import ProjectileManager from './StateManagers/ProjectileManager';
import EffectManager from './StateManagers/EffectManager';
import DungeonManager from './StateManagers/DungeonManager';
import DatabaseManager from './Database/DatabaseManager';
import EffectLogicManager from './EffectLogic/EffectLogicManager';
import ArtifactManager from './StateManagers/ArtifactManager';
import TreeManager from './StateManagers/TreeManager';
import WeaponManager from './StateManagers/WeaponManager';
import EventEmitter from 'events';
import CollisionManager from './Collisions/CollisionManager'
import GameRoom, { GameRoomOptions } from '../GameRoom';
import AbilityManager from './StateManagers/AbilityManager';
import { Categories } from './Collisions/Category';
import MaskManager from './Collisions/MaskManager';
import Entity from '../schemas/gameobjs/Entity';
import Monster from '../schemas/gameobjs/monsters/Monster';
import AuraManager from './StateManagers/AuraManager';
import ChestManager from './StateManagers/ChestManager';

export default class GameManager {
    private engine: Matter.Engine;
    public world: Matter.World;

    // Managers
    private playerManager!: PlayerManager;
    private projectileManager!: ProjectileManager;
    private effectManager!: EffectManager;
    private dungeonManager!: DungeonManager;
    private effectLogicManager!: EffectLogicManager;
    private artifactManager!: ArtifactManager;
    private collisionManager!: CollisionManager;
    private abilityManager!: AbilityManager;
    private auraManager!: AuraManager;
    private chestManager!: ChestManager;

    // Data
    public matterBodies: Map<string, Matter.Body> = new Map();
    public state: State;
    public gameObjects: Map<number, GameObject> = new Map(); // For detecting collision same as gameObjects but id is generated by Matter

    // Events
    private eventEmitter: EventEmitter = new EventEmitter();

    // Game Options/Config
    private options: GameRoomOptions;

    // Asset Set. Sent to clients to load their assets.
    private assetSet: Set<string> = new Set();

    gameOver: boolean = false;

    constructor(state: State, options?: GameRoomOptions) {
        this.state = state;
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.engine.gravity.y = 0; //no gravity 
        if(options !== undefined) this.options = options;
        else this.options = {dungeonSelected: "Demo Dungeon"};
    }

    /**
     * Preloads asynchronous tasks such as getting upgrades and weapons from database.
     * so that they are available before other things are done. The managers are then loaded. 
     * Events are setup.
     * *** Note: Call this function and await it in GameRoom before game starts. ***
     */
    async preload(){
        await DatabaseManager.getManager().loadData()

        // Setup managers
        this.playerManager = new PlayerManager(this)
        this.projectileManager = new ProjectileManager(this)
        this.effectManager = new EffectManager(this);
        this.dungeonManager = new DungeonManager(this);
        this.effectLogicManager = new EffectLogicManager(this)
        this.artifactManager = new ArtifactManager(this)
        this.collisionManager = new CollisionManager(this)
        this.abilityManager = new AbilityManager(this)
        this.auraManager = new AuraManager(this);
        this.chestManager = new ChestManager(this);

        this.initUpdateEvents();
        this.initCollisionEvent();
        this.syncServerStateBasedOnGameState();
    }

    public syncServerStateBasedOnGameState(){
        // sync object positions
        Matter.Events.on(this.engine, "afterUpdate", () => {
            this.matterBodies.forEach((obj, key) => {
                let objState = this.state.gameObjects.get(key);
                if(objState && !obj.isStatic) {
                    objState.x = obj.position.x;
                    objState.y = obj.position.y;
                    objState.velocity.x = obj.velocity.x;
                    objState.velocity.y = obj.velocity.y;
                }
            })
        });
    }
        
    public setOwner(sessionId: string){
        this.state.ownerSessionId = sessionId
    }

    /**
     * Adds obj and body to GameRoom's state, GameManager's gameObjects and the Matter world.
     * Sets the obj's body field to the provided matter body.
     * @param id unique identifer of GameObject
     * @param obj  state/game object for sharing with client
     * @param body Matter.Body of game object for collision
     */
    public addGameObject(id: string, obj: GameObject, body: Matter.Body) {
        this.state.gameObjects.set(id, obj);
        obj.setBody(body);
        this.matterBodies.set(id, body);
        
        this.gameObjects.set(body.id, obj)
        
        Matter.Composite.add(this.world, body);
    }

    /**
     * removes game object from the server's state, from the GameManager, and from the Matter.Composite
     * @param id unique identifer for game object
     */
    public removeGameObject(id: string) {
        let gameObject = this.state.gameObjects.get(id);
        this.state.gameObjects.delete(id);

        let body = this.matterBodies.get(id);
        if(body) {
            Matter.Composite.remove(this.world, body);
            this.matterBodies.delete(id);
        }
        return gameObject;
    }

    public playerCount(){
        let count = 0;
        this.state.gameObjects.forEach((gameObject, key)=>{
            if(gameObject instanceof Player){
                count+=1
            }
        })
        return count;
    }

    private initUpdateEvents() {}

    private initCollisionEvent() {
        Matter.Events.on(this.engine, "collisionStart", (event) => {
            // console.log("collision detected")
            let pairs = event.pairs;
            // console.log(event.source)
            pairs.forEach((pair, idx) => {
                this.collisionManager.resolveCollisions(pair.bodyA, pair.bodyB)
            })
        })
        Matter.Events.on(this.engine, "collisionEnd", (event) => {
            // console.log("collision ended");
            let pairs = event.pairs;
            pairs.forEach((pair) => {
                this.collisionManager.resolveCollisionEnd(pair.bodyA, pair.bodyB);
            })
        })
    }

    public update(deltaT:number) {
        let deltaTSeconds = deltaT / 1000;
        Matter.Engine.update(this.engine, deltaT);

        this.playerManager.update(deltaTSeconds);
        this.effectManager.update(deltaTSeconds);
        this.dungeonManager.update(deltaTSeconds);
        this.projectileManager.update(deltaT);
        this.auraManager.update(deltaTSeconds);

        // if(this.state.serverTickCount % 30 === 0)
        //     console.log(`Heap usage: ${process.memoryUsage().heapUsed / 1000000} Mb`);
    }

    public startGame() {
        // code to run when starting the game.

        // Spawning a boss temporarily here
        // console.log("spawning boss")
        // let monster = new Monster(this, {
        //     id: "",
        //     name: "Berserker Boss",
        //     imageKey: "Berserker",
        //     stats: {
        //         maxHp: 4000,
        //         maxMana: 0,
        //         hp: 4000,
        //         mana: 0,
        //         armor: 0,
        //         magicResist: 0,
        //         damagePercent: 0,
        //         attack: 10,
        //         armorPen: 0.5,
        //         attackPercent: 0,
        //         magicAttack: 0,
        //         magicAttackPercent: 0,
        //         magicPen: 0,
        //         critRate: 0,
        //         critDamage: 0,
        //         attackRange: 0,
        //         attackRangePercent: 0,
        //         attackSpeed: 1,
        //         attackSpeedPercent: 0,
        //         speed: 50,
        //         lifeSteal: 0,
        //         lifeStealPercent: 0,
        //         level: 100,
        //         chargeAttackSpeed: 0,
        //         chargeAttackSpeedPercent: 0,
        //         healthRegen: 0,
        //         shieldHp: 0,
        //         shieldMaxHp: 0,
        //         extraDamageTakenPercent: 0,
        //         area: 0,
        //         amount: 0,
        //         cooldownReduction: 0
        //     },
        //     poolType: "Berserker Boss",
        //     controllerKey: "BerserkerBoss",
        //     bounds: {
        //         type: "",
        //         width: 46,
        //         height: 42
        //     }
        // })

        // let playerSpawnPoint = this.getDungeonManager().getPlayerSpawnPoint();
        // let spawnX = 100;
        // let spawnY = 100;
        // if(playerSpawnPoint){
        //     spawnX = playerSpawnPoint.x
        //     spawnY = playerSpawnPoint.y
        // }

        // this.addGameObject(monster.getId(), monster, monster.getBody());
        // Matter.Body.setPosition(monster.getBody(), {x: spawnX, y: spawnY});
        
    }

    /** 
     * Ends the game. Stopping all player movements. 
     * Disconnecting all clients after 10 seconds.
     * Closing game room.
     *  */ 
    public endGame() {
        // End the game. Note that the server give the player coins 
        // When they disconnect from the server.
        setTimeout(() => {
            this.gameOver = true;
        }, 6000)
    }

    public getEngine() {
        return this.engine;
    }

    public getPlayerManager() {
        return this.playerManager;
    }

    public getDungeonManager() {
        return this.dungeonManager;
    }

    public getProjectileManager() {
        return this.projectileManager;
    }

    public getEffectLogicManager() {
        return this.effectLogicManager
    }

    public getArtifactManager() {
        return this.artifactManager
    }

    public getAbilityManager() {
        return this.abilityManager
    }

    public getAuraManager() {
        return this.auraManager;
    }

    public getChestManager() {
        return this.chestManager;
    }

    /** Gets the EventEmitter for this GameManager. Used to send events throughout this game. */
    public getEventEmitter() {
        return this.eventEmitter;
    }

    /** Gets the configuration data for this game. */
    public getOptions() {
        return this.options;
    }

    /** Gets the set of assets that the client should load. */
    public getAssetSet() {
        return this.assetSet;
    }
}
