# Dungeon and Adventurers
This document will outline how to setup and run the project.

## About
Dungeon and Adventurers is a rogue-like multiplayer game that takes place in a fantasy world. Players will fight monsters in dungeons, upgrade skills, and receive fame.

## Client

View details [here](https://github.com/dong200k/Phaser_Game/tree/master/client).

### How to run
```bash
cd client
npm install
npm run build
```
Note: The following is equivalent to 'npm run build'
```bash
npm start
```
Open up index.html located inside the dist folder with a webserver.

## Server

View details [here](https://github.com/dong200k/Phaser_Game/tree/master/server).

### How to run
```bash
cd server
npm install
npm run server
```

### Running with nodemon
You can also run with nodemon so that you get realtime updates.
```bash
npm install -g nodemon
cd server
npm install
npm run server-dev
```

Note: The following is equivalent to 'npm run server-dev'
```bash
npm start
```


# Credits
Thanks to geocine for [starter project](https://github.com/geocine/phaser3-rollup-typescript)  
