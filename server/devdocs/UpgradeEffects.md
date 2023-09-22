# Upgrade Effects
This document will cover upgrade effects on the server that are created from the players weapon upgrade and artifact upgrade trees from the my-app tool. Upgrade effects all have an EffectLogic tied to them so it is suggested to read the EffectLogic.md first.

## Part 1: Types of Upgrade Effects
All upgrade effects reference an EffectLogic. The idea is that these upgrade effects are all a different way of using an EffectLogic. All upgrade effects belong to an entity that uses them.

### ContinuousUpgradeEffect
The ContinuousUpgradeEffect will continuously use the EffectLogic's upgrade effect whenever it is off cooldown.

#### Update method
ContinuousUpgradeEffects need to be updated by the game. The method will update its EffectLogic and also update its cooldown.
```
public update(deltaT: number){
    this.effectLogic?.update(deltaT)
    return super.update(deltaT)
}
```

#### ApplyEffect method
This method will be called by the EffectManager automatically whenever the ContinuousUpgradeEffect is off cooldown. This method will simply just call the EffectLogic's useEffect method to activate its effect.

```
public applyEffect(entity: Entity): boolean {
    try{
        // use effect that effectLogicId references
        this.effectLogic?.useEffect(entity, this.gameManager, this.tree)
        return true
    }catch(e: any){
        console.log(e?.message)
        return false
    }
}
```

#### onRemoveFromEntity method
When a ContinuousUpgradeEffect is removed from an entity the onRemoveFromEntity method gets called. This method just calls the removeEffect of the EffectLogic that the ContinuousUpgradeEffect references.

```
 protected onRemoveFromEntity(): void {
    let entity = this.getEntity()
    let gameManager = this.tree?.getGameManager()
    if(entity && this.effectLogic && gameManager) {
        this.effectLogic.removeEffect(entity, gameManager)
    }
}
```

### TriggerUpgradeEffect
The TriggerUpgradeEffect will use the EffectLogic when it is triggered by a condition. To use all the TriggerUpgradeEffects on an entity call the EffectManager's triggerUpgradeEffects() on method. 

#### type
The type attribute is used by the EffectManager's TriggerUpgradeEffectsOn method to trigger all the TriggerUpgradeEffects on an entity with the same type. 

For example if the type of a TriggerUpgradeEffect is "player skill" then when the EffectManager.triggerUpgradeEffectsOn(entity, "player skill") is called all the entity's TriggerUpgradeEffect with the type === "player skill" will have their onTrigger method called.

#### ApplyEffect
The TriggerUpgradeEffect does not implement this method because it has its own onTrigger method that gets called outside the Effect lifecycle.

#### onTrigger
When the TriggerUpgradeEffect has the type being triggered by the EffectManger's triggerUpgradeEffectOn method then the onTrigger will be called.

This method will just call the useEffect of the EffectLogic that the TriggerUpgradeEffect has.

```
public onTrigger(entity: Entity, ...args: any): boolean {
    // cooldown not finished return
    if(!this.cooldown.isFinished) return false

    // restart cooldown and use corresponding effect logic
    this.cooldown.reset()
    let gameManager = this.tree?.getGameManager()
    try{
        // use effect that effectLogicId references
        if(gameManager) this.effectLogic?.useEffect(entity, gameManager, this.tree, ...args)
        return true
    }catch(e: any){
        console.log(e?.message)
        return false
    }
}
```

#### onRemoveFromEntity method
TriggerUpgradeEffect also has this method which the ContinuousUpgradeEffect has which does the same thing.

```
 protected onRemoveFromEntity(): void {
    let entity = this.getEntity()
    let gameManager = this.tree?.getGameManager()
    if(entity && this.effectLogic && gameManager) {
        this.effectLogic.removeEffect(entity, gameManager)
    }
}
```

#### update method
The update effect is similar to the ContinuousUpgradeEffect's update in that the EffectLogic's update gets called. However for the TriggerUpgradeEffect with the type === "player attack", the update speed/deltaT is changed based on the player's attackSpeed.

