import { Client, Room, matchMaker } from "colyseus";
import State from "./schemas/State";
import GameManager from "./system/GameManager";

export default class GameRoom extends Room<State> {
    autoDispose = false;
    
    private gameManager?: GameManager

    onCreate() {
        console.log(`Created: Game room ${this.roomId}`);

        //Game rooms are private and can only be joined by id.
        this.setPrivate(true);

        //If no one joins the game room, dispose it.
        setTimeout(() => this.autoDispose = true, 5000);

        //Setting up state and game manager.
        this.setPatchRate(22);
        let state = new State();
        this.gameManager = new GameManager(state);
        this.setState(state);
        this.initListeners();
        this.startGame();
    }

    initListeners() {
        this.onMessage("move", (client, msg)=>{
            this.gameManager?.playerManager.processPlayerMovement(client.sessionId, msg)
        })

        this.onMessage("attack", (client, msg)=>{
            this.gameManager?.playerManager.processPlayerAttack(client.sessionId, msg)
        })

        this.onMessage("special", (client, msg)=>{
            this.gameManager?.playerManager.processPlayerSpecial(client.sessionId, msg)
        })
    }

    startGame() {
        this.gameManager?.startGame();

        // Game Loop
        this.setSimulationInterval((deltaT) => this.gameManager?.update(deltaT));
    }

    update(deltaT:number) {
        this.gameManager?.update(deltaT);
    }

    onJoin(client: Client) {
        // Add a new player to the room state. The first player is the owner of the room.
        this.gameManager?.playerManager.createPlayer(client.sessionId, this.gameManager?.playerCount() === 0);
    }

    onLeave(client: Client) {
        // removes player from list of gameobjects
        this.gameManager?.removeGameObject(client.sessionId);
    }

    onDispose() {
        console.log(`Disposed: Game room ${this.roomId}`);
    }
}