import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import Spinner from '../comman/Spinner';

const StaffRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useSelector((state: any) => state.auth || {});

  const token = auth.token || localStorage.getItem("token");
  const localUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
  const user = auth.user || localUser;
  const loading = auth.loading || false;

  const location = useLocation();
  
  // Backend se 'role' aa raha hai, use lowercase mein check karenge
  const userRole = user?.role?.toLowerCase();

  useEffect(() => {
    // Agar role staff ya teacher nahi hai toh error dikhao
    if (token && user && (userRole !== "staff" && userRole !== "teacher")) {
      toast.error(`Access Denied! ${user.role} cannot access staff area.`);
    }
  }, [token, user, userRole]);

  // --- Spinner Block ---
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black/5">
        <Spinner />
      </div>
    );
  }
  // --------------------

  // Final check using 'role'
  if (token && (userRole === "staff" || userRole === "teacher")) {
    return <>{children}</>;
  }

  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default StaffRoute;