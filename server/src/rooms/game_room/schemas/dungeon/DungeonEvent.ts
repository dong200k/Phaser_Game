import EventEmitter from "events";

export type DungeonEventTypes = "SPAWN_MONSTER";

/** DEPRECATED DO NOT USE. The dungeon emitter is used to communicate dungeon events. It can be accessed by the singleton DungeonEvent.getInstance(). */
class DungeonEmitter extends EventEmitter {
    constructor() {
        super();
    }

    on(eventName: DungeonEventTypes, listener: (...args: any[]) => void): this {
        return super.on(eventName, listener);
    }

    emit(eventName: DungeonEventTypes, ...args: any[]): boolean {
        return super.emit(eventName, args);
    }
}

/** A singleton class that holds the DungeonEmitter. Used to send and receive events. */
export default class DungeonEvent {
    private static singleton = new DungeonEmitter();
    private constructor(){};

    public static getInstance() {
        return DungeonEvent.singleton;
    }
}