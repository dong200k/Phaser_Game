import { Schema, type, MapSchema } from '@colyseus/schema';
import Player from './Player';

export default class State extends Schema {
    @type({ map:Player })
    players = new MapSchema<Player>();
    
    @type("number") maxPlayerCount = 4;
    
    @type("number") dungeon = 0;

    @type("boolean") privateRoom = false;

    leaderSessionId = "";

    playerJoinOrder: Array<string> = [];

    createPlayer(sessionId: string, isLeader: boolean) {
        if(isLeader)
            this.leaderSessionId = sessionId;
        this.players.set(sessionId, new Player("No Name", isLeader, 1));
        this.playerJoinOrder.push(sessionId);
    }

    removePlayer(sessionId: string) {
        if(this.players.delete(sessionId))
            this.playerJoinOrder.splice(this.playerJoinOrder.indexOf(sessionId), 1);
    }

    playerCount() {
        return this.players.size;
    }
}