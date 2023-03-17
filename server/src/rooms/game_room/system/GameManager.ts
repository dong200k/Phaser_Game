import Matter, { Bodies } from 'matter-js';
import State from "../schemas/State";
import Player from '../schemas/gameobjs/Player';

export default class GameManager {

    private engine: Matter.Engine;
    private world: Matter.World;
    private state: State;

    private players:Map<string, Matter.Body> = new Map();

    constructor(state: State) {
        this.state = state;
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.engine.gravity.y = 0; //no gravity
        this.onCreate();
    }

    private onCreate() {
        this.initUpdateEvents();
        this.initCollisionEvent();
    }

    private initUpdateEvents() {
        Matter.Events.on(this.engine, "afterUpdate", () => {
            this.players.forEach((playerModel, key) => {
                let playerState = this.state.players.get(key);
                if(playerModel && playerState) {
                    playerState.x = playerModel.position.x;
                    playerState.y = playerModel.position.y;
                }
            })
        });
    }

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

    public createPlayer(sessionId: string, isOwner: boolean) {
        if(isOwner)
            this.state.ownerSessionId = sessionId;
        //TODO: get player data from the database
        let newPlayer = new Player("No Name");
        newPlayer.x = Math.random() * 500;
        newPlayer.y = Math.random() * 500;
        this.state.players.set(sessionId, newPlayer);

        //Create matterjs body
        let playerBody = Matter.Bodies.rectangle(newPlayer.x, newPlayer.y, 100, 100, {isStatic:false});
        this.players.set(sessionId, playerBody);
        Matter.Composite.add(this.world, playerBody);
        // Matter.Body.setVelocity(playerBody, {x:1, y:1});
    }

    public removePlayer(sessionId: string) {
        this.state.players.delete(sessionId);
        let playerBody = this.players.get(sessionId);
        if(playerBody) {
            Matter.Composite.remove(this.world, playerBody);
            this.players.delete(sessionId);
        }
    }

    public processPlayerInput(sessionId:string, data:number[]) {
        //data - array of inputs. [0] up, [1] down, [2] left, [3] right, [4] special, [5] mouse click, [6] mousex, [7] mousey.
        let playerBody = this.players.get(sessionId);
        let playerState = this.state.players.get(sessionId);
        if(playerBody && playerState) {
            //calculate new player velocity
            let speed = playerState.speed;
            let x = 0;
            let y = 0;
            if(data[0])
                y -= 1;
            if(data[1])
                y += 1;
            if(data[2])
                x -= 1;
            if(data[3])
                x += 1;
            let mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            x = x / mag * speed;
            y = y / mag * speed;
            Matter.Body.setVelocity(playerBody, {x, y});
        } else {
            console.log("ERROR: received inputs for a player that does not exist. sessionId: ", sessionId);
        }
    }

    public playerCount() {
        return this.state.players.size;
    }

    public getEngine() {
        return this.engine;
    }
}