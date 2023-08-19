import { useContext } from "react";
import { DataContext } from "../../contexts/DataContextProvider";
import { UserContext } from "../../contexts/UserContextProvider";
import { Link } from "react-router-dom";
import { NotificationContext } from "../../contexts/NotificationContextProvider";


export default function Dungeon() {

    const { dungeons, refetchAllDungeons } = useContext(DataContext);
    const { user } = useContext(UserContext);
    const { notify } = useContext(NotificationContext);
    
    return(
        <div>
            <h2> Dungeon View </h2>
            <Link to={`/dungeon/create`}>
                <button className="btn btn-info">Create Dungeon</button>
            </Link>
            <div>
                {
                    (dungeons?.length ?? 0) === 0 ? "There are no dungeons.": 
                    dungeons.map((dungeon) => {
                        return (
                            <div className="d-flex justify-content-between mb-3" style={{width: "50%"}} key={dungeon.name}>
                                <div style={{textAlign: "center", display: "inline-block"}}>
                                    <h3 style={{display: "inline-block", marginRight: "10px"}}>{dungeon.name}</h3> 
                                    
                                </div>
                                <div>
                                    <Link to={`/dungeon/edit/${dungeon.name}`}>
                                        <button className="btn btn-primary" style={{margin: "0px 24px", width: "80px"}}>edit</button>
                                    </Link>
                                    <button className="btn btn-danger" onClick={()=>{
                                        console.log("No deleting.");
                                        notify({message: "Cannot delete on my-app. Please manually delete on firebase."})
                                        // deleteMonster(user, monster.name).then((res) => {
                                        //     if(res.status === 200) {
                                        //         refetchAllDungeons();
                                        //     }
                                        // });
                                    }}>delete</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}