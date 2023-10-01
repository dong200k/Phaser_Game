# Upgrades

This document will discuss how to use the my-app tool UI to create Weapon and Artifact upgrades and howto load them on the server.

## What are upgrades?
Upgrades are a Weapon or Artifact that are shaped like a tree. Each node in the tree can be selected by the player in the game which will provide them with bonuses. These bonuses include stat bonuses and an EffectLogic. 

## Creating an Upgrade
Now we will discuss howto create an upgrade. 

1. First open up the my-app tool and select Upgrades in the navigation bar. You should see all the weapon upgrades followed by all the artifact upgrades.

2. To create a weapon upgrade click the "Create New Weapon Upgrade". To create a artifact upgrade scroll down and click the "Create New Artifact Upgrade" button.

3. After clicking the button scroll around and you should see a new upgrade created called "auto-generated". This will probably appear at the end of the weapon/artifact upgrade list.

## Editing an Upgrade's node 
Now that we have created our upgrade we can start editing it.

1. 
    Click edit

        First click on the edit button next to our "auto-generated" upgrade to start editing our new upgrade.

2. 
    New interface

        On clicking edit you should see a new interface a few things. In particular you should see the weapon/artifact name at the top, the unique id of the upgrade, and also a box which represents the root node of this upgrade. Also note that there is a big green "SAVE TO DATABASE!!!" button which will save our upgrade to the database.

3. Edit root node

        Next we want to edit our root node so lets hit the edit below the box/node which should be at the center of your screen. If not click and drag around or zoom out in the white space to find it.

4. After clicking on edit you should see a new interface. With a few things:

    ### Default Node Dropdown

    First you will see a dropdown button titled Select default node to load. This dropdown button can load some prefilled information into our node but we will skip over it.
    ### Name and description
    
    Next you will see the node name and a description textbox, edit these as you see fit.
    ### Status dropdown
    
    The next item is a dropdown button called Status. Here you can select one of three choices, selected, none, or skipped. 

    #### Selected: 
    
    This means that this node will be selected by default for the player providing them with bonuses when the equip this upgrade in game. 
    
    Clicking this option will also show a selection time. Mark this with a number that indicates the order this upgrade tree's node should be selected. The lower the number the higher the priority. You can also just use the default 0 if you are not sure.
    #### None: 
        
    This is the default option and means that the upgrade won't be selected. The player would need to upgrade this in game to have this node's bonuses.
    #### Skipped: 
        
    This is the final option and means that the upgrade will be skipped over. This option will prevent the player from selecting their upgrade. We will skip this option as it is not really neccessary.

    #### BaseWeapon dropdown
    
    Afterwards you should see the BaseWeapon dropdown of the upgrade. This was added so that we know the sprites to use for this weapon and its projectile in game. However at the moment it is not really used so you can simply skip over it.
    
    #### Upgrade Effect
    
    Next is the Ugprade Effect section. This is where we can connect an EffectLogic to our Upgrade. If you haven't already read the EffectLogic and AbilityCreation devdoc to get a better idea of what this is.

    In this section you should see the effectLogicId, cooldown(ms), collisionGroup, doesStack, and a type dropdown.

    The idea is that when this upgrade is selected we can tie some game logic to our weapon upgrade in this case we are tying the effectLogicId to the server's EffecftLogic.

    * effectLogicId:
        ```
        In this field enter an effectLogicId that references and EffectLogic from the server.
        ```
    * cooldown(ms):
        ```
        In this field enter a cooldown in milliseconds whichw will be used depending on what type we select later in this section.
        ```
    * collisionGroup: 
        ```
        By default this option is -1 which means no collisions. 
        
        However by changing this to a positive number such as 1 we are saying that this node's Upgrade Effect will collide with other Upgrade Effects on our tree with the same collisionGroup of 1 if anyof them does not stack. For colliding upgrades the later one will be used whereas the old one will be removed in game when the player's select their upgrades. 

        If you are not sure or don't want any collisions you can leave it as the default value. 
        ```
    * doesStack
        ```
        This checkbox indiciates whether or not we should look at the collisionGroup and and remove collisions. If 2 ugprades in the same group has the same collisionGroup of say 1, but they both have doesStack checked then neither will be overwritten.
        However if either one has doesStack not check then the old one will be removed in game when players select their upgrades.
        ```
    * Type
    
        This dropdown has 5 options which helps the server determine what kind of Upgrade Effect we are creating.

        #### None
        ```
        This is the default option. It means that when this node is selected then the EffectLogic referenced by the effectLogicId field will be called continuously by the server whenever the cooldown specified by the cooldown(ms) field is up.
        ```
        #### player attack
        ```
        This option indicates that the EffectLogic referenced by the effectLogicId field will be called when a player attacks/presses the left mouse button and the cooldown is up. 
        
        Note: If this option is selected then the cooldown will be determined by the player's attack speed. 
        ```
        #### player charge attack
        ```
        This option indicates that the EffectLogic referenced by the effectLogicId field will be called when a player's controller enters the Charge Attack state. Look at the player controller dev doc for more details.
        
        Note: If this option is selected then the cooldown will be determined by the player's charge attack speed. Although the default value can be seen on the server's player controller charge state.
        ```
        #### player skill
        ```
        This option indicates that the EffectLogic referenced by the effectLogicId field will be called when a player uses their special ability and the cooldown is up.
        ```

        #### one time
        ```
        This option means that when this upgrade is selected by the player/server for the first time it will call the EffectLogic referenced by the effectLogicId field.
        ```
    #### Stat
    In this section you can edit the stat information of this upgrade node. These stats will be applied to the player when this node is selected.

    Click the show zero checkbox to see the stats and fill them as you want. It can be empty if the node does not provide a stat boost.

    #### Other
    Ignore what is in this section as they are not used. Although for newly created nodes this should be empty.

    #### Saving
    First click on the save button at the end. This does not save the node to the json-server, but to the react front-end. Now to save our new node click on the "SAVE TO DATABASE!!!" button at the top. On a successful save a prompt saying "saved upgrade successfully!" should appear.

