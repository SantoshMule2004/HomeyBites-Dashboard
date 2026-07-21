import { Navigate } from "react-router-dom";
import { useUserInfo } from "../Context/UserContext";

export default function HomeRedirect() {
    const { isLoggedIn, getUserRole } = useUserInfo();
    const userRole = getUserRole()

    // Not logged in
     if (!isLoggedIn()) {
        return <Navigate to="/auth/login" replace />;
    }

    // Logged in
    switch (userRole) {
        case "ROLE_ADMIN":
            return <Navigate to="/admin/dashboard" replace />;

        case "ROLE_TIFFIN_PROVIDER":
            return <Navigate to="/provider/dashboard" replace />;

        default:
            return <Navigate to="/login" replace />;
    }
};