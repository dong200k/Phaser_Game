
// ----- Enter more mine to extension objects below ----- 
const mimeToExtension = [
    {mime: "image/png", extension: ".png"},
    {mime: "audio/mpeg", extension: ".mp3"},
    {mime: "application/json", extension: ".json"}
]

const mimeToExtHash: Map<string, string> = new Map();
const extToMimeHash: Map<string, string> = new Map();

mimeToExtension.forEach((value) => {
    mimeToExtHash.set(value.mime, value.extension);
    extToMimeHash.set(value.extension, value.mime);
})

export default class MIMEUtil {
    
    /**
     * Gets the extension of the given mime value.
     * E.g. "application/json" returns ".json"
     * @param mime The mime string.
     * @returns The extension string. Or undefined if not found.
     */
    public static mimeToExtension(mime: string) {
        return mimeToExtHash.get(mime);
    }

    /**
     * Gets the mime of the given extension value.
     * E.g. ".json" returns "application/json"
     * @param extension The extension string.
     * @returns The mime string. Or undefined if not found.
     */
    public static extensionToMime(extension: string) {
        return extToMimeHash.get(extension);
    }

}