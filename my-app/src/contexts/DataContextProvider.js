import React, { createContext, Component, useState, useContext, useEffect } from "react";
import { getAllMonsters } from "../services/MonsterService";
import { UserContext } from "./UserContextProvider";
import { getAllDungeons } from "../services/DungeonService";
import { getAllAssets } from "../services/AssetService";
import CollectionService from "../services/CollectionService.js";
import { getDefaultAbility, getDefaultArtifact, getDefaultNode, getDefaultRole, getDefaultSkill, getDefaultUpgrade, getDefaultWeapon, removeD3TreeInfo } from "../helpers.js";

/** The data context contains the data the is fetched from firebase. 
 * These include monster data, dungeon data, etc.
 * */
export const DataContext = createContext();

const DataContextProvider = (props) => {

    let [monsters, setMonsters] = useState([]);
    let [dungeons, setDungeons] = useState([]);
    let [assets, setAssets] = useState([]);
    let [roles, setRoles] = useState([])
    let [abilities, setAbilities] = useState([])
    let [nodes, setNodes] = useState([])
    let [upgrades, setUpgrades] = useState([])
    let [skills, setSkills] = useState([])
    let [weapons, setWeapons] = useState([])

    const { user } = useContext(UserContext);
    const allowedCols = ["roles", "abilities", "nodes", "upgrades", "skills", "weapons"]

    const getColState = (colName) => {
        switch(colName){
            case "roles":
                return [roles, setRoles]
            case "abilities":
                return [abilities, setAbilities]
            case "nodes":
                return [nodes, setNodes]
            case "upgrades":
                return [upgrades, setUpgrades]
            case "skills":
                return [skills, setSkills]
            case "weapons":
                return [weapons, setWeapons]
            default:
                break;
        }
    }

    const assertColNameValidity = (colName) => {
        const allowedColNames = allowedCols
        if(!allowedColNames.find(name=>name===colName)) throw new Error(`${colName} is not a valid collection`)
    }
 
    // Update :colName with data from firebase
    const refetchFromCollection = (colName) => {
        assertColNameValidity(colName)
        if(user){
            CollectionService.getAllDocuments(colName, user)
                .then((res)=>{
                    let {documents} = res
                    let [docs, setDocs] = getColState(colName)
                    setDocs(documents)
                })
                .catch(e=>{
                    console.log(`Error fetching all from collection ${colName}`)
                    console.log(e.message)
                })
        }
    }

    const deleteDocument = async (id, colName) => {
        assertColNameValidity(colName)
        let [docs, setDocs] = getColState(colName)

        try {
            await CollectionService.deleteDocument(id, colName, user);
            setDocs(prevDocs => {
                return prevDocs.filter(prevDoc => prevDoc.id !== id);
            });
            alert("Document deleted successfully");
            return true;
        } catch (e) {
            console.log(`Error deleting document ${id}`);
        }
    }

    const getDocument = async (id, colName) => {
        assertColNameValidity(colName)

        try {
            const res = await CollectionService.getDocument(id, colName, user);
            return res.document;
        } catch (e) {
            console.log(`Error getting document ${id}`);
        }
    }

    const saveDocument = async (document, colName, doAlert=true) => {
        assertColNameValidity(colName)
        let [, setDocs] = getColState(colName)

        if(["upgrades", "skills"].find(name=>name===colName)){
            document = removeD3TreeInfo(document)
        }

        try {
            await CollectionService.saveDocument(document, colName, user);
            setDocs(prevDocs => {
                return prevDocs.map(prevDoc => {
                    if (prevDoc.id === document.id) {
                        return document;
                    }
                    return prevDoc;
                });
            });
            if (doAlert) alert("Document saved successfully");
            return true;
        } catch (e) {
            console.log(`Error saving document ${document.id}`);
        }
    }

    const createDocument = async (colName, type) => {
        assertColNameValidity(colName)
        let [, setDocs] = getColState(colName)
        let defaultDoc
        
        switch(colName){
            case "roles":
                defaultDoc = getDefaultRole(); break;
            case "abilities":
                defaultDoc = getDefaultAbility(); break;
            case "nodes":
                defaultDoc = getDefaultNode();  break;
            case "upgrades":
                if(type === "artifact")
                    defaultDoc = getDefaultArtifact(); 
                else
                    defaultDoc = getDefaultUpgrade();
                break;
            case "skills":
                defaultDoc = getDefaultSkill(); break;
            case "weapons":
                defaultDoc = getDefaultWeapon(); break;
            default:
                break;
        }
        
        try {
            await CollectionService.createDocument(defaultDoc, colName, user);
            setDocs(prevDocs => {
                return [defaultDoc, ...prevDocs];
            });
            alert("Document created successfully");
            return defaultDoc;
        } catch (e) {
            console.log(`Error creating document ${defaultDoc.id}`);
        }
    }

    const getDocFromLocalCollection = (id, colName) => {
        assertColNameValidity(colName)
        let [docs,] = getColState(colName)

        return docs.find(document=>document.id===id)
    }

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

    const refetchAllAssets = () => {
        if(user) {
            getAllAssets(user).then((a) => {
                setAssets(a);
            }).catch(e => {
                setAssets([]);
                console.log(e);
            })
        }
    }

    // When the user logs in fetch data. When user logs out remove data.
    useEffect(() => {
        if(user) {
            refetchAllMonsters();
            refetchAllDungeons();
            refetchAllAssets();
            allowedCols.forEach(colName=>{
                refetchFromCollection(colName)
            })
        } else {
            setMonsters([]);
            setDungeons([]);
            setAssets([]);
            allowedCols.forEach(colName=>{
                let [, setDocs] = getColState(colName)
                setDocs([])
            })
        }
    }, [user])

    return (
        <DataContext.Provider value={{
            monsters, dungeons, assets, roles, abilities, nodes, upgrades, skills, weapons,
            refetchAllMonsters, refetchAllDungeons, refetchAllAssets, 
            saveDocument, deleteDocument, createDocument, refetchFromCollection, getDocument, getDocFromLocalCollection
        }}>
            {props.children}
        </DataContext.Provider>
    );

}

export default DataContextProvider;