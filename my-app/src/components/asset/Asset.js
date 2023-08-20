import { Link } from "react-router-dom";

export default function Asset() {



    return (
        <div>
            <h2>Assets!</h2>
            <Link to={`/asset/create`}>
                <button className="btn btn-info">Upload Asset</button>
            </Link>
        </div>
    )

}
