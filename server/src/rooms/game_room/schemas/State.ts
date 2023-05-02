import { Schema, type, MapSchema } from '@colyseus/schema';
import Player from './gameobjs/Player';
import GameObject from './gameobjs/GameObject';
import Tilemap from './dungeon/tilemap/Tilemap';

export default class State extends Schema {
    @type({ map: GameObject })
    gameObjects = new MapSchema<GameObject>();  
    
    @type(Tilemap)
    tilemap:Tilemap|null = null;

    ownerSessionId = "";
}