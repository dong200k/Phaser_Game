import Matter, { Bodies } from 'matter-js';
import State from "../schemas/State";
import Player from '../schemas/gameobjs/Player';

export default class GameManager {

    private engine: Matter.Engine;
    private runner: Matter.Runner;
    private state: State;

    private players:Map<string, any> = new Map();

    constructor(state: State) {
        this.state = state;
        this.engine = Matter.Engine.create();
        this.runner = Matter.Runner.create();
        this.engine.gravity.y = 0; //no gravity
        this.onCreate();
    }

    private onCreate() {
        this.initUpdateEvents();
        this.initCollisionEvent();
        this.startGame();
    }

    private initUpdateEvents() {
        Matter.Events.on(this.engine, "afterUpdate", () => {
            for(let key in this.players) {
                let playerState = this.state.players.get(key);
                let playerModel = this.players.get(key);
                if(playerState && playerModel) {
                    playerState.x = playerModel.position.x;
                    playerState.y = playerModel.position.y;
                }
            }
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

    public startGame() {
        Matter.Runner.run(this.runner, this.engine);
    }

    public createPlayer(sessionId: string, isOwner: boolean) {
        //TODO: get player data from the database
        if(isOwner)
            this.state.ownerSessionId = sessionId;
        this.state.players.set(sessionId, new Player("No Name", isOwner));
    }

    public removePlayer(sessionId: string) {
        this.state.players.delete(sessionId);
    }

    public playerCount() {
        return this.state.players.size;
    }
}