import EventEmitter from "events";

export type DungeonEventTypes = "SPAWN_MONSTER";

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

export default class DungeonEvent {
    private static singleton = new DungeonEmitter();

    private constructor(){};

    public static getInstance() {
        return DungeonEvent.singleton;
    }
}