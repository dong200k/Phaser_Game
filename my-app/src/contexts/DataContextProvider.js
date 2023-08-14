import React, { createContext, Component, useState, useContext } from "react";
import { getAllMonsters } from "../services/MonsterService";
import { UserContext } from "./UserContextProvider";

/** The data context contains the data the is fetched from firebase. 
 * These include monster data, dungeon data, etc.
 * */
export const DataContext = createContext();

const DataContextProvider = (props) => {

    let [monsters, setMonsters] = useState(null);
    const { userToken } = useContext(UserContext);
    const refetchAllMonsters = () => {
        if(userToken) {
            getAllMonsters(userToken).then((m) => {
                setMonsters(m);
            })
            .catch(e => {
                setMonsters([]);
                console.log(e);
            }); 
        }
    }

    if(userToken && monsters === null) {
        refetchAllMonsters();
    }

    return (
        <DataContext.Provider value={{monsters, refetchAllMonsters}}>
            {props.children}
        </DataContext.Provider>
    );

}

export default DataContextProvider;