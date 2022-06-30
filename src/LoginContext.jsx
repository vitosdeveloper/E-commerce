import React, { useContext, useState } from 'react';

const IsLoggedInContext = React.createContext();
const SetIsLoggedInContext = React.createContext();

export function useLoggedIn(){
    return useContext(IsLoggedInContext)
};
export function useLoggedInUpdate(){
    return useContext(SetIsLoggedInContext)
};

export function IsLoggedInProvider({ children }){

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    return (
        <IsLoggedInContext.Provider value={isLoggedIn}>
            <SetIsLoggedInContext.Provider value={setIsLoggedIn}>
                {children}
            </SetIsLoggedInContext.Provider>
        </IsLoggedInContext.Provider>
    )
}