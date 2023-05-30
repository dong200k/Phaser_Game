import Matter, { Common } from "matter-js";
import Player from "../gameobjs/Player";
import MathUtil from "../util/MathUtil";
import GameObject from "../gameobjs/GameObject";

interface PlayerInput {

}

interface GameObjectAndBodyPair {
    gameObject: GameObject;
    body: Matter.Body;
}

/**
 * The ClientSidePrediction class will manage the prediction of player1 to match that of the server's.
 * Its main purpose would be movement prediction. Which would consist of the following:
 *  - Movement from WASD
 *  - Movement blocked by obstacles
 *  - Animations from movement
 * 
 * To accomplish this updates on both the client and server would need to be deterministic.
 */
export default class ClientSidePrediction {
    
    private player1?: Player;
    private player1State?: any;
    private player1Body?: Matter.Body;
    private history: Matter.World[] = [];
    private historyStartTick: number = 0;
    private engine: Matter.Engine;
    private gameObjectPairs: GameObjectAndBodyPair[] = [];

    private serverTickCount: number = 0;
    private clientTickCount: number = 0;

    constructor() {
        this.engine = Matter.Engine.create();
        this.engine.gravity.y = 0;
        // let worldClone = Matter.Common.clone(this.engine.world, true);
        this.initializeEvents();
    }

    public addPlayer1(player1: Player, player1State: any, serverState: any) {
        this.player1 = player1;
        this.player1State = player1State;
        serverState.onChange = (changes: any) => {
            this.serverTickCount = serverState.serverTickCount;
        }
    }

    public getPlayer1AndBody() {
        if(this.player1Body === undefined) {
            this.gameObjectPairs.forEach((pair) => {
                if(pair.gameObject === this.player1) this.player1Body = pair.body;
            })
        }
        return {player1: this.player1, body: this.player1Body};
    }

    public update(deltaT: number, playerMovementData: number[]) {
        this.processPlayerMovement(playerMovementData);
        Matter.Engine.update(this.engine, deltaT);
        this.clientTickCount++;

        console.log(this.clientTickCount - this.serverTickCount);
    }

    private initializeEvents() {
        // sync player position
        Matter.Events.on(this.engine, "afterUpdate", () => {
            let {player1, body} = this.getPlayer1AndBody();
            if(player1 && body) {
                player1.serverX = body.position.x;
                player1.serverY = body.position.y;
            }
        });
    }

    
    private processPlayerMovement(data: number[]) {
        let {player1, body} = this.getPlayer1AndBody();
        //calculate new player velocity
        let speed = player1?.getStat().speed;
        let x = 0;
        let y = 0;
        if(data[0]) y -= 1;
        if(data[1]) y += 1;
        if(data[2]) x -= 1;
        if(data[3]) x += 1;
        let velocity = MathUtil.getNormalizedSpeed(x, y, speed ?? 0);
        if(body) Matter.Body.setVelocity(body, velocity);
    }

    public processTick() {

    }

    public addGameObject(gameObject: GameObject) {
        let gameObjectAndBodyPair = {
            gameObject: gameObject,
            body: Matter.Bodies.rectangle(gameObject.serverX, gameObject.serverY, gameObject.width, gameObject.height, {
                isStatic: false,
                isSensor: true,
                inverseInertia: 0,
                restitution: 0,
                friction: 0,
            })
        }

        this.gameObjectPairs.push(gameObjectAndBodyPair);
        Matter.Composite.add(this.engine.world, gameObjectAndBodyPair.body);
    }

    public serverReconciliation() {

    }
}