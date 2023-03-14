import { Schema, type, MapSchema } from '@colyseus/schema';
import Player from './Player';

export default class State extends Schema {
    @type({ map:Player })
    players = new MapSchema<Player>();
    
    ownerSessionId = "";

    createPlayer(sessionId: string, isOwner: boolean) {
        if(isOwner)
            this.ownerSessionId = sessionId;
        this.players.set(sessionId, new Player("No Name", isOwner));
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    playerCount() {
        return this.players.size;
    }
}