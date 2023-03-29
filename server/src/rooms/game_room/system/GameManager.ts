import Matter, { Bodies } from 'matter-js';
import State from "../schemas/State";
import Player from '../schemas/gameobjs/Player';
import PlayerManager from './StateManagers/PlayerManager';
import GameObject from '../schemas/gameobjs/GameObject';
import Cooldown from '../schemas/gameobjs/Cooldown';
import TilemapManager from './StateManagers/TilemapManager';

export default class GameManager {
    private engine: Matter.Engine;
    private world: Matter.World;
    private state: State;
    private attackCooldown: Cooldown
    private tilemapManager: TilemapManager;

    public gameObjects: Map<string, Matter.Body> = new Map();

    constructor(state: State) {
        this.state = state;
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.engine.gravity.y = 0; //no gravity

        // attack cooldown
        this.attackCooldown = new Cooldown(1000)

        // this.playerManager = new PlayerManager(this.engine, this.world, state)
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

    public addGameObject(id: string, obj: GameObject, data?: any) {
        // sync with server state
        this.state.gameObjects.set(id, obj);

        //Create matterjs body for obj
        let body = Matter.Bodies.rectangle(obj.x, obj.y, 49, 44, {
            isStatic: false,
            inertia: Infinity,
            inverseInertia: 0,
            restitution: 0,
            friction: 0,
        });
        this.gameObjects.set(id, body);

        Matter.Composite.add(this.world, body);
        // Matter.Body.setVelocity(playerBody, {x:1, y:1});
    }   

    public removeGameObject(id: string) {
        this.state.gameObjects.delete(id);

        let body = this.gameObjects.get(id);
        if(body) {
            Matter.Composite.remove(this.world, body);
            this.gameObjects.delete(id);
        }
    }

    public createPlayer(sessionId: string, isOwner: boolean) {
        if(isOwner) this.state.ownerSessionId = sessionId;

        //TODO: get player data from the database
        let newPlayer = new Player("No Name");
        newPlayer.x = Math.random() * 200 + 100;
        newPlayer.y = Math.random() * 200 + 100;

        this.addGameObject(sessionId, newPlayer);
    }   

    public processPlayerInput(sessionId:string, data:number[]) {
        //data - array of inputs. [0] up, [1] down, [2] left, [3] right, [4] special, [5] mouse click, [6] mousex, [7] mousey.
        let playerBody = this.gameObjects.get(sessionId);
        let playerState = this.state.gameObjects.get(sessionId) as Player;

        if(!playerBody || !playerState){
            console.log("ERROR: received inputs for a player that does not exist. sessionId: ", sessionId);
        }

        this.processPlayerMovement(playerState, playerBody as Matter.Body, data)
        this.processPlayerAttack(playerState, playerBody as Matter.Body, Boolean(data[5]), data[6], data[7], sessionId)

    }

    private processPlayerAttack(playerState: Player, playerBody: Matter.Body, mouseClick: boolean, mouseX: number, mouseY: number, playerId: string){
        if(this.attackCooldown.isFinished && mouseClick){
            this.attackCooldown.reset()
            console.log("attack")
            // spawn new game object/projectile at players position
            let obj = new GameObject(playerBody.position.x, playerBody.position.y, playerId)

            // sync with server state
            this.state.gameObjects.set(obj.id, obj);

            //Create matterjs body for obj
            let body = Matter.Bodies.rectangle(obj.x, obj.y, 10, 10, {isStatic: false});
            
            // so bullet does not collide with player
            body.collisionFilter = {
                'group': -1,
                'category': 2,
                'mask': 0,
            };
            this.gameObjects.set(obj.id, body);

            Matter.Composite.add(this.world, body);

            let [x,y] = this.getNormalizedSpeed(mouseX - obj.x, mouseY - obj.y, 10)
            Matter.Body.setVelocity(body, {x, y});
        }
    }

    private processPlayerMovement(playerState: Player, playerBody: Matter.Body, data: number[]){
        //calculate new player velocity
        let speed = playerState.stat.speed;
        let x = 0;
        let y = 0;
        if(data[0]) y -= 1;
        if(data[1]) y += 1;
        if(data[2]) x -= 1;
        if(data[3]) x += 1;
        [x,y] = this.getNormalizedSpeed(x, y, speed)
        Matter.Body.setVelocity(playerBody, {x, y});
    }

    public getNormalizedSpeed(x: number, y: number, speed: number){
        let mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        if(mag===0) return [0,0]
        return [x/mag * speed, y/mag * speed]
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
            console.log("collision detected")
            let pairs = event.pairs;
            pairs.forEach((pair, idx) => {
                // do something
                // console.log(pair)
            })
        })
    }

    public update(deltaT:number) {
        Matter.Engine.update(this.engine, deltaT);
        
        this.attackCooldown.tick(deltaT)

        // console.log(deltaT)
    }

    public startGame() {
        // code to run when starting the game.
    }

    public getEngine() {
        return this.engine;
    }
}