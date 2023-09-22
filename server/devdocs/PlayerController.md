    # Player Controller

This document will outline briefly how the PlayerController controls the players action. 

## Part 1: States
This part will talk about the different states that the PlayerController can be in and the logic around them.

### Idle State

The idle state is the state that a player is in when they are not moving and not doing any other action. When this state is entered animation for "idle" is played. By default the player spawns into the game with this state.

```
public onEnter(): void {
    this.player.animation.playAnimation("idle", {loop: true});
}
```

While the player is inside the Idle state the Idle state will keep updating to check for a change in the player's velocity from 0 indicating that they moved. When this happens we will change to the move state.

```
public update(deltaT: number): void {
    if(this.player.velocity.x !== 0 || this.player.velocity.y !== 0) {
        this.playerController.changeState("Move");
    }
}
```

### Move State
The move state is similar to the Idle state. When we enter the move state we will play the player's move animation

```
public onEnter(): void {
    this.player.animation.playAnimation("walk", {loop: true});
}
```

When the player stops moving/when they dont have any velocity then we will switch back to the idle state.

```
public update(deltaT: number): void {
    if(this.player.velocity.x === 0 && this.player.velocity.y === 0) {
        this.playerController.changeState("Idle");
    }
}
```

### Dead State
The dead state is the state that the player is in when their health points reach 0 or less. When this state is entered the death animation is played and the player cannot move.

```
public onEnter(): void {
    this.player.animation.playAnimation("death");
    this.player.canMove = false;
}
```

At the moment the logic for entering the death state is inside the PlayerController's update method. Basically when the PlayerController has detected that the player's health is less than or equal to zero, then it will change to the death state if they are not already in it.

```
public postUpdate(deltaT: number): void {
    let currentState = this.getState();
    // If the player has 0 hp, change to the death state.
    if(this.player.active && this.player.stat.hp <= 0 && 
        currentState !== null && currentState.getStateName() !== "Dead") {
        this.changeState("Dead");
    }
}
```

When the death state is left then the player will be able to move again. At the moment there is no revival in the game so there is no way to leave the dead state upon entering it.

```
public onExit(): void {
    this.player.canMove = true;
}
```

### Special State
The special state handles using the player's special abilities.
#### Entering the special state
The special state is one of the states that is entered based on the player's actions/inputs. 

When the player presses spacebar and the player's special ability is ready to use then we will enter the special state. More on how the special state receives the inputs in a later part.

#### Special state config

The special state has a setConfig method that will help us to initialize some values in the special state. setConfig is called with the appropriate data right before the special state is entered.

#### attackDuration: number
    How long the special state will last until we switch to the idle state.

#### canMove: boolean
    Whether the player can move in the special state or not.


#### triggerPercent: number
    When along the special state's duration that the special skill is used/triggered.

#### mouseX and mouseY
    mouseX and mouseY are numbers indicating where the player's mouse was when the special state was entered.

#### Special state update logic
In the update method of the special state we have the logic to trigger the special attack and leave the special state. The idea is that when the attackDuration is over then we will leave the special state and enter the idle state. When the triggerPercent has been reached then we will trigger all the special skills tied to the player.

```
public update(deltaT: number): void {
    this.timePassed += deltaT;

    // Trigger a skill if it hasn't been triggered and the timePassed is at the triggerPercent.
    if(!this.triggered && this.timePassed >= this.triggerPercent * this.attackDuration) 
    {
        this.triggered = true;
        // Trigger skills.
        EffectManager.useTriggerEffectsOn(this.player, "player skill", this.player.getBody(), {mouseX: this.mouseX, mouseY: this.mouseY})
    }

    // End attack once we pass the attackDuration.
    if(this.timePassed >= this.attackDuration) 
    {
        this.playerController.changeState("Idle");
    }
}
```

### Attack State
The attack states handle using the player's attacks.

#### Entering the attack state
Much like the special state the attack state is entered based on the player's inputs. At the moment of writing this doc the attack state is entered based on some conditions and the player's mouse inputs. More on this in a later part.

#### Attack state config
Just like the special state the attack state has the same configs and a setConfig method that is called before entering the attack state to initialize it with appropriate values.

#### Attack state update logic
Attack state's update logic is similar to the special state. When the attackDuration is over then we will leave the attack state and enter the idle state. When the triggerPercent has been reached the player's attacks are triggered and used.

