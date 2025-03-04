import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

function ProtectedRoute() {
    const {loading, isAuthenticated } = useAuth()           // obtiene el estado de autenticacion

    if (loading) {                      // si esta cargando
        return <h1>Loading...</h1>      // muestra un mensaje de carga
    }
    if (!loading && !isAuthenticated) return <Navigate to="/login" replace />    // si no esta cargando y no esta autenticado, redirige a login
    
    return (
        <Outlet />
    )
}

export default ProtectedRoute