import StateMachine from "./StateMachine.js";
import { type, Schema } from "@colyseus/schema";

export default abstract class StateNode extends Schema
{
    @type("string") private stateName: string;
    private stateMachine: StateMachine<unknown>;
    
    /**
     * Creates a new state. Some examples states include, idle, walk, aggro, etc.
     * @param stateName The name of the state.
     * @param stateMachine The StateMachine that this state will belong to.
     */
    constructor(stateName: string, stateMachine: StateMachine<unknown>) {
        super();
        this.stateName = stateName;
        this.stateMachine = stateMachine;
    }

    /**
     * Gets the state's name.
     * @returns The state name;
     */
    public getStateName() {
        return this.stateName;
    }
    
    /**
     * Gets the StateMachine that this state is attatched to.
     * Can be used to change the state.
     * @returns The StateMachine.
     */
    public getStateMachine() {
        return this.stateMachine;
    }

    /**
     * Called by the StateMachine once when changing to this state.
     */
    public abstract onEnter(): void;

    /**
     * Called by the StateMachine once when leaving this state.
     */
    public abstract onExit(): void;

    /**
     * Called by the StateMachine every update.
     * @param deltaT - The change in time.
     */
    public abstract update(deltaT: number): void;
    
}