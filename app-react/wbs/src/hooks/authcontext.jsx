import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext({ isLoggedIn: false, userId: 0, signin: (name, surname, email, password) => { } });

export function useAuthContext() {

    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuthContext must be used within a AuthProvider')
    }

    return context
}

export const AuthProvider = ({ children }) => {

    console.log("AuthProvider render")

    const [isLoggedIn, setIsLoggedIn] = useState({ isLoggedIn: false });
    const [userId, setUserId] = useState(0);

    console.log("AuthProvider-isLoggedIn-", isLoggedIn);

    useEffect(() => {

        const accessToken = localStorage.getItem("accesstoken");
        const refreshToken = localStorage.getItem("refreshtoken");

        if (accessToken !== null || refreshToken !== null) {
            //check if accesstoken ok
            setIsLoggedIn(true);
            setUserId(10);
            return;
        }



        return () => {

        }
    }, [])

    /**
     * 
     * @param {string} email 
     * @param {string} password 
     */
    async function signinHandler(email, password) {
        // console.log("AuthProvider-signinhandler", email, password)
        const response = await fetch("http://127.0.0.1:5000/signin", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        // console.log(result)

        localStorage.setItem("accesstoken", result.accessToken);
        localStorage.setItem("refreshtoken", result.refreshToken);

        setIsLoggedIn(true);
        setUserId(result.userId);
    }

    /**
     * 
     * @param {string} name 
     * @param {string} surname 
     * @param {string} email 
     * @param {string} password 
     */
    async function signup(name, surname, email, password) {

    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, signin: signinHandler }} >
            {
                children
            }
        </AuthContext.Provider>
    )
}