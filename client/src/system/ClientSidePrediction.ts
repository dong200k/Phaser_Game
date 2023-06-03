import Matter, { Common } from "matter-js";
import Player from "../gameobjs/Player";
import MathUtil from "../util/MathUtil";
import GameObject from "../gameobjs/GameObject";

interface PlayerInput {

}

interface GameObjectItem {
    gameObject: GameObject;
    body: Matter.Body;
    debugGraphic: Phaser.GameObjects.Graphics;
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
    private inputHistory: number[] = [];
    private historyStartTick: number = 0;
    private engine: Matter.Engine;
    private scene: Phaser.Scene;
    private gameObjectItems: GameObjectItem[] = [];

    private reconciliationInfo: any;
    private serverTickCount: number = 0;
    private clientTickCount: number = 8;

    // The adjustmentId that the client has processed.
    private adjustmentId: number = 0;
    private currentlyAdjusting: boolean = false;
    private ticksToProcess: number = 0;

    private debugGraphicsVisible: boolean = false;

    private matterBodyConfig = {
        Player: {
            isStatic: false,
            isSensor: false,
            inertia: Infinity,
            inverseInertia: 0,
            restitution: 0,
            friction: 0,
        },
        Tile: {
            isStatic: true,
            isSensor: false,
            inverseInertia: 0,
            restitution: 0,
            friction: 0,
        }
    }

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
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
        serverState.reconciliationInfos.onAdd = (item: any, key: any) => {
            this.reconciliationInfo = item; 
        }
    }

    public getPlayer1AndBody() {
        if(this.player1Body === undefined) {
            this.gameObjectItems.forEach((item) => {
                if(item.gameObject === this.player1) this.player1Body = item.body;
            })
        }
        return {player1: this.player1, body: this.player1Body};
    }

    public update(deltaT: number, playerMovementData: number[]) {

        // ------- Server Tick Sync -------

        let adjustmentAmount = this.reconciliationInfo?.adjustmentAmount ?? 0;
        let serverAdjustmentId = this.reconciliationInfo?.adjustmentId ?? 0;

        // Checks if server sent adjustment request.
        if(!this.currentlyAdjusting && serverAdjustmentId !== this.adjustmentId) {
            if(Math.abs(this.clientTickCount - this.serverTickCount) > 20) {
                this.hugeLagSpikeReconciliation();
                this.adjustmentId = serverAdjustmentId;
                this.currentlyAdjusting = false;
            } else {
                this.ticksToProcess = adjustmentAmount;
                this.currentlyAdjusting = true;
            }
        }

        if(this.serverTickCount % 20 === 0) {
            console.log(`Adjusting: ${this.currentlyAdjusting}, Amount: ${this.ticksToProcess}`);
            console.log(`AdjustId: ${this.adjustmentId}, ServerAdjustId: ${serverAdjustmentId}`);
            console.log(this.reconciliationInfo);
        }
        

        // Skip ticks.
        if(this.currentlyAdjusting && this.ticksToProcess < 0) {
            this.ticksToProcess++;
            if(this.ticksToProcess >= 0) {
                this.adjustmentId = serverAdjustmentId;
                this.currentlyAdjusting = false;
            }
            return;
        } 

        do {
            // ------ Tick Logic below -------

            this.processPlayerMovement(playerMovementData);
            Matter.Engine.update(this.engine, deltaT);
            if(this.debugGraphicsVisible) this.updateDebugGraphics();
            this.clientTickCount++;

            // ------ Tick Logic above -------

            if(this.currentlyAdjusting) {
                this.ticksToProcess--;
                if(this.ticksToProcess <= 0) {
                    this.adjustmentId = serverAdjustmentId;
                    this.currentlyAdjusting = false;
                }
            }
        } while(this.ticksToProcess > 0 && this.currentlyAdjusting);
    }

    /**
     * Gets the adjustmentId that represents which adjustment the client has completed.
     * @returns The adjustmentId.
     */
    public getAdjustmentId() {
        return this.adjustmentId;
    }

    /**
     * Recover from a lag spike where the client's and server's tick count 
     * differ massively. 
    */
    private hugeLagSpikeReconciliation() {
        this.clientTickCount = this.serverTickCount + 5;
        let {player1, body} = this.getPlayer1AndBody();
        if(player1 && body) {
            player1.serverX = this.player1State.x;
            player1.serverY = this.player1State.y;
        }
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

        // Matter.Events.on(this.engine, "collisionStart", () => {
        //     //console.log("collision");
        // })
    }

    private updateDebugGraphics() {
        this.gameObjectItems.forEach((item) => {
            let graphics = item.debugGraphic;
            let gameObj = item.gameObject;
            graphics.setX(gameObj.serverX);
            graphics.setY(gameObj.serverY);
        })
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

    public setDebugGraphicsVisible(value: boolean) {
        if(value === true) {
            this.updateDebugGraphics();
            this.gameObjectItems.forEach(item => item.debugGraphic.setVisible(true));
        }
        else this.gameObjectItems.forEach(item => item.debugGraphic.setVisible(false));
        this.debugGraphicsVisible = value;
    }

    public getDebugGraphicsVisible() {
        return this.debugGraphicsVisible;
    }

    public processTick() {

    }

    public getClientTickCount() {
        return this.clientTickCount;
    }

    public addGameObject(gameObject: GameObject) {

        let matterConfig = {
            isStatic: false,
            isSensor: true,
            inverseInertia: 0,
            restitution: 0,
            friction: 0,
        };

        if(gameObject.serverState.type === "Tile") matterConfig = this.matterBodyConfig["Tile"];
        if(gameObject.serverState.type === "Player") matterConfig = this.matterBodyConfig["Player"];

        let gameObjectItem = {
            gameObject: gameObject,
            body: Matter.Bodies.rectangle(gameObject.serverX, gameObject.serverY, gameObject.width, gameObject.height, matterConfig),
            debugGraphic: this.scene.add.graphics({lineStyle: {width: 1, color: 0x0000cc}})
                .strokeRect(-gameObject.width / 2,-gameObject.height / 2, gameObject.width, gameObject.height)
                .setVisible(this.debugGraphicsVisible)
                .setDepth(10),
        }            

        this.gameObjectItems.push(gameObjectItem);
        Matter.Composite.add(this.engine.world, gameObjectItem.body);
    }

    public serverReconciliation() {

    }
}