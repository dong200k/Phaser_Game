import { useContext } from "react"
import { UserContext } from "../contexts/UserContextProvider"

/** This component will hide child components when the user is not authorized. */
export default function Authorized(props) {

    let { user, userRole } = useContext(UserContext);
    let { roles } = props;

    if(!user) {
        return (
            <h2>Sign in to view monsters. You are not authenticated!</h2>
        )
    }

    if(!roles) {
        return (
            <h2>No access allowed. You are not authorized!</h2>
        )
    }

    if(roles && !roles.includes(userRole)){
        return (
            <h2>Your role of <strong>{userRole}</strong> is not authroized! Please upgrade your role!</h2>
        )
    }

    return (
        <div>
            {props.children}
        </div>
    )
}