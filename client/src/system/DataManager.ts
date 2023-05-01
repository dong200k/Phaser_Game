
/**
 * The DataManager provides a nice and easy way to store data and listen for data changes.
 * It is useful when you want an UI element to update whenever a data changes. 
 * It is also useful for sharing data between different scenes (E.g. When the NavbarScene wants to know which Scene is currently displayed so it can update it's buttons).
 */
export default class DataManager {
    private static singleton: DataManager = new DataManager();

    /** The dataMap stores a map of DataObjects. */
    private dataMap: Map<string, DataObject> = new Map<string, DataObject>();

    /** The updateableSet contains a set of keys with DataObject's data that have changed. */
    private updateableSet: Set<string> = new Set();

    private constructor() {

    }

    /** Gets the DataManager singleton object */
    public static getDataManager() {
        return this.singleton;
    }

    /**
     * Sets the data for a given key.
     * @param key The key for the data.
     * @param data The data, could be any type.
     */
    public setData(key: string, data: any) {
        let dataObject = this.dataMap.get(key);
        if(!dataObject) {
            dataObject = new DataObject({});
            this.dataMap.set(key, dataObject);
        }
        dataObject.data = data;
        dataObject.changed = true;
        this.updateableSet.add(key);
    }

    /**
     * Gets the data for the provided key. 
     * @param key The key of the data.
     * @returns The data for the given key. If the data does not exist returns undefined.
     */
    public getData(key: string): any {
        let dataObject = this.dataMap.get(key);
        if(dataObject)
            return dataObject.data;
        else 
            return undefined;
    }

    /**
     * Adds a listener to a data object, even if it doesn't exist yet.
     * @param key The key of the data object.
     * @param callback The function that will run when the data object changes or one when the listener is added.
     */
    public addListener(key: string, callback: DataFunction) {
        let dataObject = this.dataMap.get(key);
        if(!dataObject) {
            dataObject = new DataObject({});
            this.dataMap.set(key, dataObject);
        }
        dataObject.listeners.push({
            callOnce: true,
            callback: callback
        });
        this.updateableSet.add(key);
    }

    /** Updates this DataManager. All listeners on data objects that have changed will be called. */
    public update() {
        this.updateableSet.forEach((key) => {
            let dataObject = this.dataMap.get(key);
            if(dataObject) {
                let changed = dataObject.changed;
                let data = dataObject.data;
                dataObject.listeners.forEach((listener) => {
                    // Callback is called if there is a change to the data or if the this is the first time the listener has been created.
                    if(changed || listener.callOnce) {
                        listener.callOnce = false;
                        listener.callback(data);
                    } 
                })
                dataObject.changed = false;
            }
        })
    }
}


/** A callback function that is called when the data the function is listening to changes and once when the function is added. */
type DataFunction = (data: any) => void;

/** A listener consists of a function and a boolean which flags the function for callback. */
interface Listener {
    callOnce: boolean,
    callback: DataFunction,
}

/** The data object contains the data, listeners for the data, and a changed flag for when the data is updated. */
class DataObject {
    listeners:Listener[] = [];
    changed:boolean = false;
    data:any;

    constructor(data:any) {
        this.data = data;
    }
}