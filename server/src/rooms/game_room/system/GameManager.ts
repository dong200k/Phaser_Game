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

export default class GameManager {
    private engine: Matter.Engine;
    public world: Matter.World;

    // Managers
    public playerManager: PlayerManager
    public projectileManager: ProjectileManager;
    private effectManager: EffectManager;
    private dungeonManager: DungeonManager;

    // Data
    public gameObjects: Map<string, Matter.Body> = new Map();
    public state: State;

    constructor(state: State) {
        this.state = state;
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.engine.gravity.y = 0; //no gravity

        // Setup managers
        this.playerManager = new PlayerManager(this)
        this.projectileManager = new ProjectileManager(this)
        this.effectManager = new EffectManager(this);
        this.dungeonManager = new DungeonManager(this);
        EffectLogicManager.getManager().setGameManager(this)
        this.initUpdateEvents();
        this.initCollisionEvent();
        this.syncServerStateBasedOnGameState();
    }

    /**
     * Preloads asynchronous tasks such as getting upgrades and weapons from database.
     * so that they are available before other things are done.
     * *** TODO: Call this function and await it in GameRoom before game starts. ***
     */
    async preload(){
        await DatabaseManager.getManager().loadData()
        await ArtifactManager.preload()
    }

    public syncServerStateBasedOnGameState(){
        // sync object positions
        Matter.Events.on(this.engine, "afterUpdate", () => {
            this.gameObjects.forEach((obj, key) => {
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
     * @param id unique identifer of GameObject
     * @param obj  state/game object for sharing with client
     * @param body Matter.Body of game object for collision
     */
    public addGameObject(id: string, obj: GameObject, body: Matter.Body) {
        this.state.gameObjects.set(id, obj);
        obj.setBody(body);
        this.gameObjects.set(id, body);
        
        Matter.Composite.add(this.world, body);
    }   

    /**
     * removes game object from the server's state, from the GameManager, and from the Matter.Composite
     * @param id unique identifer for game object
     */
    public removeGameObject(id: string) {
        this.state.gameObjects.delete(id);

        let body = this.gameObjects.get(id);
        if(body) {
            Matter.Composite.remove(this.world, body);
            this.gameObjects.delete(id);
        }
    }

    public playerCount(){
        let count = 0;
        this.gameObjects.forEach((gameObject, key)=>{
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
                // do something
                // console.log(pair)
            })
        })
    }

    public update(deltaT:number) {
        let deltaTSeconds = deltaT / 1000;
        Matter.Engine.update(this.engine, deltaT);

        this.playerManager.update(deltaT);
        this.effectManager.update(deltaTSeconds);
        this.dungeonManager.update(deltaTSeconds);

        // console.log(deltaT)
    }

    public startGame() {
        // code to run when starting the game.
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
}