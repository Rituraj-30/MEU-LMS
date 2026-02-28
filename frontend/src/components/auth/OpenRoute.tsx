import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../redux/store";

interface Props {
  children: React.ReactNode;
}

const OpenRoute = ({ children }: Props) => {
  const { token } = useSelector((state: RootState) => state.auth);

  
  if (token === null) {
    return <>{children}</>;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

export default OpenRoute;