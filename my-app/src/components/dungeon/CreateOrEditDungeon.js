import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../contexts/DataContextProvider";
import { UserContext } from "../../contexts/UserContextProvider";
import { getDeepCopy } from "../../util";
import { createDungeon, editDungeon } from "../../services/DungeonService";
import { useParams } from "react-router-dom";

export default function CreateOrEditDungeon(props) {
    let id = useParams().id;
    const { dungeons, refetchAllDungeons } = useContext(DataContext);
    const { user } = useContext(UserContext);
    const [ waves, setWaves ] = useState([]);
    const [ name, setName ] = useState("");
    const [ tilesetName, setTilesetName] = useState("");
    const [ clientTilesetLocation, setClientTilesetLocation ] = useState("");
    const [ serverJsonLocation, setServerJsonLocation ] = useState("");

    useEffect(() => {
        // When editing we will load in data from firebase.
        if(dungeons && props.isEdit) {
            let dungeon = dungeons.filter((d) => d.name === id)[0];
            if(dungeon) {
                // Add id to waves and monsters in each wave. The id is used for the react key prop.
                dungeon.waves.forEach((w) => {
                    if(w.id === undefined) w.id = Math.random();
                    w.monsters.forEach((m) => {
                        if(m.id === undefined) m.id = Math.random();
                    })
                })
                setWaves(dungeon.waves);
                setName(dungeon.name);
                setTilesetName(dungeon.tilesetName);
                setClientTilesetLocation(dungeon.clientTilesetLocation);
                setServerJsonLocation(dungeon.serverJsonLocation);
            }
        }
    }, [dungeons]);
    

    const onChangeName = (e) => { setName(e.target.value); }
    const onChangeTilesetName = (e) => { setTilesetName(e.target.value); }
    const onChangeClientTilesetLocation = (e) => { setClientTilesetLocation(e.target.value); }
    const onChangeServerJsonLocation = (e) => { setServerJsonLocation(e.target.value); }

    const onChangeWaveType = (e, idx) => {
        let newWaves = [...waves];
        newWaves[idx].type = e.target.value;
        setWaves(newWaves);
    }
    const onChangeWaveDifficulty = (e, idx) => {
        let newWaves = [...waves];
        newWaves[idx].difficulty = parseInt(e.target.value);
        setWaves(newWaves);
    }
    const onChangeMonsterName = (e, idx, midx) => {
        let newWaves = [...waves];
        newWaves.forEach((newWave, idx2) => {
            newWave.monsters = [...waves[idx2].monsters];
            if(idx2 === idx) newWave.monsters[midx].name = e.target.value;
        })
        setWaves(newWaves);
    }
    const onChangeMonsterCount = (e, idx, midx) => {
        let newWaves = [...waves];
        newWaves.forEach((newWave, idx2) => {
            newWave.monsters = [...waves[idx2].monsters];
            if(idx2 === idx) newWave.monsters[midx].count = parseInt(e.target.value);
        })
        setWaves(newWaves);
    }

    const onClickNewWave = () => {
        let newWaves = [...waves];
        newWaves.push({ type: "pack", difficulty: 2, monsters: [], id: Math.random()});
        setWaves(newWaves);
    }
    const onClickDeleteWave = (idx) => { setWaves(waves.filter((wave, idx2) => idx2 !== idx)); }
    const onClickDeleteMonster = (widx, midx) => {
        let newWaves = getDeepCopy(waves);
        newWaves[widx].monsters = newWaves[widx].monsters.filter((monster, idx) => idx !== midx);
        setWaves(newWaves);
    }
    const onClickNewMonster = (idx) => {
        let newWaves = [...waves];
        newWaves.forEach((newWave, idx2) => {
            newWave.monsters = [...waves[idx2].monsters];
            if(idx2 === idx) newWave.monsters.push({name: "", count: 0, id: Math.random()});
        })
        setWaves(newWaves);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        let data = {
            name: name,
            tilesetName: tilesetName,
            clientTilesetLocation: clientTilesetLocation,
            serverJsonLocation: serverJsonLocation,
            waves: waves,
        }
        if(props.isEdit) {
            editDungeon(user, data).then((res) => {
                if(res.status === 200) {
                    refetchAllDungeons();
                }
                return res.json();
            }).then((data) => {
                console.log(data);
            })
        } else {
            createDungeon(user, data).then((res) => {
                if(res.status === 200) {
                    refetchAllDungeons();
                }
                return res.json();
            }).then((data) => {
                console.log(data);
            });
        }
        
    }

    return (
        <div>
            <h2>{props.isEdit ? "Edit Dungeon": "Create Dungeon"}</h2>
            <form onSubmit={onSubmit} style={{margin: "24px", backgroundColor: "lightgray", borderRadius: "5px"}}>
                <div style={{padding: "10px"}}>
                    <button type="submit" className="btn btn-primary">{props.isEdit? "Upload Changes" : "Upload New Dungeon"}</button>
                    <h3>General Information</h3>
                    <label htmlFor="name" >Name: </label>
                    <input name="name" type="text" onChange={onChangeName} defaultValue={name} />
                    <br/>
                    <label htmlFor="tilesetName">Tileset Name: </label>
                    <input name="tilesetName" type="text" onChange={onChangeTilesetName} defaultValue={tilesetName} />
                    <br/>
                    <label htmlFor="clientTilesetLocation">Client Tileset Location: </label>
                    <input name="clientTilesetLocation" type="text" onChange={onChangeClientTilesetLocation} defaultValue={clientTilesetLocation} style={{width: "500px"}}/>
                    <br/>
                    <label htmlFor="serverJsonLocation">Server JSON Location: </label>
                    <input name="serverJsonLocation" type="text" onChange={onChangeServerJsonLocation} defaultValue={serverJsonLocation} style={{width: "500px"}}/>
                    <br/>
                </div>
                <div style={{padding:"12px"}}>
                    <h3>Waves</h3>
                    <button className="btn btn-info" onClick={onClickNewWave} style={{alignItems: "center", marginBottom: "20px"}}>Add Wave To Dungeon</button>
                    <div style={{borderBottom: "3px solid black"}}/>
                    {
                        waves.map((wave, idx) => {
                            return (
                                <div key={`wave${wave.id}`} style={{backgroundColor: "lightgoldenrodyellow", borderBottom: "3px solid black", padding:"10px"}}>
                                    <h4 style={{display: 'inline-block', marginRight: "10px"}}>Wave {idx + 1}</h4>
                                    <button className="btn btn-danger" style={{marginBottom: "10px"}} onClick={() => onClickDeleteWave(idx)}>Delete Wave</button>
                                    <br/>
                                    <label htmlFor={`waveType${idx}`}>Type: </label>
                                    <input name={`waveType${idx}`} type="text" defaultValue={wave.type} onChange={(e) => onChangeWaveType(e, idx)}/>
                                    <label htmlFor={`waveDifficulty${idx}`}>Difficulty: </label>
                                    <input name={`waveDifficulty${idx}`} type="number" defaultValue={wave.difficulty} onChange={(e) => onChangeWaveDifficulty(e, idx)}/>
                                    <br/>
                                    <div style={{backgroundColor: "lightblue", margin: "30px", padding: "18px", borderRadius: "5px"}}>
                                        <h5>Monsters: </h5>
                                        <button className="btn btn-secondary" onClick={() => onClickNewMonster(idx)}>Add Monster To Wave</button>
                                        {
                                            wave.monsters.map((monster, midx) => {
                                                return (
                                                    <div key={`monster${monster.id}`}>
                                                        <h6 style={{display: 'inline-block', marginRight: "10px"}}>Monster {midx + 1}</h6>
                                                        <label htmlFor={`monsterName${idx}_${midx}`}>Name: </label>
                                                        <input name={`monsterName${idx}_${midx}`} type="text" defaultValue={monster.name} onChange={(e) => onChangeMonsterName(e, idx, midx)}/>
                                                        <label htmlFor={`monsterCount${idx}_${midx}`}>Count: </label>
                                                        <input name={`monsterCount${idx}_${midx}`} type="number" defaultValue={monster.count} onChange={(e) => onChangeMonsterCount(e, idx, midx)}/>
                                                        <button className="btn btn-danger" style={{margin: "10px"}} onClick={() => onClickDeleteMonster(idx, midx)}>Delete Monster</button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </form>
        </div>
    )

}

function Wave(props) { 



}