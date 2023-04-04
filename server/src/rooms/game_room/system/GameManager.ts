import Matter, { Bodies } from 'matter-js';
import State from "../schemas/State";
import Player from '../schemas/gameobjs/Player';
import PlayerManager from './StateManagers/PlayerManager';
import GameObject from '../schemas/gameobjs/GameObject';
import Cooldown from '../schemas/gameobjs/Cooldown';
import TilemapManager from './StateManagers/TilemapManager';
import ProjectileManager from './StateManagers/ProjectileManager';

export default class GameManager {
    private engine: Matter.Engine;
    public world: Matter.World;

    // Managers
    private tilemapManager: TilemapManager;
    public playerManager: PlayerManager
    public projectileManager: ProjectileManager

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

        //Set up the tilemap
        this.tilemapManager = new TilemapManager(state);
        this.tilemapManager.loadTilemapTiled("assets/tilemaps/demo_map/demo_map.json").then(() => {
            this.tilemapManager.addObstaclesToMatter(this.engine, this.gameObjects);
        });

        this.initUpdateEvents();
        this.initCollisionEvent();
        this.syncServerStateBasedOnGameState();
    }

    public syncServerStateBasedOnGameState(){
        // sync object positions
        Matter.Events.on(this.engine, "afterUpdate", () => {
            this.gameObjects.forEach((obj, key) => {
                let objState = this.state.gameObjects.get(key);
                if(objState && !obj.isStatic) {
                    objState.x = obj.position.x;
                    objState.y = obj.position.y;
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
        Matter.Engine.update(this.engine, deltaT);

        this.playerManager.update(deltaT)

        // console.log(deltaT)
    }

    public startGame() {
        // code to run when starting the game.
    }

    public getEngine() {
        return this.engine;
    }
}