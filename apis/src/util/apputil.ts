

/**
 * Convert's a monster's name to its id. This is done by removing whitespaces from the name.
 * If the monster's id is passed in, the resulting id will be the same.
 * @param name The name.
 */
export const getIdFromName = (name: string) => {
    let id = "";
    for(let i = 0; i < name.length; i++){
        if(name[i] !== " ") id += name[i];
    }
    return id;
}
