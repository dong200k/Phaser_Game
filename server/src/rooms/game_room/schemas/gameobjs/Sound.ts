import { Schema, type } from '@colyseus/schema';

export default class Sound extends Schema {
    /** The sound count. Used to ping the client of a new sound. */
    @type('number') count: number = 0;

    /** The key of the sound. */
    @type('string') key: string = "";
    @type('string') type: string = "bg";
    @type('string') status: "Stopped" | "Playing" = "Stopped";
    @type('string') keyToStop: string = "";

    /** Play's a sound effect on the clinet side. */
    public playSoundEffect(key: string) {
        if(key === "") return this.count += 1
        this.count += 1;
        if(this.count === 100) this.count = 0;
        this.key = key;
        this.type = "sfx"
        this.status = "Playing"
    }

    public playBackgroundMusic(key: string){
        this.count += 1;
        if(this.count === 100) this.count = 0;
        this.key = key;
        this.type = "bg"
        this.status = "Playing"
    }

    /** Stops the current music on this Sound identified by the key param */
    public stopMusic(key: string){
        this.count += 1;
        if(this.count === 100) this.count = 0;
        this.status = "Stopped"
        this.keyToStop = key
    }
}