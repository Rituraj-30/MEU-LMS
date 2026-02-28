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

  const userRole = currentUser?.role?.toLowerCase();

  useEffect(() => {
    if (currentToken && currentUser && userRole !== "student") {
      toast.error(`Access Denied! ${currentUser.role} cannot access this area.`);
    }
  }, [currentToken, currentUser, userRole]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black/5">
        <Spinner />
      </div>
    );
  }

  if (currentToken && userRole === "student") {
    return <>{children}</>;
  }

  if (currentToken && currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default StudentRoute;