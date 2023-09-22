# Effect Logic
This document will highlight the EffectLogic class, the EffectLogicManager, and howto add an EffectLogic.

## Part 1: EffectLogic
EffectLogic is just a class that ties together some id which we call the effectLogicId and some game logic. This class was created so that certain game logic such as an ability or attack can be referenced easily with just the effectLogicId and the EffectLogicManager. Do note that EffectLogics are tied to entities hence the Entity argument inside the useEffect method.

Now we will talk about the important methods and attritbutes of the EffectLogic class.

### effectLogicId Attribute
This attribute is the unique string identifier for the EffectLogic. It is how we can reference the EffectLogic through the EffectLogicManager.

### useEffect method
This method must be implemented by all EffectLogics and holds the game logic that should happen when the effect is used.
```
public abstract useEffect(entity: Entity, gameManager: GameManager, ...args: any): void
```

### removeEffect method
This method need not be implemented, however if the EffectLogic has any side effects that needs to be removed, this method can be called.
```
public removeEffect(entity: Entity, gameManager: GameManager, ...args: any){}
``` 

## update method
This method will allow the EffectLogic to receive updates from the GameManager. It does not need to be implemented, however it will allow access to the game updates.

```
public update(deltaT: number){}
```

## Part 2: EffectLogicManager
The EffectLogicManager is in charge of managing and aggregating all the EffectLogics. When an EffectLogic is created it should be added to the EffectLogicManager so that it can be used in the game.

### Storage
The EffectManager stores these EffectLogics inside a map of string and EffectLogic constructors.
```
private effectLogics: Map<string, IEffectLogicClass> = new Map()
```

### Adding EffectLogics
EffectLogics are added inside the initEffectLogics() method. To add an EffectLogic first create the EffectLogic class with the methods and attributes from part 1 implemented. After that simply import the EffectLogic created and add it with the EffectManager.addEffectLogics() method.

For example to add the BowLogic class we simply import it and call the addEffectLogic method like shown below.
```
private initEffectLogics(){
    this.addEffectLogic(BowLogic)
}
```

### Getting the EffectLogic
To get an instance of the EffectLogic that we can use simply call the EffectLogicManager's getEffectLogicConstructor method. This method takes in an effectLogicId and returns the constructor to create the EffectLogic referenced by the effectLogicId. Then it can be used.

```
public getEffectLogicConstructor(effectLogicId: string): IEffectLogicClass | undefined{
    return this.effectLogics.get(effectLogicId)
}
```
