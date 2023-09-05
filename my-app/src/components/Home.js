import { Link } from "react-router-dom";

export default function Home() {
    return(
        <div>
            <h1>Select an action</h1>
            <div><Link to="/upgrade"> <h2>View upgrades</h2></Link></div>
            <div><Link to="/skill"> <h2>View skills</h2></Link></div>
        </div>
    )
}