## Adding a new node
To add a new node as a child of an existing node click on the add children button below the node.

Follow the previous section on editing an upgrade node to edit your upgrade.

Note that for artifact upgrades the width/breadth is only 1 node. However for weapon upgrades the width is as much as you want.

Be sure to save your new node properly.

## Moving to the server/apis
To move our new upgrades to the server and api server, open up a terminal. Inside the terminal cd into the my-app folder and run the script "npm run move-db" without the quotes and that will do.

## Creating the EffectLogics used by upgrades
From the previous steps we can add a effectLogicId in the Upgrade Effect section to our upgrade tree's nodes. However if they don't exist yet you must create a corresponding EffectLogic on the server side. 

To do this reference the ability creation doc and the effect logic doc which does something similar.

## Creating an upgrade
Now that we have our weapon and artifact created and the effectLogics written we can use them on the server with the id field. 


1. First copy the id field of your upgrade. This should be at the top of the page right below name of the upgrade when you edit the upgrade.

2. Next head to /server/rooms/game_room/system/UpgradeTrees/factories 

3. Inside this directory you should see the three factories

    #### ArtifactFactory.ts
    #### SkillTreeFactory.ts
    #### WeaponUpgradeFactory.ts

4. If your upgrade is an artifact head to the ArtifactFactory.ts and if it is a weapon head to the WeaponUpgrade Factory.ts.

5.  Inside both of the factories you should see a createUpgrade method which is used to create an instance of our upgrade with an id. This can be equiped by a player.
    #### createUpgrade
    This method is used to create a upgrade that can be equip by a player. It takes in the upgrade id that we copied in step 1 and also a boolean representing whether to select the root node. By default the root node is selected.

## Equiping an upgrade
After you have created an upgrade as described by the previous step you can then equip the ugprade with a reference to the player and the artifact/weapon upgrade manager.

An example is inside the PlayerManager where the player equips some default artifacts with the equipArtifact method.
```
let upgradedDemoArtifact = ArtifactFactory.createDemo()
lhis.gameManager.getArtifactManager().equipArtifact(player, upgradedHermesBoots)
```
Note a method called createDemo is used to create this artifact however it uses the same createUpgrade method as mentioned above.

```
static createDemo(){
    let artifact = WeaponUpgradeFactory.createUpgrade('upgrade-f831783f-9c3b-40fb-aa62-4e29dfe84664', false) as Node<WeaponData>
    ArtifactManager.selectAllUpgrades(artifact)

    return artifact
}
```

Inside the PlayerManager the player also equips a weapon based on their role with the equipWeaponUpgrade method. Head to the role creation guide to see howto init/equip a weapon to a player based on their role.

```
let root = WeaponUpgradeFactory.createMaxUpgrade(weaponUpgradeId) as Node<WeaponData>
WeaponManager.equipWeaponUpgrade(player, root);
console.log(`equiping ${role.name} weapon:`, root.data.name)
```

## Final Summary
1. Create your upgrade on the my-app tool with the appropriate nodes.
2. Create the EffectLogics used by the upgrade's nodes .
3. Use the server's ArtifactFactory/WeaponUpgradeFactory's createUpgrade method to create an upgrade that a player can equip.
4. Use the WeaponUpgradeManager and the ArtifactManager's equip methods to equip the artifact/weapon onto a player.
