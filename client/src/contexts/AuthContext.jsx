import { createContext, useState } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({children})=>{

    const [auth, setAuth]=useState({});

    const accessToken = localStorage.getItem("accessToken");
    

    const image = localStorage.getItem("profileImage");
    const name = localStorage.getItem("name")
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phone");

    if (accessToken && role && !auth.accessToken) {
        setAuth({ accessToken, role, image, name, email, phone });
    };
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )

}