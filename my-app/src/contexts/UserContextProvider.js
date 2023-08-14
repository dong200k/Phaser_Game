import React, { createContext, Component, useState, useEffect } from "react";
import ClientFirebaseConnection from "../firebase/ClientFirebaseConnection";

/** The user context contains the state of the user/cred, updated by Firebase. */
export const UserContext = createContext();

/** The user context provider will wrap the whole application, thereby allowing child components to access the user context. */
const UserContextProvider = (props) => {

    const [user, setUser] = useState(ClientFirebaseConnection.singleton.user);
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        ClientFirebaseConnection.singleton.onUserStateChange = (user) => {
            user.getIdToken().then((token) => {
                setUser(user);
                setUserToken(token);
            }).catch((e) => {
                console.log(e);
            })
        };
    }, []);
    

    return (
        <UserContext.Provider value={{user: user, userToken: userToken}}>
            {props.children}
        </UserContext.Provider>
    );

}

export default UserContextProvider;