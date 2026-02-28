import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import Spinner from '../comman/Spinner';

const StudentRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, token, loading } = useSelector((state: any) => state.auth);
  const location = useLocation();
 
  const localUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
  const currentUser = user || localUser;
  const currentToken = token || localStorage.getItem("token");

  // Backend se 'role' aa raha hai, lowercase check
  const userRole = currentUser?.role?.toLowerCase();

  useEffect(() => {
    // Agar login hai par role student nahi hai toh toast dikhao
    if (currentToken && currentUser && userRole !== "student") {
      toast.error(`Access Denied! ${currentUser.role} cannot access this area.`);
    }
  }, [currentToken, currentUser, userRole]);

  // --- Spinner Implementation ---
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black/5">
        <Spinner />
      </div>
    );
  }
  // ------------------------------

  // Final logic using 'role'
  if (currentToken && userRole === "student") {
    return <>{children}</>;
  }

  // Agar logged in hai par student nahi, toh dashboard par wapas bhejo
  if (currentToken && currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // Agar logged in hi nahi hai
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default StudentRoute;