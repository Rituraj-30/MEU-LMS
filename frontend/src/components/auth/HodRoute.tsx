import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

import Spinner from '../comman/Spinner';

const HodRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useSelector((state: any) => state.auth || {});

  const token = auth.token || localStorage.getItem("token");
  const localUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
  const user = auth.user || localUser;
  const loading = auth.loading || false;

  const location = useLocation();
  const userRole = user?.role?.toLowerCase();

  useEffect(() => {
    if (token && user && userRole !== "hod") {
      toast.error(`Access Denied! Only HOD can access this area.`);
    }
  }, [token, user, userRole]);

  // --- Spinner Implementation ---
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }
  // ------------------------------

  if (token && userRole === "hod") {
    return <>{children}</>;
  }

  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default HodRoute;