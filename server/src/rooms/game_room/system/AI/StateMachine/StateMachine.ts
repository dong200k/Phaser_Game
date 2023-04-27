import Entity from "../../../schemas/gameobjs/Entity.js";
import StateNode from "./StateNode.js";

/**
 * The StateMachine will store all the state of a particular Mob. It will provide 
 * methods to change the state, as well as revert to a previous state. The 
 * creator of this class will need to call update() to update the StateMachine.
 */
export default abstract class StateMachine<Data> {
    /** stores the states of this stateMachine. */
    private states: StateNode<Data>[];
    /** stores the current state of this stateMachine. */
    private currentState: StateNode<Data> | null;
    /** stores the previous state of this stateMachine. */
    private previousState: StateNode<Data> | null;
    /** A flag that marks if the create() methods had been called yet or not. */
    private created: boolean;

    // Some temp data used when calling the create method.
    private tempEntity: Entity;
    private tempData: Data;

    /**
     * Creates a new StateMachine and initialize the variables for the state machine. 
     * @param entity the sprite that will have this StateMachine.
     * @param data - some extra data you can pass in for your convinence. This will be passed to the create method.
     */
    constructor(entity: Entity, data: Data) {
        this.states = [];
        this.currentState = null;
        this.previousState = null;
        this.created = false;
        this.tempEntity = entity;
        this.tempData = data;
    }


    /**
     * This method will be overridden by child classes. The sprite and data have been passed in for you to use.
     * @param entity The entity
     * @param data The data.
     */
    protected abstract create(entity: Entity, data: Data): void;

    /**
     * Add a state to the state machine.
     * @param state - The state node.
     * @throws Error if the state's name is not unique.
     */
    public addState(state: StateNode<Data>) {
        let dupName = this.states.filter((s) => s.getStateName() === state.getStateName());
        if(dupName.length > 0) throw new Error(`Duplicate state name {${dupName[0].getStateName()}} when adding to the StateMachine!`);
        this.states.push(state);
    }

    /** Clear all the states inside this StateMachine. */
    public clearStates() {
        while (this.states.length > 0) this.states.pop();
    }

    /**
     * Changes the current state to another based on a state's name. Note: If there are duplicate stateNames, the state that 
     * is added 
     * @param stateName The state's name.
     */
    changeState(stateName: string) {
        let newState = null;
        
        let matchingStates = this.states.filter(state => { return state.getStateName() === stateName });
        if (matchingStates.length > 0)
            newState = matchingStates[0];
        

        if(newState) this.changeStateHelper(newState);
    }

    /**
     * Changes the current state to the previous state.
     */
    public changeToPreviousState() {
        if(this.previousState) this.changeStateHelper(this.previousState);
    }

    private changeStateHelper(newState: StateNode<Data>) {
        //calls exit on old state. During first call currentState is null.
        if(this.currentState)
            this.currentState.onExit();
        //calls switch states.
        let tempState = this.currentState;
        this.currentState = newState;
        this.previousState = tempState;
        //calls enter on new state.
        this.currentState.onEnter();
    }


    /** @returns The current state */
    public getState() {
        return this.currentState;
    }

    /**
     * Updates the StateMachine. This will call update on the current state.
     * @param deltaT Time change in seconds.
     */
    public update(deltaT: number) {
        if (!this.created) {
            this.created = true;
            this.create(this.tempEntity, this.tempData);
        }
        if (this.currentState) this.currentState.update(deltaT);
    }
}