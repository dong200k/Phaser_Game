import Matter from "matter-js";
import Player from "../gameobjs/Player";
import MathUtil from "../util/MathUtil";
import GameObject from "../gameobjs/GameObject";
import GameManager from "./GameManager";

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

interface PlayerBounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
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
    private inputHistory: number[][] = [];

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

    private playerBounds: PlayerBounds | null = null;


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
            let queueItem: ServerStateQueueItem;
            queueItem = {
                tickCount: serverState.serverTickCount,
                positionX: player1State.x,
                positionY: player1State.y,
            }
            this.serverStateQueue.push(queueItem);
            while(this.serverStateQueue.length > 1) this.serverStateQueue.shift();
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

    /**
     * Updates the ClientSidePrediction
     * @param deltaT deltaT milliseconds.
     * @param playerMovementData The player movement data.
     */
    public update(deltaT: number, playerMovementData: number[]) {

        if(this.debugGraphicsVisible) this.updateDebugGraphics();

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

        // Skip ticks. (Server asking client to slow down.)
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
            this.processPlayerMovement(playerMovementData, deltaT);
            Matter.Engine.update(this.engine, deltaT);
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
        } while(this.ticksToProcess > 0 && this.currentlyAdjusting); // process more ticks. (Server asking client to speed up.)


        this.serverReconciliation(deltaT);
        this.updatePlayerMovementAnimation(playerMovementData);
    }

    /**
     * Called to match up the client's position with the server's position.
     * @param deltaT The deltaT.
     */
    private serverReconciliation(deltaT: number) {
        // Process server queue items.
        while(this.serverStateQueue.length > 0) {
            let queueItem = this.serverStateQueue.shift();
            // Store the current player position.
            if(this.player1Body && this.player1 && queueItem) {
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
                            this.processPlayerMovement(inputHistory, deltaT);
                            Matter.Engine.update(this.engine, deltaT);
                        }
                        ticksToRun--;
                        serverTick++;
                    }
                }
            }
        }
    }

    /**
     * Saves the input data to the history circular buffer.
     * @param clientTickCount The client tick count.
     * @param inputData The input data.
     */
    private saveToInputHistory(clientTickCount: number, inputData: number[]) {
        let idx = clientTickCount % 100;
        this.inputHistory[idx] = inputData;
    }

    /**
     * Gets the input data at a clientTickCount.
     * @param clientTickCount The clientTickCount.
     * @returns The input data.
     */
    private getInputHistoryAt(clientTickCount: number) {
        let idx = clientTickCount % 100;
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
     * differs massively. 
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

    /**
     * Updates the position of the debug graphics based on the server's position.
     */
    private updateDebugGraphics() {
        this.gameObjectItems.forEach((item) => {
            let graphics = item.debugGraphic;
            let gameObj = item.gameObject;
            graphics.setX(gameObj.serverX);
            graphics.setY(gameObj.serverY);
        })
    }
    
    /** Updates the player's velocity based on the player's movement input.
     * @param data The player's movement input.
     * @param deltaT deltaT milliseconds.
     */
    private processPlayerMovement(data: number[], deltaT: number) {
        let {player1, body} = this.getPlayer1AndBody();
        //calculate new player velocity
        if(player1 && body) {

            // If the player is dead prevent movement. If the player cannot move prevent movement.
            if(player1.getPlayerState().playerController.stateName === "Dead"
            || !player1.getPlayerState().canMove ) {
                Matter.Body.setVelocity(body, {x: 0, y: 0});
                return; 
            }

            let speed = (player1.getStat().speed ?? 0) * (deltaT / 1000);
            let x = 0;
            let y = 0;
            if(data[0]) y -= 1;
            if(data[1]) y += 1;
            if(data[2]) x -= 1;
            if(data[3]) x += 1;
            let velocity = MathUtil.getNormalizedSpeed(x, y, speed ?? 0);

            // If the velocity would send the player off bounds, update it so that the player wont go off bounds.
            let bounds = this.playerBounds;
            if(bounds) {
                let minX = body.bounds.min.x;
                let minY = body.bounds.min.y;
                let maxX = body.bounds.max.x;
                let maxY = body.bounds.max.y;
                if(velocity.x > 0) {
                    let distanceToMax = bounds.maxX - maxX;
                    velocity.x = Math.min(velocity.x, distanceToMax);
                } else if(velocity.x < 0) {
                    let distanceToMin = bounds.minX - minX;
                    velocity.x = Math.max(velocity.x, distanceToMin);
                }
                if(velocity.y > 0) {
                    let distanceToMax = bounds.maxY - maxY;
                    velocity.y = Math.min(velocity.y, distanceToMax);
                } else if(velocity.y < 0) {
                    let distanceToMin = bounds.minY - minY;
                    velocity.y = Math.max(velocity.y, distanceToMin);
                }
            }

            Matter.Body.setVelocity(body, velocity);
        }
    }

    /** Updates the player's movement animation, based on the player's body velocity. */
    private updatePlayerMovementAnimation(movementData: number[]) {
        let {player1, body} = this.getPlayer1AndBody();
        if(player1 && body && player1.getPlayerState().playerController.stateName !== "Dead") {
            let velocityX = body.velocity.x;
            let velocityY = body.velocity.y;

            /** Flip the player's sprite based on if they are pressing left or right. */
            if(!(movementData[2] && movementData[3])) {
                if(movementData[2]) player1.setFlip(true, false);
                else if(movementData[3]) player1.setFlip(false, false);
            }
    
            if(velocityX === 0 && velocityY === 0) {
                if(player1.anims.getName() !== "idle") {
                    //player1.play({key: "idle", repeat: -1});
                    player1.running = false;
                }
            } else {
                if(!player1.running) {
                    //player1.play({key: "run", repeat: -1});
                    player1.running = true;
                }
            }
        }
    }

    public setDebugGraphicsVisible(value: boolean) {
        if(value === true) {
            this.updateDebugGraphics();
            this.gameObjectItems.forEach(item => item.debugGraphic.setVisible(true));
        }
        else this.gameObjectItems.forEach(item => item.debugGraphic.setVisible(false));
        this.debugGraphicsVisible = value;
    }

    public isDebugGraphicsVisible() {
        return this.debugGraphicsVisible;
    }

    public getClientTickCount() {
        return this.clientTickCount;
    }

    /**
     * Adds a gameobject to this ClientSidePrediction. 
     * The gameobject is used to better predict the player's movement (E.g. walls should stop the player).
     * @param gameObject A gameobject.
     */
    public addGameObject(gameObject: GameObject) {

        let matterConfig = {
            isStatic: false,
            isSensor: true,
            inverseInertia: 0,
            restitution: 0,
            friction: 0,
        };

        if(gameObject.gameObjectState.type === "InvisObstacle") matterConfig = this.matterBodyConfig["Tile"];
        if(gameObject.gameObjectState.type === "Tile") matterConfig = this.matterBodyConfig["Tile"];
        if(gameObject.gameObjectState.type === "Player") matterConfig = this.matterBodyConfig["Player"];

        let width = gameObject.gameObjectState.width;
        let height = gameObject.gameObjectState.height;

        let gameObjectItem = {
            gameObject: gameObject,
            body: Matter.Bodies.rectangle(gameObject.serverX, gameObject.serverY, width, height, matterConfig),
            debugGraphic: this.scene.add.graphics({lineStyle: {width: 1, color: 0x0000cc}})
                .strokeRect(-width / 2,-height / 2, width, height)
                .fillCircle(0, 0, 2)
                .setVisible(this.debugGraphicsVisible)
                .setDepth(100),
        }
        
        if(gameObject.gameObjectState.type === "Monster") {
            gameObjectItem.body.collisionFilter = {
                group: -1,
                mask: 0,
            }
        }

        this.gameObjectItems.push(gameObjectItem);
        Matter.Composite.add(this.engine.world, gameObjectItem.body);
    }

    /**
     * Removes the given GameObject from this ClientSidePrediction. This will remove the Matter.Body representation
     * of this GameObject and the DebugGraphics for this GameObject.
     * @param gameObject The GameObject to be removed.
     */
    public removeGameObject(gameObject: GameObject) {
        this.gameObjectItems = this.gameObjectItems.filter((item) => {
            if(item.gameObject === gameObject) {
                // remove debug graphics.
                item.debugGraphic.destroy();
                // remove matter body.
                Matter.Composite.remove(this.engine.world, item.body);
                return false;
            } else {
                return true;
            }
        })
    }

    /**
     * Updates the player's world bounds. This will restrict the player's movement
     * to within these bounds.
     * @param minX minX
     * @param minY minY
     * @param maxX maxX
     * @param maxY maxY
     */
    public updatePlayerBounds(minX: number, minY: number, maxX: number, maxY:number) {
        this.playerBounds = { minX, minY, maxX, maxY };
    }
}