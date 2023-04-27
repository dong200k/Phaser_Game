import Entity from "../../../schemas/gameobjs/Entity.js";
import StateMachine from "./StateMachine.js";

export default abstract class StateNode<Data>
{
    private stateName: string;
    private stateMachine: StateMachine<Data>;
    private entity: Entity;
    /**
     * Creates a new state. Some examples states include, idle, walk, aggro, etc.
     * @param stateName The name of the state.
     * @param stateMachine The StateMachine that this state will belong to.
     * @param entity The entity.
     */
    constructor(stateName: string, stateMachine: StateMachine<Data>, entity: Entity) {
        this.stateName = stateName;
        this.stateMachine = stateMachine;
        this.entity = entity;
    }

    /**
     * Gets the state's name.
     * @returns The state name;
     */
    public getStateName() {
        return this.stateName;
    }

    /**
     * Gets the entity that this state is attatched to.
     * @returns The entity.
     */
    public getEntity() {
        return this.entity;
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