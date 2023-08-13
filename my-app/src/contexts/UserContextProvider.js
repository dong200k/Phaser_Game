import React, { createContext, Component, useState } from "react";
import ClientFirebaseConnection from "../firebase/ClientFirebaseConnection";

/** The user context contains the state of the user/cred, updated by Firebase. */
export const UserContext = createContext();

/** The user context provider will wrap the whole application, thereby allowing child components to access the user context. */
const UserContextProvider = (props) => {

    const [user, setUser] = useState(ClientFirebaseConnection.singleton.user);
    ClientFirebaseConnection.singleton.onUserStateChange = (user) => {setUser(user)};

    return (
        <UserContext.Provider value={{user: user}}>
            {props.children}
        </UserContext.Provider>
    );

}

export default UserContextProvider;