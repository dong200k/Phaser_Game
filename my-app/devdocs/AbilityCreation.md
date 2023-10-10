# Abiltiy creation

This document will explain how to add an ability and a logic on the server for it.

Note: to give the ability to a character refer to the RoleCreation guide.

## Part 1: Adding ability

In this section we will create a new ability in the my-app tool.

1. Open the my-app tool and login to admin account.

2. Click on Abilities in the navigation bar at the top.

3. Click on the create new ability button on the top left. This will create a empty ability titled "ability-name" on the same page. Click on the edit button next to the created ability to start editing.

4. Give your ability a name and description. Ignore the display sprite as that is not used currently.

5. Next give the ability a cooldown in milliseconds through the input box.

7. Then Give the ability an effectLogicId. This is used by the server to reference the ability. Make sure that the effectLogicId is unique by giving a detailed name.

8. After that click on the save button and run npm move-db in the terminal inside the my-app folder directory so that the server will now have access to this new ability.

## Part 2: Addding ability's effect onto server
In this section we will create a effectLogic in the server directory that will serve as the ability's logic.

1. First navigate to the server directory.

2. Next locate the abilities folder and open it up. Path: server/src/rooms/game_room/system/EffectLogic/EffectLogics/abilities.

3. After that create a new .ts file and title it as appropriate. E.g. BerserkerAbility. If you like put the ability inside its own folder and name the folder as it fits. Usually this is done when multiple effectLogics are tied with an ability.

4. Next open up the .ts file you created in the previous step. At this point export a new class and extend effectLogic and implement its method as shown below. You can copy paste the below snippet.

```
export default class DemoAbility extends EffectLogic{
    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        console.log("hello world from DemoAbility")
    }
    
}

```

5. Now we need to link your effectLogicId from part 1 to this new effectLogic we created. To do this just overwrite the effectLogicId variable.

```
export default class DemoAbility extends EffectLogic{
    effectLogicId: string = "your-id"

    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        console.log("hello world from DemoAbility")
    }
    
}

```

6. An update method can also be added to this class if it needs to update in the game time. You can add variables to the class as needed for its logic to work.

```
public update(deltaT: number){}
```

7. Next we will add our newly created effectLogic to the game through the EffectLogicManager. First head to the file server/src/rooms/game_room/system/EffectLogic/EffectLogicManager.ts.

8. After opening this file head to the method

```
private initEffectLogics(){
    this.addEffectLogic(BowLogic)
    this.addEffectLogic(DoubowLogic)
    this.addEffectLogic(TribowLogic)
    ...
}
```

9. Inside this method there should many effectLogics already. We want to add our own here by calling this.addEffectLogic() and passing in our class name from step 4. Make sure to import our class so it doesn't throw an error. It should look something like this:

```
private initEffectLogics(){
    this.addEffectLogic(BowLogic)
    this.addEffectLogic(DoubowLogic)
    this.addEffectLogic(TribowLogic)
    ...

    // Our ability's effectLogic
    this.addEffectLogic(DemoAbility)
}
```

10. Remember to save all files that we have changed.

11. Now when we load up our game and unlock/use our role inside a dungeon. (Make sure to follow the instructions in RoleCreation.md to add the new ability to a role.) Pressing spacebar will activate our ability's effectLogic when its off cooldown(added in part 1). 

    If you added console.log("hello world from DemoAbility") inside the ability like me in step 4, then it should print out 
"hello world from DemoAbility" in the terminal where the server is running.

12. Now you can edit the ability's logic as you see fit and create an ability.


