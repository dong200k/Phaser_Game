import Phaser from "phaser";

/** EventsManager is used to emit and listen to global events. */
const eventsManager = new Phaser.Events.EventEmitter();

export default eventsManager;