```
public update(deltaT: number): void {
    this.timePassed += deltaT;

    // Trigger an attack if it hasn't been triggered and the timePassed is at the triggerPercent.
    if(!this.triggered && this.timePassed >= this.triggerPercent * this.attackDuration) 
    {
        this.triggered = true;
        // Trigger the attack.
        EffectManager.useTriggerEffectsOn(this.player, "player attack", this.player.getBody(), {mouseX: this.mouseX, mouseY: this.mouseY})
    }

    // End attack once we pass the attackDuration.
    if(this.timePassed >= this.attackDuration) 
    {
        this.playerController.changeState("Idle");
    }
}
```

### ChargeAttack State
The charge attack state handles the player's charge attacks, which are basically attacks that require charging/holding the mouse down and then letting go.

#### Entering the attack state
Much like the special and the attack state the charge attack state is entered based on the player's inputs. At the moment of writing this doc the charge attack state is entered based on some conditions and the player's mouse inputs. More on this in a later part.

#### Charge attack state config
The charge attack state almost the same configs as the special/attack state and a setConfig method that is called before entering the attack state to initialize it with appropriate values.

#### chargeRatio: number
    The ratio/percentage of the time the player has been charging/holding mouse down compared to the maximum charge duration.

#### Charge attack state update logic
The charge attack state's update logic is similar to the special/attack state. When the attackDuration is over then we will leave the charge attack state and enter the idle state. When the triggerPercent has been reached the player's charge attacks are triggered and used.

```
public update(deltaT: number): void {
    this.timePassed += deltaT;

    // Trigger a charge attack if it hasn't been triggered and the timePassed is at the triggerPercent.
    if(!this.triggered && this.timePassed >= this.triggerPercent * this.attackDuration) 
    {
        this.triggered = true;
        EffectManager.useTriggerEffectsOn(this.player, "player charge attack", this.player.getBody(), {mouseX: this.mouseX, mouseY: this.mouseY}, this.chargeRatio)
    }

    // End attack once we pass the attackDuration.
    if(this.timePassed >= this.attackDuration) 
    {
        this.playerController.changeState("Idle");
    }
}
```
### Charge State
Last but not least, we have the charge state. This state is entered when the player's mouse button is down and they are in the "Idle" or "Move" state. While in this state the chargeRatio(charge time so far over maximum charge time) will be kept tracked of and increased. 


#### Charge state config
The charge state almost the same configs as the special/attack state and a setConfig method that is called before entering the attack state to initialize it with appropriate values.

#### mouseClick: number
    whether or not the left mouse button has been clicked by the player. 
    0 - not clicked 
    1 - clicked

#### Charge state update logic
When the charge state updates we will increment chargeTimeSoFar based on the time that has passed and we will also call the handleChargeAnimation method. This method will play the appropriate animation based on the player's chargeRatio.


#### Charge state exit logic
When the charge state is exited the the charge time so far will be reset. The charge state is exited based on the players input which will be talked about in a later section.

```
public update(deltaT: number): void {
    this.timePassed += deltaT;
    this.chargeTimeSoFar += deltaT * 1000
    this.handleChargeAnimation(deltaT)
}
```

```
public onExit(): void {
    this.chargeTimeSoFar = 0
}
```

## Part 2: Processing Input
This part will talk about how the PlayerController processes inputs(besides movement inputs) and more on how these inputs connect to the states mentioned earlier.

### Inputs:

The inputs include the left mouse button and the spacebar.

* mouseX: number
    ```
    number that indiciates where the x position of the player's cursor is.
    ```
* mouseY: number
    ```
    number that indiciates where the y position of the player's cursor is.
    ```
* mouseClick: number
    ```
    0 - left mouse not clicked
    1 - left mouse clicked
    ```
* mouseDown: number
    ```
    0 - left mouse button not being pressed.
    1 - left mouse button is being pressed.
    ```
* spacebar: number
    ```
    0 - spacebar not pressed
    1 - spacebar pressed.
    ```

### Processing the mouse inputs
There is a method called processMouseInputs inside the PlayerController that controls how the mouse inputs affect the states of the player. Everytime the player makes an input it is sent to this method to be processed.

The job of this method is to determine when we should enter the attack state, charge state, and charge attack state.

