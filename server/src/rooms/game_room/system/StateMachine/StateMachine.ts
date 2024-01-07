import { type, Schema } from "@colyseus/schema";
import StateNode from "./StateNode";
/**
 * The StateMachine will store all the state of a particular Mob. It will provide 
 * methods to change the state, as well as revert to a previous state. The 
 * creator of this class will need to call update() to update the StateMachine.
 */
export default abstract class StateMachine<Data> extends Schema{
    /** stores the states of this stateMachine. */
    private states: StateNode[];
    /** stores the current state of this stateMachine. */
    private currentState: StateNode | null;
    /** the currentState's name. */
    @type("string") stateName: string = "";
    /** stores the previous state of this stateMachine. */
    private previousState: StateNode | null;
    /** A flag that marks if the create() methods had been called yet or not. */
    private created: boolean;

    // Some temp data used when calling the create method.
    //private tempEntity: Entity;
    private tempData: Data;

    /**
     * Creates a new StateMachine and initialize the variables for the state machine. 
     * @param entity the sprite that will have this StateMachine.
     * @param data - some extra data you can pass in for your convinence. This will be passed to the create method.
     */
    constructor(data: Data) {
        super();
        this.states = [];
        this.currentState = null;
        this.previousState = null;
        this.created = false;
        this.tempData = data;
    }


    /**
     * Creates this StateMachine and initializes StateNodes.
     * @param entity The entity
     * @param data The data.
     */
    protected abstract create(data: Data): void;

    /**
     * Called by the state manager after it updates its current state. This method can 
     * be useful to change state inside the Controller. Ex. Change to the Death state when 
     * the entity's hp reaches zero.
     * @param deltaT - Time passed in seconds.
     */
    protected abstract postUpdate(deltaT: number): void;

    /**
     * Add a state to the state machine.
     * @param state - The state node.
     * @throws Error if the state's name is not unique.
     */
    public addState(state: StateNode) {
        let dupName = this.states.filter((s) => s.getStateName() === state.getStateName());
        if(dupName.length > 0) throw new Error(`Duplicate state name {${dupName[0].getStateName()}} when adding to the StateMachine!`);
        this.states.push(state);
    }

    /**
     * Removes a state from the state controller.
     * @param stateName
     */
    public removeState(stateName: string){
        this.states = this.states.filter(state=>state.getStateName() !== stateName)
    }

    /** Clear all the states inside this StateMachine. */
    public clearStates() {
        while (this.states.length > 0) this.states.pop();
    }

    /**
     * Changes the current state to another based on a state's name.
     * @param stateName The state's name.
     */
    changeState(stateName: string) {
        this.states.forEach((state) => {
            if(state.getStateName() === stateName) {
                // if(stateName === "Roll") console.log(`change state rolstate`)

                // if("attackState" in this)
                //     console.log(`state is now: ${stateName}`)
                this.stateName = stateName;
                this.changeStateHelper(state);
            }
        })        
    }

    /**
     * Changes the current state to the previous state.
     */
    public changeToPreviousState() {
        if(this.previousState) this.changeStateHelper(this.previousState);
    }

    private changeStateHelper(newState: StateNode) {
        // if(newState.getStateName() === "Roll") console.log(`change state helper rolstate`)
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
            this.create(this.tempData);
        }
        if (this.currentState) this.currentState.update(deltaT);
        this.postUpdate(deltaT);
    }

    public getPrevState(){
        return this.previousState
    }
}