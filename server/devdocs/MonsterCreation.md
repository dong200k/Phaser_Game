# Monster Creation

In this document we will show you how to add your own Monster. This document is intended for developers working on the game. 

## Prepare your assets

- Assets can be gather from online or created by yourself.
- Assets should have the monster and three animations.
    - Moving animation (walk)
    - Attack animation (attack)
    - Dying animation (death)

- Animations can be created using Aseprite. Check out the Animations devdoc in the client's folder for more information on how to do this.

## Uploading Monster onto Firebase

- Open up my-app
- Head to the monster's page
- Login if needed.
- Create a new monster.

- Upload assets.
- You can upload them locally or onto firebase.



## Monster AI

- Create a new monster AI inside game_room/system/AI/MonsterAI.
- register new AI inside AIFactory.ts createAIFromKey() method.
- Set the monster AI key with my-app.


