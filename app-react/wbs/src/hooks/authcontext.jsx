import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({
    userInfo: { isLoggedIn: false, userId: 0, userNameSurname: '' },
    signin: (email, password) => { },
    signup: (name, surname, email, password) => { },
    logout: () => { }
});

export function useAuthContext() {

    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuthContext must be used within a AuthProvider')
    }

    return context
}

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({ isLoggedIn: false, userId: 0, userNameSurname: '' });

    console.log("AuthProvider-isLoggedIn-", userInfo);

    useEffect(() => {

        const accessToken = localStorage.getItem("accesstoken");
        const refreshToken = localStorage.getItem("refreshtoken");

        if (accessToken !== null && refreshToken !== null) {
            //check if accesstoken ok
            setUserInfo(true);

            navigate('/clients');
        }
        else {
            navigate('/');
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
        const response = await fetch("http://127.0.0.1:5000/api/v1/auth/signin", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        const { accessToken, refreshToken, userId, userNameSurname } = result;

        localStorage.removeItem("accesstoken");

        localStorage.removeItem("refreshtoken");

        localStorage.setItem("accesstoken", accessToken);

        localStorage.setItem("refreshtoken", refreshToken);

        setUserInfo({ isLoggedIn: true, userId, userNameSurname });

        navigate('/clients');
    }

    /**
     * 
     * @param {string} name 
     * @param {string} surname 
     * @param {string} email 
     * @param {string} password 
     */
    async function signupHandler(name, surname, email, password) {

    }

    async function logoutHandler() {
        localStorage.removeItem("accesstoken");

        localStorage.removeItem("refreshtoken");

        setUserInfo({ isLoggedIn: false, userId: 0, userNameSurname: '' });

        navigate('/');
    }

    return (
        <AuthContext.Provider value={{
            userInfo,
            signin: signinHandler,
            signup: signupHandler,
            logout: logoutHandler
        }} >
            {
                children
            }
        </AuthContext.Provider>
    )
}