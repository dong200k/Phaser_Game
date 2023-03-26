import { Schema, type, MapSchema } from '@colyseus/schema';
import Player from './gameobjs/Player';
import GameObject from './gameobjs/GameObject';
import Tilemap from './tilemap/Tilemap';

export default class State extends Schema {
    @type({ map: GameObject })
    gameObjects = new MapSchema<GameObject>();  
    
    @type(Tilemap) tilemap = new Tilemap();

    ownerSessionId = "";
}