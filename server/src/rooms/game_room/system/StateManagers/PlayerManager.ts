import Matter, { Bodies } from 'matter-js';
import State from '../../schemas/State';
import Player from '../../schemas/gameobjs/Player';

export default class PlayerManager{
    // Server side objects
    private players: Map<string, Matter.Body> = new Map();
    private engine: Matter.Engine
    private world: Matter.World

    // State shared between client and server
    private state: State

    constructor(engine: Matter.Engine, world: Matter.World, state: State) {
        this.engine = engine;
        this.state = state;
        this.world = world

        this.syncServerStateBasedOnGameState()
    }

    public syncServerStateBasedOnGameState(){
        Matter.Events.on(this.engine, "afterUpdate", () => {
            this.players.forEach((playerModel, key) => {
                let playerState = this.state.players.get(key);
                if(playerState) {
                    //sync player server position 
                    playerState.x = playerModel.position.x;
                    playerState.y = playerModel.position.y;
                }
            })
        });
    }

    public createPlayer(sessionId: string, isOwner: boolean) {
        if(isOwner) this.state.ownerSessionId = sessionId;

        //TODO: get player data from the database
        let newPlayer = new Player("No Name");
        newPlayer.x = Math.random() * 500;
        newPlayer.y = Math.random() * 500;

        //add player to shared state
        this.state.players.set(sessionId, newPlayer);

        //Create matterjs body for player
        let playerBody = Matter.Bodies.rectangle(newPlayer.x, newPlayer.y, 100, 100, {isStatic: false});
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
            if(mag !== 0) {
                x = x / mag * speed;
                y = y / mag * speed;
            }
            // console.log("speed: ", speed);
            // console.log("mag: ", mag);
            // console.log("x: " ,x, " y: ", y);
            Matter.Body.setVelocity(playerBody, {x, y});
        } else {
            console.log("ERROR: received inputs for a player that does not exist. sessionId: ", sessionId);
        }
    }

    public playerCount() {
        return this.state.players.size;
    }
}