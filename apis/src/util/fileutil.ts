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

    /**
     * Decodes a dataURL into its three parts. The mime, the encoding and the data.  data:[mine][;encoding],<data>
     * @example 'data:image/png;base64,iVBORw0KGgoAAAA...'
     * @param dataURL The dataURL string.
     */
    public static decodeDataURL(dataURL: string): { mime:string, encoding:string, data:string } {
        let dataURLSplit = dataURL.split(",");
        let meta = dataURLSplit[0];
        let data = dataURLSplit[1];
        let mime = "";
        let encoding = "";
        let addToMime = false;
        let addToEncoding = false;
        for(let i = 0; i < meta.length; i++) {
            let current = meta.at(i);
            if(current === ":") { addToMime = true; addToEncoding = false; }
            else if(current === ";") { addToMime = false; addToEncoding = true}
            else {
                if(addToMime) mime += current;
                if(addToEncoding) encoding += current;
            }
        }
        return {mime, encoding, data};
    }
}
