# Event Emitter

This document will outline how event emitters are being used/can be used on the server.

## Global Event Emitter

The global event emitter is a singleton that can be accessed anywhere inside the server. 
```
// Example event emitted by the GameRoom after a game finishes.
globalEventEmitter.emit(`GameFinished${this.roomId}`);
```

## Game Manager Event Emitter

The game manager event emitter is available through the GameManager. There will be a unique instance of this event emitter for every running game.

### Emitting an event
To emit an event you need access to the GameManager. Then you can get the event emitter through the getEventEmitter() method.
```
let eventEmitter = gameManager.getEventEmitter();
``` 
After getting the eventEmitter it is time to emit events. Using the GameNames enum we can access predefined events.
```
eventEmitter.emit(GameEvents.SPAWN_PROJECTILE, ...);
```
Now by hovering over SPAWN_PROJECTILE vscode will popup a windows showing what args are required.

### Listening to an event
To listen to an event we have to get access to the gameManager's event emitter like before.
```
let eventEmitter = gameManager.getEventEmitter();
```
Then we can add an listener.
```
eventEmitter.addListener(GameEvents.SPAWN_PROJECTILE, (projectileConfig: IProjectileConfig) => {
            this.spawnProjectile(projectileConfig);
        });
```
In the above example, we are adding a listener to listen for SPAWN_PROJECTILE events. To make event names easier to remember it is added to the GameEvents enum inside interfaces.ts. 