import { Schema, type, MapSchema } from '@colyseus/schema';
import Player from './gameobjs/Player';
import GameObject from './gameobjs/GameObject';

export default class State extends Schema {
    @type({ map:Player })
    players = new MapSchema<Player>();   
    
    @type({ map:Player })
    gameObjects = new MapSchema<GameObject>();  

    ownerSessionId = "";
}