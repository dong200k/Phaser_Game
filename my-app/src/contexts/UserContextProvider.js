import React, { createContext, Component, useState, useEffect } from "react";
import ClientFirebaseConnection from "../firebase/ClientFirebaseConnection";

/** The user context contains the state of the user/cred, updated by Firebase. */
export const UserContext = createContext();

/** The user context provider will wrap the whole application, thereby allowing child components to access the user context. */
const UserContextProvider = (props) => {

    const [user, setUser] = useState(ClientFirebaseConnection.singleton.user);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        ClientFirebaseConnection.singleton.onUserStateChange = (user) => {
            setUser(user);
        };
    }, []);
    
    useEffect(() => {
        if(user) {
            user.getIdTokenResult().then((token) => {
                if(token.claims.role) setUserRole(token.claims.role);
                else setUserRole("");
            })
        } else {
            setUserRole("");
        }
    }, [user]);

    return (
        <UserContext.Provider value={{user: user, userRole: userRole}}>
            {props.children}
        </UserContext.Provider>
    );

}

export default UserContextProvider;