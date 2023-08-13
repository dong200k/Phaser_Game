import { Link } from "react-router-dom";

export default function Monster() {
    return(
        <div>
            <h2> Monster !!! </h2>
            <Link to={`/monster/create`}>
                <button className="btn btn-info">Create New Monster</button>
            </Link>
        </div>
    )
}