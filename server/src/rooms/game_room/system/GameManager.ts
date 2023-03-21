import Matter, { Bodies } from 'matter-js';
import State from "../schemas/State";
import Player from '../schemas/gameobjs/Player';
import PlayerManager from './StateManagers/PlayerManager';

export default class GameManager {
    private engine: Matter.Engine;
    private world: Matter.World;
    private players:Map<string, Matter.Body> = new Map();
    private state: State;

    public playerManager: PlayerManager;

    constructor(state: State) {
        this.state = state;
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.engine.gravity.y = 0; //no gravity

        this.playerManager = new PlayerManager(this.engine, this.world, state)

        this.initUpdateEvents();
        this.initCollisionEvent();
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