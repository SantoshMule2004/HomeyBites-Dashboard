import { Navigate, Outlet } from "react-router-dom";
import { useUserInfo } from "../Context/UserContext";

const PublicRoute = () => {
    const { isLoggedIn, getUserRole } = useUserInfo();
    const userRole = getUserRole()

    return isLoggedIn()
        ? (userRole === "ROLE_ADMIN" ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/provider/dashboard" replace />)
        : <Outlet />
};

export default PublicRoute;