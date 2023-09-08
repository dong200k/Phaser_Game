import { Client, Room, matchMaker } from "colyseus";
import State from "./schemas/State";
import GameManager from "./system/GameManager";
import ReconciliationInfo from "./schemas/ReconciliationInfo";
import globalEventEmitter from "../../util/EventUtil";

export interface GameRoomOptions {
    /** The name of the selected dungeon. */
    dungeonSelected: string;
}

interface WaitingClient { 
    client: Client;
    options: any;
    state: "loading" | "ready" | "justjoined";
}

export default class GameRoom extends Room<State> {
    //autoDispose = false;
    
    private gameManager!: GameManager;

    /** The time for our gameRoom to update once in milliseconds. 
     * Note: this is different from the server tick rate. 
     */
    private simulationInterval: number = 16.6;

    // ------- fixed tick --------
    private timePerTick = 33.33; // 20 ticks per second.
    private timeTillNextTick!: number;

    // ------- client load queue -------
    private waitingClients: WaitingClient[] = [];

    onCreate(options: GameRoomOptions) {
        console.log(`Created: Game room ${this.roomId}`);
        this.timeTillNextTick = this.timePerTick;

        //Game rooms are private and can only be joined by id.
        this.setPrivate(true);

        // //If no one joins the game room, dispose it.
        // setTimeout(() => this.autoDispose = true, 10000);

        //Disable automatically sending patches.
        this.setPatchRate(0);

        //Setting up state and game manager.
        let state = new State();
        this.gameManager = new GameManager(state, options);
        this.setState(state);
        
        this.gameManager.preload()
            .then(()=>{
                this.startGame();
                this.initListeners();
            })
        
    }

    initListeners() {
        this.onMessage("move", (client, msg)=>{
            // Queue up player's movement so that the playerManager can process them next update.
            this.gameManager.getPlayerManager().queuePlayerMovement(client.sessionId, msg);
        })

        this.onMessage("attack", (client, msg)=>{
            this.gameManager.getPlayerManager().processPlayerAttack(client.sessionId, msg)
        })

        this.onMessage("special", (client, msg)=>{
            this.gameManager.getPlayerManager().processPlayerSpecial(client.sessionId, msg)
            //this.gameManager?.playerManager.processPlayerMovement(client.sessionId, msg)
            
        })

        this.onMessage("selectUpgrade", (client, msg) => {
            this.gameManager.getPlayerManager().processPlayerSelectUpgrade(client.sessionId, msg);
        })

        this.onMessage("loadAssetComplete", (client, msg) => {
            console.log(client.id, " Finished loading");
            this.waitingClients.forEach((waitingClient) => {
                if(waitingClient.client.id === client.id) {
                    waitingClient.state = "ready";
                }
            })
        })

        // this.onMessage("input", (client, msg) => {

        // })
    }

    startGame() {
        this.gameManager.startGame();
        // Game Loop
        this.setSimulationInterval((deltaT) => {
            this.timeTillNextTick -= deltaT;
            while(this.timeTillNextTick <= 0) {
                if(this.timeTillNextTick < -this.timePerTick * 5) {
                    console.warn(`Game Room: ${this.roomId} is more than 5 ticks behind, dropping ticks.`);
                    this.timeTillNextTick = 0;
                }
                this.timeTillNextTick += this.timePerTick;
                this.fixedTick(this.timePerTick);
            }
            if(this.gameManager.gameOver) this.disconnect();
        }, this.simulationInterval);
    }

    fixedTick(deltaT: number) {
        this.processWaitingClients();
        this.gameManager.update(deltaT);
        this.state.serverTickCount++;
        this.broadcastPatch(); //send patch updates to clients.
    }

    private processWaitingClients() {
        for(let i = this.waitingClients.length - 1; i >= 0; i--) {
            let waitingClient = this.waitingClients.at(i);
            if(waitingClient) {
                let client = waitingClient.client;
                if(waitingClient.state === "justjoined") {
                    // send client assets to load.
                    let assetSet = this.gameManager.getAssetSet();
                    let assetList: string[] = [];
                    assetSet.forEach(value => assetList.push(value));
                    client.send("loadAssets", assetList);
                    waitingClient.state = "loading";
                } else if(waitingClient.state === "loading") {

                } else if(waitingClient.state === "ready") {
                    let options = waitingClient.options;
                    // Add a new player to the room state. The first player is the owner of the room.
                    this.gameManager?.getPlayerManager().createPlayer(client.sessionId, this.gameManager?.playerCount() === 0, options.IdToken, this.gameManager, options.roleId, options.onlineMode).then(() => {
                        this.state.reconciliationInfos.push(new ReconciliationInfo(client.sessionId));
                    });
                    this.waitingClients.splice(i, 1);
                }
            }

        }
    }

    // update(deltaT:number) {
    //     this.gameManager?.update(deltaT);
    // }

    onJoin(client: Client, options: any) {
        this.waitingClients.push({client, options, state: "justjoined"});
    }

    onLeave(client: Client) {
        // removes player from list of gameobjects
        this.gameManager.getPlayerManager().removePlayer(client.sessionId);
        for(let i = this.state.reconciliationInfos.length - 1; i >= 0; i--) {
            if(this.state.reconciliationInfos[i].clientId === client.sessionId) this.state.reconciliationInfos.deleteAt(i);
        }
    }

    onDispose() {
        console.log(`Disposed: Game room ${this.roomId}`);
        globalEventEmitter.emit(`GameFinished${this.roomId}`);
    }
}