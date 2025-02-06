import { createContext, useEffect, useState } from "react";

import axios from 'axios';

export const AppContext=createContext()

const AppContextProvider=(props)=>{
    
//    const backendUrl=import.meta.env.VITE_BACKEND_URL
//    const[token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
   
    
    const value={
       
    }

   

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}
export default AppContextProvider