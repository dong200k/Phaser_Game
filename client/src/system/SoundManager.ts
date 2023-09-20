import { PhaserAudio } from "../interfaces";
import SettingsManager from "./SettingsManager";

type SoundType = "sfx" | "bg";

interface ISound {
    audio: PhaserAudio;
    type: SoundType;
}

interface ISoundConfig {
    detune?: number,
    loop?: boolean
}

export default class SoundManager {

    private static singleton: SoundManager = new SoundManager();

    private scene!: Phaser.Scene;
    private map: Map<string, ISound>;

    private constructor() {
        this.map = new Map();
    }

    /**
     * Gets this sound manager.
     * @returns SoundManager.
     */
    public static getManager() {
        return this.singleton;
    }

    /**
     * Sets the scene for this SoundManager. This is called automatically during the SystemPreloadScene.
     * @param scene The scene.
     */
    public setScene(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /**
     * Adds a new sound with the specified key. If the sound with the key exist it will be ignored.
     * @param key Asset key for the sound. If the key already exist the sound will be replaced.
     * @param type The type of the sound. 
     */
    public add(key: string, type: SoundType) {
        this.addExisting(key, type, this.scene.sound.add(key));
    }

    /**
     * Adds an existing sound object that was created from scene.sound.add(). Use this
     * if you want to add configuation into the sound.
     * @param key Asset key for the sound. If the key already exist the sound will be replaced.
     * @param type The type of the sound. 
     * @param audio The Phaser Sound object.
     */
    public addExisting(key: string, type: SoundType, audio: PhaserAudio) {
        let soundObj: ISound = { type, audio }
        this.map.set(key, soundObj);
    }

    /**
     * Checks if key exists in this map.
     * @param key The map key.
     * @returns True or false.
     */
    public hasKey(key: string) {
        return this.map.has(key);
    }

    /**
     * Plays the sound specifed by the key.
     * @param key The sound key.
     */
    public play(key: string, config?: ISoundConfig) {
        let soundObj = this.map.get(key);
        if(soundObj) {
            if(soundObj.type === "bg") {
                soundObj.audio.play({
                    volume: SettingsManager.getManager().getBackgroundMusicVolumeAdjusted(),
                    detune: config?.detune,
                    loop: config?.loop
                })
            } else if(soundObj.type === "sfx") {
                soundObj.audio.play({
                    volume: SettingsManager.getManager().getSoundEffectsVolumeAdjusted(),
                    detune: config?.detune,
                    loop: config?.loop
                })
            }
        }
    }

    /**
     * Stops the sound specifed by the key.
     * @param key The sound key.
     */
    public stop(key: string){
        let soundObj = this.map.get(key);
        soundObj?.audio.stop()
    }

}