import { Schema, type } from '@colyseus/schema';

export default class StatusIcon extends Schema {
    /** A static counter that is used to create the iconId. */
    private static iconIdCounter: number = 0;

    /** The client side texture key. */
    @type('string') key: string = "";
    /** The type of action to perform. E.g. add or rm. */
    @type('string') type: string = "";
    /** A timer for when the status icon is removed. -1 for no timer. */
    @type('number') timeout: number = 1;
    /** A semi-unique identifier for the icon. */
    @type('number') iconId: number = 1;

    /** Displays a status icon on top of the entity on the client side
     * @param key The key of the icon to display.
     * @param timeout A timer before the icon disappears in seconds.
     * @returns The iconId that can be used to remove the icon later by calling
     * removeStatusIcon(iconId). Note: Icon will be automatically removed 
     * when the timer ends.
     */
    public showStatusIcon(key: string, timeout: number) {
        this.iconId = this.getNextId();
        this.type = "add";
        this.key = key;
        this.timeout = timeout;
        return this.iconId;
    }

    /**
     * Displays a status icon on top of the entity. For the icon
     * to be removed call removeStatusIcon() with the returned id.
     * @param key The key of the icon to display.
     * @returns The iconId that can be used to remove the icon later by calling
     * removeStatusIcon(iconId).
     */
    public showStatusIconUntimed(key: string) {
        this.iconId = this.getNextId();
        this.key = key;
        this.type = "add";
        this.timeout = -1;
        return this.iconId;
    }

    /**
     * Removes a status icon by it's id.
     * This can be used to remove both timed and untimed icons.
     * @param iconId The iconId.
     */
    public removeStatusIcon(iconId: number) {
        this.type = "rm";
        this.iconId = iconId;
    }

    
    /**
     * Returns a incrementing id that counts from 0 to 100000.
     * The first id is 1.
     * @returns The next id.
     */
    private getNextId() {
        StatusIcon.iconIdCounter++;
        if(StatusIcon.iconIdCounter > 100000) {
            StatusIcon.iconIdCounter = 0;
        }
        return StatusIcon.iconIdCounter;
    }
}