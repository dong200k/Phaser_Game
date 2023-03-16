import { Schema, type, MapSchema } from '@colyseus/schema';
import Player from './gameobjs/Player';

export default class State extends Schema {
    @type({ map:Player })
    players = new MapSchema<Player>();    
    ownerSessionId = "";
}