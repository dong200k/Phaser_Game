import { type, Schema } from "@colyseus/schema";
import StateMachine from "./StateMachine";

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
    public getStateMachine<T extends StateMachine<unknown>>() {
        return this.stateMachine as T;
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
     * @param deltaT - The change in time since the last update, in seconds.
     */
    public abstract update(deltaT: number): void;
    
}