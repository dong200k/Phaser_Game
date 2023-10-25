import { useContext } from "react"
import { UserContext } from "../contexts/UserContextProvider.js"
import JsonDBService from "../services/JsonDBService.js"

export const JsonDB = () => {
    const {user} = useContext(UserContext)
    const onClick = async () => {
        if(window.confirm("Do you want to move json assets in api server to firebase")){
            let success = await JsonDBService.moveAssets(user)
            if(success) alert("Moved assets successfully")
            else alert("Error moving assets")
        }
    }

    return(
        <div className="mt-5 text-center">
            <button className="btn btn-danger" onClick={onClick}>Move assets on api server to firebase</button>
        </div>
    )
}