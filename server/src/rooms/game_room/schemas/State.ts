import { Schema, type, MapSchema, ArraySchema, filterChildren } from '@colyseus/schema';
import GameObject from './gameobjs/GameObject';
import Tilemap from './dungeon/tilemap/Tilemap';
import Dungeon from './dungeon/Dungeon';
import ReconciliationInfo from './ReconciliationInfo';
import City from './dungeon/City';

export default class State extends Schema {
    @type({ map: GameObject })
    gameObjects = new MapSchema<GameObject>();  
    
    //Deprecated
    @type(Tilemap)
    tilemap:Tilemap|null = null;

    @type(Dungeon)
    dungeon:Dungeon|null = null;

    @type(City)
    city:City|null = null;

    ownerSessionId = "";

    @type("number") 
    serverTickCount = 0;

    /** Stats for the total monsters killed. */
    @type("number") 
    monstersKilled = 0;

    @filterChildren((client, key, value: ReconciliationInfo, root) => {
        return client.sessionId === value.clientId;
    })
    @type([ReconciliationInfo]) 
    reconciliationInfos = new ArraySchema<ReconciliationInfo>();
}