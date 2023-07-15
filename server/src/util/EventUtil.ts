import EventEmitter from "events";

/** The Global Event Emitter manages event throughout the whole server. (E.g. multiple game room and waiting room communication.) */
const globalEventEmitter = new EventEmitter();

export default globalEventEmitter;
