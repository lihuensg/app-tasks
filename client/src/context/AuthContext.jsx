import { createContext, useState, useContext, useEffect } from 'react';
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deberia estar dentro de un AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            console.log(res.data);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setErrors(error.response.data);
        }
    }

    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            console.log(res.data);
            setIsAuthenticated(true);
            setUser(res.data);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors(error.response.data);
        }
    }

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    });

    useEffect(() => {
        async function checkLogin() {       
            const cookies = Cookies.get();      // obtiene las cookies

            if (!cookies.token) {           // si no hay token en las cookies
                setIsAuthenticated(false);  // no esta autenticado
                setLoading(false);          // no esta cargando
                return setUser(null);       // no hay usuario
            }

            try {       // si hay token en las cookies
                const res = await verifyTokenRequest(cookies.token); // verifica el token y envia al backend
                if (!res.data) {        // si no hay data en la respuesta
                    setIsAuthenticated(false);   // no esta autenticado
                    setLoading(false);          // no esta cargando
                    return;                     // no hay usuario
                } // si hay data en la respuesta
                setIsAuthenticated(true);       // esta autenticado
                setUser(res.data);              // hay usuario
                setLoading(false);              // no esta cargando
            }     
            catch (error) {             // si hay error
                setIsAuthenticated(false);   // no esta autenticado
                setUser(null);               // no hay usuario
                setLoading(false);         // no esta cargando
            }
        }
        checkLogin();       // llama a la funcion
    }, []);         

    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            loading,
            user,
            isAuthenticated,
            errors,
        }}>
            {children}
        </AuthContext.Provider>
    );
};