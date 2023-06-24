import { Link } from "react-router-dom";

export default function SkillContainer({skill}){
    return(
        <div style={{textAlign: "center", display: "inline-block"}}>
            <h3 style={{display: "inline-block", marginRight: "10px"}}>{skill.name}</h3> 
            <Link to={`/skill/${skill.id}`}><button className="btn btn-warning">edit</button></Link>
        </div>
    )
}