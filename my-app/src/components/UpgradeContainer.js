import { Link } from "react-router-dom";

export default function UpgradeContainer({upgrade}){
    return(
        <div style={{textAlign: "center", display: "inline-block"}}>
            <h3 style={{display: "inline-block", marginRight: "10px"}}>{upgrade.name}</h3> 
            <Link to={`/upgrade/${upgrade.id}`}><button className="btn btn-warning">edit</button></Link>
        </div>
    )
}