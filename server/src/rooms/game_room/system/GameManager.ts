import Matter, { Bodies } from 'matter-js';
import State from "../schemas/State";
import Player from '../schemas/gameobjs/Player';
import PlayerManager from './StateManagers/PlayerManager';
import GameObject from '../schemas/gameobjs/GameObject';

export default class GameManager {
    private engine: Matter.Engine;
    private world: Matter.World;
    private state: State;

    public gameObjects: Map<string, Matter.Body> = new Map();

    constructor(state: State) {
        this.state = state;
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.engine.gravity.y = 0; //no gravity

        // this.playerManager = new PlayerManager(this.engine, this.world, state)

        this.initUpdateEvents();
        this.initCollisionEvent();
        this.syncServerStateBasedOnGameState();
    }

    public syncServerStateBasedOnGameState(){
        // sync object positions
        Matter.Events.on(this.engine, "afterUpdate", () => {
            this.gameObjects.forEach((obj, key) => {
                let objState = this.state.gameObjects.get(key);
                if(objState) {
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
        let body = Matter.Bodies.rectangle(obj.x, obj.y, 100, 100, {isStatic: false});
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
        newPlayer.x = Math.random() * 500;
        newPlayer.y = Math.random() * 500;

        this.addGameObject(sessionId, newPlayer)
    }   

    public processPlayerInput(sessionId:string, data:number[]) {
        console.log("process player input")
        //data - array of inputs. [0] up, [1] down, [2] left, [3] right, [4] special, [5] mouse click, [6] mousex, [7] mousey.
        let playerBody = this.gameObjects.get(sessionId);
        let playerState = this.state.gameObjects.get(sessionId) as Player;
        
        if(playerBody && playerState) {
            //calculate new player velocity
            let speed = playerState.speed;
            let x = 0;
            let y = 0;
            if(data[0]) y -= 1;
            if(data[1]) y += 1;
            if(data[2]) x -= 1;
            if(data[3]) x += 1;
            let mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            if(mag !== 0) {
                x = x / mag * speed;
                y = y / mag * speed;
            }
            Matter.Body.setVelocity(playerBody, {x, y});

            //special ability

            //attack
            if(data[5]){

            }
        } else {
            console.log("ERROR: received inputs for a player that does not exist. sessionId: ", sessionId);
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
            let pairs = event.pairs;
            pairs.forEach((pair, idx) => {
                // do something
            })
        })
    }

    public update(deltaT:number) {
        Matter.Engine.update(this.engine, deltaT);
    }

    public startGame() {
        // code to run when starting the game.
    }

    public getEngine() {
        return this.engine;
    }
}