# Adding a Player Controller

This document will outline how to add a new player controller for another role such as the Berserker role. It is recommended to read the PlayerController.md before doing this.

## Part 1: Creating the directory
In this part we will create a controller folder for the controller we are adding.

1. First open up server/src/rooms/game_room/system/StateControllers through your editor's file explorer.

2. Inside this directory you should see a few controllers. We want to create a new folder here. You can title it as appropriate such as BerserkerController(taken).

3. Inisde our new folder we want to create an empty folder called states. This is where the controller's states should reside. 

4. Then we want to create a new .ts inside the the folder from step 2 (not the states folder). Name this with Controller at the end for example: {your-file-name}Controller.ts without the {}.

## Part 2: Creating the controller class
In this part we will create our controller class that extends the PlayerController.

1. First open up your file from Part 1, step 4. 

2. Next we want to create a new class that extends the player controller like so.

    ```
    import PlayerController from "../PlayerControllers/PlayerController";

    export default class DemoController extends PlayerController{
        
    }
    ```

3. Next we want to write a new method create. Be sure to import the type PlayerControllerData as that is needed for create. Also include calling super.create(data) which will give access to the states that the PlayerController has such as Idle, Move, etc.

    ```

    import PlayerController, { PlayerControllerData } from "../PlayerControllers/PlayerController";

    export default class DemoController extends PlayerController{
        protected create(data: PlayerControllerData): void {
            super.create(data)
            
            // Add states to controller here
        }
    }
    ```

## Part 3: Connecting the state controller to a role/character

In this part we will connect the state controller to a role/character. That way when that character is played it will use our controller instead of the default PlayerController.

1. First head to and open up the file server/src/rooms/game_room/system/StateControllers/RoleControllerClasses.ts

    This file is what tells our game which controller should be used/initialized for a role/character. If not specified here the default PlayerController will be used.

2. In this file you should see something like this. What you are looking at is the object that holds information on which controller belongs to which role. We just need to add our controller here.

    ```
    let ctors = {
        "Ranger": PlayerController,
        "Berserker": BerserkerComboController,
    }
    ```

3. Pick a role that has no controller (roles are in my-app tool) and assign it our DemoController class that we created earlier. Be sure to import that class.

    Doing this for the "Warrior" role looks like this.
    ```
    import DemoController from ...

    let ctors = {
        "Ranger": PlayerController,
        "Berserker": BerserkerComboController,
        "Warrior": DemoController,
    }
    ```

## Part 4: Adding new states
In this part we will talk about howto add states to our newly created controller.

1. First head to the states folder we created in Part 1.

2. Create a new file titled DemoState.ts, but any name will do.

3. After that open up our file and write the starting snippet. Be sure to import the StateNode properly. It may not be the same import as below.

    ```
    import StateNode from "../../../StateMachine/StateNode";

    export default class DemoState extends StateNode{
        public onEnter(): void {
            throw new Error("Method not implemented.");
        }
        public onExit(): void {
            throw new Error("Method not implemented.");
        }
        public update(deltaT: number): void {
            throw new Error("Method not implemented.");
        }

    }
    ```

4. This doc won't go over too much about a state node but when our controller changes to a new state 3 things happen.
    * The onEnter method is called which will initialize anything we need.
    * When our controller is currently in a state the update method will be called by the controller's update method. This is where we can write any logic tied to the game's update loop.
    * Finally when we change to a new state and leave our state, the onExit method is called. Here we can write code that would be expected when we leave the state.

5. Now after writing the appropriate the logic inside the 3 methods we can now add our state to our controller.

6. Open up the DemoController.ts file or whatever you named your controller created from earlier.

7. Next head to our create method and add our state. Here I am adding a state with the state name "DemoState" which will be how our controller recognizes this state. be sure to put a unique name. 
    ```
    export default class DemoController extends PlayerController{
        protected create(data: PlayerControllerData): void {
            super.create(data)
            
            // Add states to controller here
            let demoState = new DemoState("DemoState", this)
            this.addState(demoState)
        }
    }
    ```

8. Now are state is ready to be used. However do note that we haven't changed/entered into this state anywhere and that is up to you to implement. But if by default we want to enter the demo state we can just add a line.

    ```
    export default class DemoController extends PlayerController{
        protected create(data: PlayerControllerData): void {
            super.create(data)
            
            // Add states to controller here
            let demoState = new DemoState("DemoState", this)
            this.addState(demoState)

            // Enter demo state by default
            this.changeState("DemoState")
        }
    }
    ```

## Part 5: Overwriting a PlayerController State
In this part we will discuss howto overwrite a player controller state. This happens when we want to write a new state in our Controller that replaces a state in the PlayerController.

1. First figure out the name of the state that we want to overwrite. For example a few states the player controller has are "Move" and "Idle". In this case lets overwrite the "Idle state".

2. Follow part 4 to create a new state and name it "Idle" instead of "DemoState". 

    ```
    export default class DemoController extends PlayerController{
        protected create(data: PlayerControllerData): void {
            super.create(data)
            
            // Add states to controller here
            let idleState = new DemoState("Idle", this)
            this.addState(idleState)
        }
    }
    ```

3. Now if we were to start our game we would get an error because the PlayerController already has an idle state. To fix this we just need to add a line of code to remove the "Idle" state before adding our Idle state.
    ```
    export default class DemoController extends PlayerController{
        protected create(data: PlayerControllerData): void {
            super.create(data)

            // Add a line to remove duplicate state
            this.removeState("Idle")
            
            // Add states to controller here
            let idleState = new DemoState("Idle", this)
            this.addState(idleState)
        }
    }
    ```
4. Now we have just added a new Idle state that will be called by the PlayerController instead whenever it called the old Idle state.
