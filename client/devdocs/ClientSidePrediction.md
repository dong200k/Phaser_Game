# Client Side Prediction

This document will describe how client side prediction, server sync, and server
reconciliation were implemented.

## Client side prediction

To implement client side prediction a ClientSidePrediction class was created.
The main goal of this class was to update the player's position before getting
confirmation from the server of the player's position. In order predict the state
of the server matter-js was used.

### matter-js

Since the server was using matter-js, it was also used on the client to make
predictions. Originally, Phaser's built in matter-js library was used. However there was not a way to precisly control the main loop of the matter-js in Phaser.
So in the end, a seperate standalone matter-js library was used. Some of the 
objects needed to make the predictions include: 
- Player1 (The main player)
- Obstacles including walls

## Server Sync

Another major concern for Client Side Prediction is how to sync up the server state with the client state. To do this a fixed tick rate was created on both
the client and server. A fixed tick rate was essential so that the updates that matter-js would be identical or deterministic for both the client and server. 
Finally to sync the client and server a message system was set up to speed up or slow down the client to match up with the server. The implementations included: 
- Syncing the client and server so that the client tick count is ahead of the server's tick count.
- Slow down the client by stoping the client's update loop.
- Speed up the client by performing multiple updates in a single tick.

## Server Reconciliation

Finally, to account for large lag spikes and unpredicitable server states, server reconciliation is proformed at the end of every tick. To do this first an input histroy of the player is stored. Then when the server state is received, playback the client to see if the prediction matches the server state. 



