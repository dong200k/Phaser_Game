import { useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../../contexts/DataContextProvider";
import { NotificationContext } from "../../contexts/NotificationContextProvider";

export default function Asset() {

    const { assets } = useContext(DataContext);
    const { notify } = useContext(NotificationContext);

    return (
        <div>
            <h2>Assets!</h2>
            <Link to={`/asset/create`}>
                <button className="btn btn-info">Upload Asset</button>
            </Link> 
            {
                (assets?.length ?? 0) === 0 ? "There are no assets.": 
                    assets.map((asset) => {
                        return (
                            <div className="d-flex justify-content-between mb-3" style={{width: "50%"}} key={asset.name}>
                                <div style={{textAlign: "center", display: "inline-block"}}>
                                    <h3 style={{display: "inline-block", marginRight: "10px"}}>{asset.name}</h3> 
                                    <Link to={`/asset/edit/${asset.name}`}><button className="btn btn-warning">edit</button></Link>
                                </div>
                                <button className="btn btn-danger" onClick={()=>{
                                    notify({message: "Cannot delete on my-app. Please manually delete on firebase."})
                                }}>delete</button>
                            </div>
                        )
                    })
            }
            
        </div>
    )

}
