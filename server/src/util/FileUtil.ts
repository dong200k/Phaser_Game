import path, { resolve } from "path";
import * as fs from "fs";

export default class FileUtil {

    /**
     * Reads a json file and returns a promise with the json object.
     * @param location A path relative to the root folder of the project. (E.g. assets/tilemap/demo_map/demo_map.json)
     */
    public static readJSONAsync(location: string): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            fs.readFile(path.resolve(__dirname, "../../", location), (err, data) => {
                if(err) reject(err);
                else {
                    try {
                        let jsonObj = JSON.parse(data.toString());
                        resolve(jsonObj);
                    } catch(e) {
                        reject(e);
                    }
                }
            });
        })
        return promise;
    }
}