#### How it works:
The idea is that when the player is not doing any action and they hold their left mouse button we want them to enter the charge state and start charging for a charge attack, if they have any. 

If the left mouse button is clicked however, then we want the player to either perform their attack or their charge attack. 

Charge attacks take priority so if the player has a charge attack and meets its threshold/requirements then the charge attack will be started. If not then their attack will be started if attacks are off cooldown. It is important to note that charge attacks dont have cooldowns, instead they have a charge time.

#### Walk through of the code

1. If we are not in the charge state, move state, or the idle state then mouse inputs should not affect the player's state.
    ```
    if(this.stateName !== "Idle" && this.stateName !== "Move" && this.stateName !== "ChargeState") return
    ```

2. If the player has charge attacks in their kit/effects, and mouseClicked === 1, and their charge attack condition is met we will change into the charge attack state to fire off their charge attacks.
    ```
    if(mouseClick && hasChargeAttack && this.chargeState.chargeThresholdMetFor1Attack()){
        this.chargeState.startChargeAttack(mouseX, mouseY)
        return
    }
    ```
    #### startChargeAttack Method
    This method will change the PlayerController's state to the charge attack state. It will also set the config with charge attack state's setConfig method which was mentioned in part 1.
    ```
    public startChargeAttack(mouseX: number, mouseY: number){
        this.playerController.chargeAttackState.setConfig({mouseX, mouseY, chargeRatio: this.chargeTimeSoFar/this.totalChargeTime})
        this.playerController.changeState("ChargeAttack")
    }
    ```


    #### chargeThresholdMetFor1Attack Method
    The method chargeThresholdMetFor1Attack() is called and checked to determine whether there is a charge attack. Overwrite this method if you want to use a custom logic for your own controller.

    How this method works is that it checks the player's effect for any ChargeAttackLogic. If they have any then we will pass it the chargeRatio which we can get from the ChargeState. This will let us know if the chargeRatio meets the requirements for any of the charge attacks that the player has.

    ```
    public chargeThresholdMetFor1Attack(){
        let thresholdMet = false
        this.player?.effects.forEach(e=>{
            if(e instanceof TriggerUpgradeEffect && 
                e.effectLogic &&
                e.effectLogic instanceof ChargeAttackLogic &&
                e.effectLogic.chargeThresholdReached(this.chargeTimeSoFar / this.totalChargeTime)
            ){
                thresholdMet = true
                return true
            }
        })
        return thresholdMet
    }
    ```

3. If we didn't start a charge attack in the previous step then we will be on this step. 

    Here we will check to see if we need to enter the charge state, which has a requirement of pressing the left mouse down and the player having at least 1 charge attack in their kit. 
    
    If the conditions are met we will update the config for the charge state and enter it if we are not already in it.
    ```
    if(mouseDown && hasChargeAttack){
        // Set config for charge state
        this.chargeState.setConfig({mouseClick, mouseX, mouseY})

        if(this.stateName !== "ChargeState") this.changeState("ChargeState")
        return
    }
    ```
4. Lastly if we reach this point it means that we are not entering the charge state nor are we using a charge attack so at this point the question is whether we want to enter the attack state or not

    At this point if the player's left mouse button is clicked or pressed down then we will proceed to the attack state if attacks are off cooldown. In additon we will leave the charge state if the mouse is clicked.

    ```
    if(mouseDown || mouseClick){
        if(mouseClick && this.stateName === "ChargeState") {
            this.changeState("Idle")
        }

        // If an attack is off cooldown
        this.player.effects.forEach((effect) => {
            if(effect instanceof TriggerUpgradeEffect && effect.type === "player attack") {
                if (effect.cooldown.isFinished) {
                    this.startAttack(mouseX, mouseY);
                    return
                }
            }
        })

        // For combo attacks that dont use EffectLogic with combos directly on the controller.
        if(this.callStartAttackAnyways) this.startAttack(mouseX, mouseY)
    }
    ```

    Lastly note that for combo attack controllers the cooldown is on the controller itself such as with the BerserkerComboController. So start attack will never be called. The last line:
    ```
    if(this.callStartAttackAnyways) this.startAttack(mouseX, mouseY)

    ```
    Is a workaround that will always start attack when the condition is met and when the variable callStartAttackAnyways, which is false by default, on the PlayerController is set to true.

    This in addition to overwriting the startAttack method allows for a custom logic for combos and other sort of attacks.