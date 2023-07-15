# Attacking

This document will outline how attacking is implemented. This includes when the player fire's a bullet or when a monster uses a melee attacks.

## Player Attacking

1. First a mouse click is triggered on the client side and sent to the server with all the other inputs.
2. Once the server receives the attack input, all trigger effects with the 'player attack' type are fired.


### Player Attacking Sequence

-> In PlayerManager. The EffectManager's useTriggerEffectsOn is called when the player presses attack.
``` 
EffectManager.useTriggerEffectsOn(playerState, "player attack", playerBody, {mouseX, mouseY});
```
-> In EffectManager. Each trigger effect with type "player attack" have its onTrigger() method called.
```
public static useTriggerEffectsOn(entity: Entity, type: string, ...args: any) {
        entity.effects.map(effect=>{
            if(effect instanceof TriggerEffect && effect.type === type){
                effect.onTrigger(entity, ...args)
            }
        })
    }
```
-> In TriggerUpgradeEffect. Uses the effect referenced by effectLogicId if the player attack cooldown is finished. If the cooldown is not finished then the attack fails.
```
/** Uses the effect referenced by effectLogicId if cooldown is finished */
    public onTrigger(entity: Entity, ...args: any): boolean {
        // console.log(`using trigger effect for ${this.effectLogicId}`)

        // cooldown not finished return
        if(!this.cooldown.isFinished) return false

        // restart cooldown and use corresponding effect logic
        this.cooldown.reset()
        let used = this.tree?.getGameManager()?.getEffectLogicManager().useEffect(this.effectLogicId, entity, this.tree, ...args)
        return used? true : false
    }
```
-> In EffectLogicManager. The EffectLogic associated with the effectLogicId is used.
```
/**
     * Uses effect corresponding to effectLogicId.
     * @param effectLogicId id of effectLogic to use
     * @param entity origin entity using the effectLogic
     * @param args any other arguments that may be needed such as mouse data
     * @returns true if the effect is used else false
     */
    public useEffect(effectLogicId: string, entity: Entity, ...args: any): boolean{
        let effectLogic = this.effectLogics.get(effectLogicId)
        
        // Effect does not exist return
        if(!effectLogic) return false

        // Effect does exist so try to use it
        try{
            effectLogic.useEffect(entity, this.gameManager, ...args)
            return true
        }catch(e: any){
            console.log(e.message)
            return false
        }
    }
```
-> TribotLogic
```
useEffect(...) {
    ...
}
```

### How to set which EffectLogic the player uses.

TreeManager
addTreeUpgradeEffectsToPlayer(...)

1. 
WeaponManager
equipWeaponUpgrade(...)

PlayerManager
initPlayerData()

Note: Document not completed...