import StateMachine from "../../StateMachine/StateMachine";
import Player from "../../../schemas/gameobjs/Player";
import Idle from "./CommonStates/Idle";
import Dead from "./CommonStates/Dead";
import Attack from "./CommonStates/Attack";
import Move from "./CommonStates/Move";
import Special from "./CommonStates/Special";


export interface PlayerControllerData {
    player: Player;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class PlayerController extends StateMachine<PlayerControllerData> {

    private player!: Player;

    private attackState!: Attack;
    private specialState!: Special;

    protected create(data: PlayerControllerData): void {
        this.player = data.player;

        //Add States
        let idleState = new Idle("Idle", this);
        this.addState(idleState);
        
        let attackState = new Attack("Attack", this);
        this.addState(attackState);
        this.attackState = attackState;
        attackState.setConfig({
            canMove: false,
            triggerPercent: 0.9,
        });

        let moveState = new Move("Move", this);
        this.addState(moveState);

        let deadState = new Dead("Dead", this);
        this.addState(deadState);

        let specialState = new Special("Special", this)
        this.specialState = specialState
        specialState.setConfig({
            canMove: false,
            triggerPercent: 0.9,
        })
        this.addState(specialState)

        //Set initial state
        this.changeState("Idle");
    }

    public postUpdate(deltaT: number): void {
        let currentState = this.getState();
        // If the player has 0 hp, change to the death state.
        if(this.player.active && this.player.stat.hp <= 0 && 
            currentState !== null && currentState.getStateName() !== "Dead") {
            this.changeState("Dead");
        }
    }

    public getPlayer() {
        return this.player;
    }

    /** Changes this player's state to attack, but only if the 
     * player is not dead, using special or attacking already.
     */
    public startAttack(mouseX:number, mouseY:number) {
        if(this.stateName !== "Dead" && this.stateName !== "Attack" && this.stateName !== "Special") {
            this.attackState?.setConfig({mouseX, mouseY});
            this.changeState("Attack");
        }
    }

    /** Changes this player's state to special, but only if the 
     * player is not dead or using special already.
     */
    public startSpceial(mouseX:number, mouseY:number) {
        if(this.stateName !== "Dead" && this.stateName !== "Special") {
            this.specialState?.setConfig({mouseX, mouseY});
            this.changeState("Special");
        }
    } 
}