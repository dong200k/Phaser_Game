import Matter from "matter-js";
import Player from "../gameobjs/Player";
import MathUtil from "../util/MathUtil";
import GameObject from "../gameobjs/GameObject";

interface GameObjectItem {
    gameObject: GameObject;
    body: Matter.Body;
    debugGraphic: Phaser.GameObjects.Graphics;
}

interface ServerStateQueueItem {
    tickCount: number;
    positionX: number;
    positionY: number;
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
    
    // Player1 info. Player1 is the player on the client. Other players are peers.
    private player1?: Player;
    private player1State?: any;
    private player1Body?: Matter.Body;

    // History information for server reconciliation.
    private history: Matter.World[] = [];
    private inputHistory: number[][] = [];
    // private historyStartTick: number = 0;

    private engine: Matter.Engine;
    private scene: Phaser.Scene;
    private gameObjectItems: GameObjectItem[] = [];

    // Client and server reconciliation information.
    private reconciliationInfo: any;
    private serverTickCount: number = 0;
    private clientTickCount: number = 8;

    private adjustmentId: number = 0;
    private currentlyAdjusting: boolean = false;
    private ticksToProcess: number = 0;

    private serverStateQueue: ServerStateQueueItem[] = [];


    // Debugging rectangles
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
        player1State.onChange = (changes: any) => {
            //Add changes to queue to be processed later.
            let queueItem: ServerStateQueueItem;
            queueItem = {
                tickCount: serverState.serverTickCount,
                positionX: player1State.x,
                positionY: player1State.y,
            }
            this.serverStateQueue.push(queueItem);
            while(this.serverStateQueue.length > 1) this.serverStateQueue.shift();
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
            this.saveToInputHistory(this.clientTickCount, playerMovementData);

            // ------ Tick Logic above -------
            if(this.currentlyAdjusting) {
                this.ticksToProcess--;
                if(this.ticksToProcess <= 0) {
                    this.adjustmentId = serverAdjustmentId;
                    this.currentlyAdjusting = false;
                }
            }
        } while(this.ticksToProcess > 0 && this.currentlyAdjusting);

        // ------- Server Reconciliation -------

        // For server reconciliation we will process the state from the server.
        // To process we will take the server's player position and simulate it again with our input history.

        // Process server queue items.
        while(this.serverStateQueue.length > 0) {
            let queueItem = this.serverStateQueue.shift();
            // Store the current player position.
            if(this.player1Body && this.player1 && queueItem) {
                // let currentX = this.player1Body?.position.x;
                // let currentY = this.player1Body?.position.y;

                // Get the server's tick.
                let serverTick = queueItem.tickCount;
                let serverX = queueItem.positionX;
                let serverY = queueItem.positionY;
                
                // play back the simulation.
                let ticksToRun = this.clientTickCount - serverTick;
                if(ticksToRun <= 0) {
                    // do nothing.
                } else {
                    // Update player position with that serverState's player position.
                    Matter.Body.setPosition(this.player1Body, {x: serverX, y: serverY});
                    
                    // Rerun the ticks starting from the serverTick all the way to clientTick.
                    while(ticksToRun > 0) {
                        let inputHistory = this.getInputHistoryAt(serverTick);
                        if(inputHistory) {
                            this.processPlayerMovement(inputHistory);
                            Matter.Engine.update(this.engine, deltaT);
                        }
                        ticksToRun--;
                        serverTick++;
                    }

                    // // Compare new and old state.
                    // let oldState = {x: currentX, y: currentY};
                    // let newState = {x: this.player1Body.position.x, y: this.player1Body.position.y};
                    // if(this.compareStates(oldState, newState)) {
                    //     // If the states match then we are good.
                    //     console.log("States matched!!!");
                    // } else {
                    //     // If the states dont match then we predicted incorrectly.
                    //     console.log("States dont match!!!");
                    // }
                }

            }
        }
        

    }

    private saveToInputHistory(clientTickCount: number, inputData: number[]) {
        let idx = clientTickCount % 1000;
        this.inputHistory[idx] = inputData;
    }

    private getInputHistoryAt(clientTickCount: number) {
        let idx = clientTickCount % 1000;
        return this.inputHistory[idx];
    }

    /**
     * Compares two states.
     * @param state1 The first state
     * @param state2 The second state
     * @returns True if the two states are close to the same. False otherwise.
     */
    private compareStates(state1: {x:number, y:number}, state2: {x:number,y:number}) {
        return Math.abs(state1.x - state2.x) < 0.001 && Math.abs(state1.y - state2.y) < 0.001;
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
        this.clientTickCount = this.serverTickCount;
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