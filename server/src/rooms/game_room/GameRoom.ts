import { Client, Room, matchMaker } from "colyseus";
import State from "./schemas/State";
import GameManager from "./system/GameManager";
import ReconciliationInfo from "./schemas/ReconciliationInfo";
import globalEventEmitter from "../../util/EventUtil";

export interface GameRoomOptions {
    /** The name of the selected dungeon. */
    dungeonSelected: string;
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
        }, this.simulationInterval);
    }

    fixedTick(deltaT: number) {
        this.gameManager.update(deltaT);
        this.state.serverTickCount++;
        this.broadcastPatch(); //send patch updates to clients.
    }

    // update(deltaT:number) {
    //     this.gameManager?.update(deltaT);
    // }

    async onJoin(client: Client, options: any) {
        // Add a new player to the room state. The first player is the owner of the room.
        await this.gameManager?.getPlayerManager().createPlayer(client.sessionId, this.gameManager?.playerCount() === 0, options.IdToken, this.gameManager, options.roleId, options.onlineMode);
        this.state.reconciliationInfos.push(new ReconciliationInfo(client.sessionId));
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