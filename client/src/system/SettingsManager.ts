
interface SettingsObject {
    masterVolume: number;
    soundEffectsVolume: number;
    backgroundMusicVolume: number;
}

/**
 * The SettingsManager is a singleton for accessing the in game settings. 
 * To access this singleton call SettingsManager.getManager();
 */
export default class SettingsManager {
    
    private static singleton: SettingsManager = new SettingsManager();

    // -------- Audio -----------
    private masterVolume: number = 1;
    private soundEffectsVolume: number = 0.8;
    private backgroundMusicVolume: number = 0.8;

    private constructor() {
        // Load from local storage.
        let settingsString = window.localStorage.getItem("settings");
        if(settingsString) {
            let settings = JSON.parse(settingsString);
            this.masterVolume = settings.masterVolume ?? 1;
            this.soundEffectsVolume = settings.soundEffectsVolume ?? 0.8;
            this.backgroundMusicVolume = settings.backgroundMusicVolume ?? 0.8;
        }
    }

    /**
     * Gets this SettingsManager singleton.
     * @returns SettingsManager.
     */
    public static getManager() {
        return SettingsManager.singleton;
    }

    /**
     * Sets the volume for the sound effects.
     * @param volume Volume from 0 to 1.
     */
    public setSoundEffectsVolume(volume: number) {
        if(volume < 0) volume = 0;
        if(volume > 1) volume = 1;
        this.soundEffectsVolume = volume;
    }

    /**
     * Gets the sound effect volume.
     * @returns number from 0 to 1.
     */
    public getSoundEffectsVolume() {
        return this.soundEffectsVolume;
    }

    /**
     * Gets the sound effect volume multiplied by the master volume.
     * @returns number from 0 to 1.
     */
    public getSoundEffectsVolumeAdjusted() {
        return this.soundEffectsVolume * this.masterVolume;
    }

    /**
     * Sets the volume for the background music.
     * @param volume Volume from 0 to 1.
     */
    public setBackgroundMusicVolume(volume: number) {
        if(volume < 0) volume = 0;
        if(volume > 1) volume = 1;
        this.backgroundMusicVolume = volume;
    }

    /**
     * Gets the background music volume.
     * @returns number from 0 to 1.
     */
    public getBackgroundMusicVolume() {
        return this.backgroundMusicVolume;
    }

    /**
     * Gets the background music volume multiplied by the master volume.
     * @returns number from 0 to 1.
     */
    public getBackgroundMusicVolumeAdjusted() {
        return this.backgroundMusicVolume * this.masterVolume;
    }

    /**
     * Sets the master volume.
     * @param volume number from 0 to 1.
     */
    public setMasterVolume(volume: number) {
        if(volume < 0) volume = 0;
        if(volume > 1) volume = 1;
        this.masterVolume = volume;
    }

    /** Gets the master volume. This value affects the volume of other audios. */
    public getMasterVolume() {
        return this.masterVolume;
    }

    /** Returns all the settings as a single object.
     * @returns A SettingsObject.
    */
    public getSettingsAsObject() {
        let obj: SettingsObject = {
            masterVolume: this.masterVolume,
            soundEffectsVolume: this.soundEffectsVolume,
            backgroundMusicVolume: this.backgroundMusicVolume,
        }
        return obj;
    }
}