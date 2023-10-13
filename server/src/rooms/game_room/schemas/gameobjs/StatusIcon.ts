import { Schema, type } from '@colyseus/schema';

export default class StatusIcon extends Schema {
    /** The count is used to ping the client of a new status icon. */
    @type('number') count: number = 0;

    /** The key of the status icon. */
    @type('string') key: string = "";
    @type('number') timeout: number = 1;

    /** Displays a status icon on top of the entity on the client side
     * @param key The key of the icon to display.
     * @param timeout The time it will take for the icon to disappear in seconds.
     */
    public showStatusIcon(key: string, timeout: number) {
        if(key === "") return this.count += 1
        this.count += 1;
        if(this.count === 100) this.count = 0;
        this.key = key;
        this.timeout = timeout;
    }
}