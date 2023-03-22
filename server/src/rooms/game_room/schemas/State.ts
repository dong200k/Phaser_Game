import { Schema, type, MapSchema } from '@colyseus/schema';
import Player from './gameobjs/Player';
import GameObject from './gameobjs/GameObject';

export default class State extends Schema {
    @type({ map: GameObject })
    gameObjects = new MapSchema<GameObject>();  

    ownerSessionId = "";
}