import React, { createContext, Component, useState, useContext, useEffect } from "react";
import { getAllMonsters } from "../services/MonsterService";
import { UserContext } from "./UserContextProvider";
import { getAllDungeons } from "../services/DungeonService";

/** The data context contains the data the is fetched from firebase. 
 * These include monster data, dungeon data, etc.
 * */
export const DataContext = createContext();

const DataContextProvider = (props) => {

    let [monsters, setMonsters] = useState([]);
    let [dungeons, setDungeons] = useState([]);
    const { user } = useContext(UserContext);

    // Update monsters with data from firebase.
    const refetchAllMonsters = () => {
        if(user) {
            getAllMonsters(user).then((m) => {
                setMonsters(m);
            }).catch(e => {
                setMonsters([]);
                console.log(e);
            }); 
        }
    }

    const refetchAllDungeons = () => {
        if(user) {
            getAllDungeons(user).then((d) => {
                setDungeons(d);
            }).catch(e => {
                setDungeons([]);
                console.log(e);
            })
        }
    }

    // When the user logs in fetch data. When user logs out remove data.
    useEffect(() => {
        if(user) {
            refetchAllMonsters();
            refetchAllDungeons();
        } else {
            setMonsters([]);
            setDungeons([]);
        }
    }, [user])

    return (
        <DataContext.Provider value={{monsters, refetchAllMonsters, dungeons, refetchAllDungeons}}>
            {props.children}
        </DataContext.Provider>
    );

}

export default DataContextProvider;