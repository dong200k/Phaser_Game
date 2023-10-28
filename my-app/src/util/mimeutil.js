
// ----- Enter more mine to extension objects below ----- 
const mimeAndExtension = [
    {mime: "image/png", extension: ".png"},
    {mime: "audio/mpeg", extension: ".mp3"},
    {mime: "application/json", extension: ".json"}
]

const mimeToExtHash = new Map();
const extToMimeHash = new Map();

mimeAndExtension.forEach((value) => {
    mimeToExtHash.set(value.mime, value.extension);
    extToMimeHash.set(value.extension, value.mime);
})


/**
 * Gets the extension of the given mime value.
 * E.g. "application/json" returns ".json"
 * @param mime The mime string.
 * @returns The extension string. Or undefined if not found.
 */
export function mimeToExtension(mime) {
    return mimeToExtHash.get(mime);
}

/**
 * Gets the mime of the given extension value.
 * E.g. ".json" returns "application/json"
 * @param extension The extension string.
 * @returns The mime string. Or undefined if not found.
 */
export function extensionToMime(extension) {
    return extToMimeHash.get(extension);
}
