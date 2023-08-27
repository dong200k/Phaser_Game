# Monster Creation

In this document we will show you how to add your own Monster. This document is intended for developers working on the game. 

What we will need: 
- Aseprite (pixel art editor)
- my-app (our tool for uploading content)
- gamemaster role (you need to have a gamemaster account)

## Prepare your assets

- Assets can be gather from online or created by yourself.
- Assets should have the monster and three animations.
    - Moving animation (walk)
    - Attack animation (attack)
    - Dying animation (death)

- Animations can be created using Aseprite. Check out the Animations devdoc in the client's folder for more information on how to do this.

## Uploading Monster onto Firebase

1. Open up my-app
2. Head to the monster's page
3. Login if needed.
4. Create a new monster. Make sure the name is unique. The aseprite key is used to associate the monster's image with the monster.

5. Upload assets. Make sure the asset key matches the aseprite key of the monster.
    - You can upload them locally or onto firebase.
    - Make sure the upload type is aseprite.



## Monster AI

- Create a new monster AI inside game_room/system/AI/MonsterAI.
- register new AI inside AIFactory.ts createAIFromKey() method.
- Set the monster AI key with my-app.


