import { useContext } from "react";
import { UserContext } from "../../contexts/UserContextProvider";


export default function Admin() {
    const { userToken } = useContext(UserContext);

    
}