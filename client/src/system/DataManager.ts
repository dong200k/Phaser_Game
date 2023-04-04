
export default class DataManager {
    private static singleton: DataManager;

    private constructor() {

    }

    public static getDataManager() {
        if(this.singleton) {
            this.singleton = new DataManager();
        }
        return this.singleton;
    }
}

