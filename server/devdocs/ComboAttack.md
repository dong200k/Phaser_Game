# Combo Attacks

This doc will explore how the BerserkerComboController implements combo attacks and charge attacks.

## Precursory
If you haven't already read the PlayerController.md to understand how player inputs are connected to PlayerController states.

Also read the AddPlayerController.md to learn howto add a custom Controller for a character/role such as the Berserker.

## Combo Attacks
The idea of combo attacks is to perform a chain of attacks in order when the mouse button is pressed in succession in close timing.

If too much time passes between combos then the next attack will start from the first attack in the combo. Likewise, if the combo is finished then it will restart from the beginning.

The berserker has 3 attacks in their combo with around a 1/2 second leeway between attacks.

## Extending the PlayerController
First off the BerserkerComboController extends the PlayerController and overwrites some of its methods. We will talk about them here.

### Variables of the BerserkerComboController
```
private combos = ["Combo1", "Combo2", "Combo3"]
```
Gives information on the combo ordering and combo state names.

```
private comboStates: Combo1[] = []
```
Holds the states for the combos in order. They are used to set the config of the combo and initialized inside the create method below.

```
private unlockedCombos = 1
```
Inidicates which combos are unlocked and can be used

```
private currentCombo = 0
```
Indicates which combo to use next. Everytime a combo attack finishes such as combo1 then currentCombo will be incremented.

```
private maximumTimeBetweenCombo = 0.5
```
Maximum time between combos in seconds before reverting to the 1st combo attack.

```
private currentTimeBetweenCombo = 0
```
Time passed since the last combo attack was used. If this exceeds the maximumTimeBetweenCombo it will be reset to zero along with the combos.
### Create method
The PlayerController's create method provides a few states that we want such as move, idle, attack, and more. But we also want new states ontop of that so they are added here. 

Below shows the create method for the BerserkerComboController in which 3 new states are added, "Combo1", "Combo2", and "Combo3". Also a new charge state is added, so the old one on the PlayerController is removed with the removeState() method before the new one is added.

    protected create(data: PlayerControllerData): void {
        super.create(data)
        this.callStartAttackAnyways = true
        this.gameManager = this.getPlayer().gameManager

        let combo1 = new Combo1("Combo1", this)
        this.addState(combo1)
        this.comboStates.push(combo1)

        let combo2 = new Combo2("Combo2", this)
        this.addState(combo2)
        this.comboStates.push(combo2)

        let combo3 = new Combo3("Combo3", this)
        this.addState(combo3)
        this.comboStates.push(combo3)
        
        this.removeState("ChargeState")
        let chargeState = new BerserkerChargeState("ChargeState", this)
        this.chargeState = chargeState
        this.addState(chargeState)

        this.changeState("Idle")
    }

### Update method
This method handles when to restart combos. The idea is that when the currentTimeBetweenCombo exceeds the maximumTimeBetweenCombos then we want to restart the combo and reset the currentTimeBetweenCombo to 0.

```
update(deltaT: number){
    super.update(deltaT)
    // Current state is not a combo state
    if(!this.combos.find(combo=>combo === this.stateName)){
        this.currentTimeBetweenCombo += deltaT
        if(this.currentTimeBetweenCombo > this.maximumTimeBetweenCombo){
            this.restartCombo()
            this.resetTimeBetweenCombo()
        }
    }
}
```

Restarting the time between combo and the combo itself is shown below.

```
public restartCombo(){
    this.currentCombo = this.combos.length
}

public resetTimeBetweenCombo(){
    this.currentTimeBetweenCombo = 0
}
```

### startAttack method
Recall from the PlayerController.md that startAttack is called when there is no charge attack available and the player pressed the mousedown/mouse click. 

In this case I overwrote startAttack and also set the attribute callStartAttackAnyways to true (inside the create method) so that start attack will be called appropriately even if the player has no player attack effects.

As seen below this method just calls the startCombo method if the player is in the idle/move state and also triggers all effects on the player with the type "player attack".

```
public startAttack(mouseX: number, mouseY: number): void {
    if(this.stateName === "Idle" || this.stateName === "Move"){
        this.startCombo(mouseX, mouseY)
        EffectManager.useTriggerEffectsOn(this.getPlayer(), "player attack", this.getPlayer().getBody(), {mouseX, mouseY})
    }      
}
```

### startCombo method
This method handles the logic of which combo attack to use.

#### How it works
1. First if the player's state is special or dead then we should not proceed as those take priority.

2. Next if the currentCombo exceeds the our combo length or if it exceeds our unlocked combos then we just want to enter the combo1 state which holds our combo1 attack and logic. We also set the config appropriately.

3. If our combo does not exceed the unlock combo length or the combo length then we want to check if we are currently performing the combo indiciated by the currentCombo variable. If we are then we don't want to do anything.

4. If we reach this point then we want to perform the combo indicated by the currentCombo variable which we can do by just switching to the appropriate state and setting the config.

    ```
    public startCombo(mouseX: number, mouseY: number){
        if(this.stateName === "Dead" || this.stateName === "Special"){
            return
        }

        let duration = 1 / getFinalAttackSpeed(this.getPlayer().stat)
        let config = { mouseX, mouseY,
            attackDuration: duration,
            animationDuration: duration,
            canMove: false,
            flip: mouseX < this.getPlayer().getBody().position.x
        }

        // If combo is not unlocked or out of bounds. Start from combo 1
        if(this.currentCombo >= this.unlockedCombos || this.currentCombo >= this.combos.length) {
            this.comboStates[0].setConfig(config)
            this.changeState("Combo1")
            this.currentCombo = 0
            return
        }

        // Attack is still in progress 
        if(this.stateName === this.combos[this.currentCombo]){
            return
        }

        // Use the combo attack
        this.comboStates[this.currentCombo].setConfig(config)
        this.changeState(this.combos[this.currentCombo])
    }
    ```

### Unlocking combos 
Lastly since I wanted to lock some combos behind upgrades I had a unlock method that will help with that. This method is called by a one time upgrade effect.
```
public incrementUnlockedCombos(){
    this.unlockedCombos ++ 
}
```