import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react"
import { deleteMonster, getAllMonsters } from "../../services/MonsterService";
import { UserContext } from "../../contexts/UserContextProvider";
import { DataContext } from "../../contexts/DataContextProvider";

export default function Monster() {

    const { monsters, refetchAllMonsters } = useContext(DataContext);
    const { user } = useContext(UserContext);


    return(
        <div>
            <h2> Monster !!! </h2>
            <Link to={`/monster/create`}>
                <button className="btn btn-info">Create New Monster</button>
            </Link>
            <div>
                {
                    (monsters?.length ?? 0) === 0 ? "There are no monsters.": 
                    monsters.map((monster) => {
                        return (
                            <div className="d-flex justify-content-between mb-3" style={{width: "50%"}} key={monster.name}>
                                <div style={{textAlign: "center", display: "inline-block"}}>
                                    <h3 style={{display: "inline-block", marginRight: "10px"}}>{monster.name}</h3> 
                                    <Link to={`/monster/edit/${monster.name}`}><button className="btn btn-warning">edit</button></Link>
                                </div>
                                <button className="btn btn-danger" onClick={()=>{
                                    deleteMonster(user, monster.name).then((res) => {
                                        if(res.status === 200) {
                                            refetchAllMonsters();
                                        }
                                    });
                                }}>delete</button>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}