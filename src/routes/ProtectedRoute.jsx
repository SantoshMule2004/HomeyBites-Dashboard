import { Navigate, Outlet } from "react-router-dom";
import { useUserInfo } from "../Context/UserContext";

const ProtectedRoute = ({ allowedRoles }) => {

    const { isLoggedIn, getUserRole } = useUserInfo();
    const userRole = getUserRole()

    // Not logged in
    if (!isLoggedIn()) {
        return <Navigate to="/auth/login" replace />;
    }

    // Logged in but wrong role
    if (
        allowedRoles &&
        !allowedRoles.includes(userRole)
    ) {
        if (userRole === "ROLE_ADMIN") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        return <Navigate to="/provider/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;