```
public update(deltaT: number): number {
    deltaT *= 1000 // get milLiseconds
    let newDeltaT = deltaT
    // Grab deltaT in miliseconds depending on attackSpeed/chargeAttackSpeed
    if(this.type === "player attack"){
        let atkSpeed = 1
        if(this.tree?.owner) atkSpeed = getFinalAttackSpeed(this.tree?.owner.stat)
        newDeltaT = deltaT * atkSpeed
    }else if(this.type === "player charge attack"){
        let chargeAtkSpeed = 1
        if(this.tree?.owner) chargeAtkSpeed = getFinalChargeAttackSpeed(this.tree?.owner.stat)
        newDeltaT = deltaT * chargeAtkSpeed 
    }
    
    this.cooldown.tick(newDeltaT)
    this.effectLogic?.update(deltaT)
    return 0
}
```

### OneTimeUpgradeEffect
The OneTimeUpgradeEffect will use the EffectLogic immediately when the OneTimeUpgradeEffect is added to an entity and just once.

#### Update method
The OnetimeUpgradeEffect has no update method as it only gets used one time.

#### ApplyEffect method
just like the apply effect method of the ContinuousUpgradeEffect, this method will call the useEffect of the EffectLogic that this OneTimeUpgradeEffect references.

```
public applyEffect(entity: Entity){
    // console.log("applying onetime upgrade effect")
    let gameManager = this.tree?.getGameManager()
    try{
        // use effect that effectLogicId references
        // console.log("piercing effect's effect logic", this.effectLogic)
        if(gameManager) this.effectLogic?.useEffect(entity, gameManager, this.tree)
        return true
    }catch(e: any){
        console.log(e?.message)
        return false
    }
}
```

#### onRemoveFromEntity method
This method is not used as the effect will be removed automatically after it is applied.

## Part 2: How UpgradeEffects are being used
Right now upgrade effects are being used for weapon and artifact upgrades. On the my-app tool a upgrade node can be added to a weapon upgrade tree with basic info such as cooldown, effectLogicId, and type which are all attributes that upgrade effects use. I won't talk about that here but instead on how this information is translated into upgrade effects.

#### Creating UpgradeEffects through the EffectFactory's createEffectFromUpgradeEffect method
This method takes in a json object with basic information such as the cooldown, type, and effectLogicId and based on the type if will return one of the 3 upgrade effects above.

If the type is "player attack" then a TriggerUpgradeEffect will be made with that trigger type. The cooldown of this is 1000 ms, however it is affected by the player's attack speed.
```
case "player attack":
    return new TriggerUpgradeEffect(effectLogicId, 1000, type, doesStack, collisionGroup)
```

If the type is "player charge attack" then a TriggerUpgradeEffect will also be created but with a cooldown of 0 ms as charge attack cooldowns are managed by themselves.
```
case "player charge attack":
    return new TriggerUpgradeEffect(effectLogicId, 0, type, doesStack, collisionGroup)
```

If the type is "player skill" similarly a TriggerUpgradeEffect with that type is created. The cooldown depends on what the user set. Although the EffectLogic of the skill can manage this too if the cooldown is set to zero.
```
case "player skill":
    return new TriggerUpgradeEffect(effectLogicId, cooldown, type, doesStack, collisionGroup)
```

If the type is "one time" then a OneTimeUpgradeEffect is created. 
```
case "one time":
    return new OneTimeUpgradeEffect(effectLogicId, doesStack, collisionGroup)
```

Lastly if the type is "none" or there is no type provided then a ContinuousUpgradeEffect will be created.

```
case "none":
    return new ContinuousUpgradeEffect(effectLogicId, cooldown, type, doesStack, collisionGroup)
default:
    return new ContinuousUpgradeEffect(effectLogicId, cooldown, type, doesStack, collisionGroup)
```