# Chests

Chest are objects that player's can open in-game. These Chest will grant the player artifact(s).

## Types Of Chests

There are three types of chest.
- Wood chest
    - Grants a single artifact to the player.
- Iron chest
    - Grants two artifacts to the player.
- Gold chest
    - Grants three artifacts to the player.

## Changing artifacts
To change the artifacts that the chest will give open up the ChestManager.ts.
```
server\src\rooms\game_room\system\StateManagers\ChestManager.ts
```
Inside this file modify the list of REGISTERED_ARTIFACTS. Each of the items in REGISTERED_ARTIFACTS is a id of the artifact. These Ids can be found inside my-app under the upgrades tab.

Note: Currently when the player opens a chest a random artifact from REGISTERED_ARTIFACTS will be given to the player. If the player already maxed out that artifact, another one will be randomly chosen.